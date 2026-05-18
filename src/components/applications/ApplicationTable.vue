<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PriorityBadge from '@/components/common/PriorityBadge.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useToast } from '@/composables/useToast'
import { formatDate, formatSalary, STATUSES } from '@/utils/helpers'

const props = defineProps({
  applications: { type: Array, required: true }
})

const store = useApplicationsStore()
const { success, error } = useToast()

const sortKey        = ref('created_at')
const sortAsc        = ref(false)
const selected       = ref(new Set())
const deleteTarget   = ref(null)
const bulkConfirm    = ref(false)
const updatingStatus = ref(null)

const sorted = computed(() => {
  return [...props.applications].sort((a, b) => {
    const av = a[sortKey.value] ?? ''
    const bv = b[sortKey.value] ?? ''
    if (av < bv) return sortAsc.value ? -1 : 1
    if (av > bv) return sortAsc.value ?  1 : -1
    return 0
  })
})

function setSort(key) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
}

function toggleSelect(id) {
  if (selected.value.has(id)) selected.value.delete(id)
  else selected.value.add(id)
  selected.value = new Set(selected.value)
}

function toggleAll() {
  selected.value = selected.value.size === sorted.value.length
    ? new Set()
    : new Set(sorted.value.map(a => a.id))
}

async function doDelete() {
  try {
    await store.deleteApplication(deleteTarget.value.id)
    selected.value.delete(deleteTarget.value.id)
    success(`Deleted ${deleteTarget.value.company_name}`)
  } catch { error('Failed to delete') }
  finally { deleteTarget.value = null }
}

async function doBulkDelete() {
  const ids = [...selected.value]
  try {
    await store.bulkDelete(ids)
    selected.value = new Set()
    success(`Deleted ${ids.length} application${ids.length > 1 ? 's' : ''}`)
  } catch { error('Failed to delete') }
  finally { bulkConfirm.value = false }
}

async function quickStatus(app, newStatus) {
  if (app.status === newStatus) return
  updatingStatus.value = app.id
  try {
    await store.updateApplication(app.id, { status: newStatus })
    success(`Status → ${newStatus}`)
  } catch { error('Failed to update status') }
  finally { updatingStatus.value = null }
}

const COLS = [
  { key: 'company_name', label: 'Company' },
  { key: 'job_title',    label: 'Role' },
  { key: 'status',       label: 'Status' },
  { key: 'priority',     label: 'Priority',  hidden: 'md' },
  { key: 'date_applied', label: 'Applied',   hidden: 'lg' }
]
</script>

<template>
  <div>
    <!-- Bulk bar -->
    <Transition name="slide-down">
      <div v-if="selected.size > 0"
        class="mb-3 flex items-center justify-between px-4 py-2.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-xl">
        <span class="text-sm font-medium text-blue-700 dark:text-blue-400">{{ selected.size }} selected</span>
        <button class="text-sm text-red-600 dark:text-red-400 font-semibold hover:underline" @click="bulkConfirm = true">
          Delete selected
        </button>
      </div>
    </Transition>

    <!-- Table -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="pl-4 pr-2 py-3 w-10">
                <input type="checkbox" class="rounded accent-blue-600"
                  :checked="selected.size === sorted.length && sorted.length > 0"
                  @change="toggleAll" />
              </th>
              <th
                v-for="col in COLS" :key="col.key"
                class="px-3 py-3 text-left font-semibold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wide cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200 whitespace-nowrap transition-colors"
                :class="col.hidden === 'md' ? 'hidden md:table-cell' : col.hidden === 'lg' ? 'hidden lg:table-cell' : ''"
                @click="setSort(col.key)"
              >
                {{ col.label }}
                <span class="ml-0.5 opacity-40 text-[10px]">{{ sortKey === col.key ? (sortAsc ? '↑' : '↓') : '↕' }}</span>
              </th>
              <th class="hidden xl:table-cell px-3 py-3 text-left font-semibold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wide">Salary</th>
              <th class="px-3 py-3 text-right font-semibold text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-800/50">
            <tr v-for="app in sorted" :key="app.id"
              class="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors"
              :class="selected.has(app.id) ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''">

              <td class="pl-4 pr-2 py-3">
                <input type="checkbox" class="rounded accent-blue-600"
                  :checked="selected.has(app.id)"
                  @change="toggleSelect(app.id)" />
              </td>

              <!-- Company -->
              <td class="px-3 py-3">
                <RouterLink :to="{ name: 'application-detail', params: { id: app.id } }"
                  class="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span v-if="app.is_favourite" class="text-amber-400 text-xs shrink-0">★</span>
                  <span class="truncate max-w-[140px] sm:max-w-none">{{ app.company_name }}</span>
                </RouterLink>
              </td>

              <!-- Role -->
              <td class="px-3 py-3 text-gray-500 dark:text-gray-400 max-w-[160px]">
                <span class="truncate block">{{ app.job_title }}</span>
              </td>

              <!-- Status (clickable select overlay) -->
              <td class="px-3 py-3">
                <div class="relative inline-block">
                  <StatusBadge :status="app.status" />
                  <select
                    class="absolute inset-0 opacity-0 cursor-pointer w-full"
                    :value="app.status"
                    :disabled="updatingStatus === app.id"
                    @change="quickStatus(app, $event.target.value)"
                  >
                    <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>
              </td>

              <!-- Priority -->
              <td class="px-3 py-3 hidden md:table-cell">
                <PriorityBadge :priority="app.priority || 'Medium'" />
              </td>

              <!-- Date -->
              <td class="px-3 py-3 hidden lg:table-cell text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap">
                {{ formatDate(app.date_applied) }}
              </td>

              <!-- Salary -->
              <td class="px-3 py-3 hidden xl:table-cell text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap">
                {{ formatSalary(app.salary_min, app.salary_max) }}
              </td>

              <!-- Actions -->
              <td class="px-3 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <RouterLink :to="{ name: 'edit-application', params: { id: app.id } }"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                    title="Edit">
                    <!-- Heroicon: pencil-square -->
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                    </svg>
                  </RouterLink>
                  <button
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Delete"
                    @click="deleteTarget = app">
                    <!-- Heroicon: trash -->
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="sorted.length === 0" class="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
        No applications match your current filters
      </div>
    </div>

    <!-- Modals -->
    <ConfirmModal v-if="deleteTarget"
      :title="`Delete ${deleteTarget.company_name}?`"
      message="This will permanently remove the application and all its timeline history."
      confirm-text="Delete"
      @confirm="doDelete"
      @cancel="deleteTarget = null"
    />
    <ConfirmModal v-if="bulkConfirm"
      :title="`Delete ${selected.size} applications?`"
      message="This will permanently remove the selected applications and all associated data."
      confirm-text="Delete All"
      @confirm="doBulkDelete"
      @cancel="bulkConfirm = false"
    />
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
