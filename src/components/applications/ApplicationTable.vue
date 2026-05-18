<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PriorityBadge from '@/components/common/PriorityBadge.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useToast } from '@/composables/useToast'
import { formatDate, formatSalary } from '@/utils/helpers'

const props = defineProps({
  applications: { type: Array, required: true }
})

const store = useApplicationsStore()
const { success, error } = useToast()

const sortKey = ref('created_at')
const sortAsc = ref(false)
const selected = ref(new Set())
const deleteTarget = ref(null)
const bulkDeleteConfirm = ref(false)
const updatingStatus = ref(null)

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn']

const sorted = computed(() => {
  return [...props.applications].sort((a, b) => {
    let av = a[sortKey.value] ?? ''
    let bv = b[sortKey.value] ?? ''
    if (av < bv) return sortAsc.value ? -1 : 1
    if (av > bv) return sortAsc.value ? 1 : -1
    return 0
  })
})

function setSort(key) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
}

function sortIcon(key) {
  if (sortKey.value !== key) return '↕'
  return sortAsc.value ? '↑' : '↓'
}

function toggleSelect(id) {
  if (selected.value.has(id)) selected.value.delete(id)
  else selected.value.add(id)
  selected.value = new Set(selected.value)
}

function toggleAll() {
  if (selected.value.size === sorted.value.length) selected.value = new Set()
  else selected.value = new Set(sorted.value.map(a => a.id))
}

async function confirmDelete(app) {
  deleteTarget.value = app
}

async function doDelete() {
  try {
    await store.deleteApplication(deleteTarget.value.id)
    selected.value.delete(deleteTarget.value.id)
    success(`Deleted ${deleteTarget.value.company_name}`)
  } catch (e) {
    error('Failed to delete')
  } finally {
    deleteTarget.value = null
  }
}

async function doBulkDelete() {
  const ids = [...selected.value]
  try {
    await store.bulkDelete(ids)
    selected.value = new Set()
    success(`Deleted ${ids.length} application${ids.length > 1 ? 's' : ''}`)
  } catch (e) {
    error('Failed to delete applications')
  } finally {
    bulkDeleteConfirm.value = false
  }
}

async function quickStatusChange(app, newStatus) {
  if (app.status === newStatus) return
  updatingStatus.value = app.id
  try {
    await store.updateApplication(app.id, { status: newStatus })
    success(`Status updated to ${newStatus}`)
  } catch {
    error('Failed to update status')
  } finally {
    updatingStatus.value = null
  }
}
</script>

<template>
  <div>
    <!-- Bulk action bar -->
    <Transition name="slide-down">
      <div
        v-if="selected.size > 0"
        class="mb-3 flex items-center justify-between px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
      >
        <span class="text-sm font-medium text-blue-700 dark:text-blue-400">
          {{ selected.size }} selected
        </span>
        <button
          class="text-sm text-red-600 dark:text-red-400 font-medium hover:underline"
          @click="bulkDeleteConfirm = true"
        >
          Delete selected
        </button>
      </div>
    </Transition>

    <!-- Table wrapper -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700">
              <th class="pl-4 pr-2 py-3 w-10">
                <input
                  type="checkbox"
                  class="rounded accent-blue-600"
                  :checked="selected.size === sorted.length && sorted.length > 0"
                  :indeterminate="selected.size > 0 && selected.size < sorted.length"
                  @change="toggleAll"
                />
              </th>
              <th
                v-for="col in [
                  { key: 'company_name', label: 'Company' },
                  { key: 'job_title',    label: 'Role' },
                  { key: 'status',       label: 'Status' },
                  { key: 'priority',     label: 'Priority' },
                  { key: 'date_applied', label: 'Applied' }
                ]"
                :key="col.key"
                class="px-3 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                :class="col.key === 'priority' ? 'hidden md:table-cell' : col.key === 'date_applied' ? 'hidden lg:table-cell' : ''"
                @click="setSort(col.key)"
              >
                {{ col.label }}
                <span class="ml-1 text-xs opacity-50">{{ sortIcon(col.key) }}</span>
              </th>
              <th class="hidden xl:table-cell px-3 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">Salary</th>
              <th class="px-3 py-3 text-right font-semibold text-gray-500 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 dark:divide-gray-700/50">
            <tr
              v-for="app in sorted"
              :key="app.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              :class="selected.has(app.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''"
            >
              <td class="pl-4 pr-2 py-3">
                <input
                  type="checkbox"
                  class="rounded accent-blue-600"
                  :checked="selected.has(app.id)"
                  @change="toggleSelect(app.id)"
                />
              </td>

              <!-- Company -->
              <td class="px-3 py-3">
                <RouterLink
                  :to="{ name: 'application-detail', params: { id: app.id } }"
                  class="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <span class="w-2 h-2 rounded-full shrink-0" :class="app.is_favourite ? 'bg-amber-400' : 'bg-transparent'"></span>
                  <span class="truncate max-w-[140px] sm:max-w-none">{{ app.company_name }}</span>
                </RouterLink>
              </td>

              <!-- Role -->
              <td class="px-3 py-3 text-gray-600 dark:text-gray-400 max-w-[160px]">
                <span class="truncate block">{{ app.job_title }}</span>
              </td>

              <!-- Status (inline edit) -->
              <td class="px-3 py-3">
                <div class="relative group/status">
                  <StatusBadge :status="app.status" />
                  <!-- Quick status dropdown -->
                  <select
                    class="absolute inset-0 opacity-0 cursor-pointer w-full"
                    :value="app.status"
                    :disabled="updatingStatus === app.id"
                    @change="quickStatusChange(app, $event.target.value)"
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
              <td class="px-3 py-3 hidden lg:table-cell text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                {{ formatDate(app.date_applied) }}
              </td>

              <!-- Salary -->
              <td class="px-3 py-3 hidden xl:table-cell text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                {{ formatSalary(app.salary_min, app.salary_max) }}
              </td>

              <!-- Actions -->
              <td class="px-3 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <RouterLink
                    :to="{ name: 'edit-application', params: { id: app.id } }"
                    class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Edit"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </RouterLink>
                  <button
                    class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete"
                    @click="confirmDelete(app)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty row -->
      <div v-if="sorted.length === 0" class="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
        No applications match your filters
      </div>
    </div>

    <!-- Delete confirm -->
    <ConfirmModal
      v-if="deleteTarget"
      :title="`Delete ${deleteTarget.company_name}?`"
      message="This will permanently remove the application and all its timeline history."
      confirm-text="Delete"
      @confirm="doDelete"
      @cancel="deleteTarget = null"
    />

    <ConfirmModal
      v-if="bulkDeleteConfirm"
      :title="`Delete ${selected.size} applications?`"
      message="This will permanently remove the selected applications and all their data."
      confirm-text="Delete All"
      @confirm="doBulkDelete"
      @cancel="bulkDeleteConfirm = false"
    />
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
