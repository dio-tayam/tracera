<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import draggable from 'vuedraggable'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PriorityBadge from '@/components/common/PriorityBadge.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useToast } from '@/composables/useToast'
import { formatDate, STATUS_CONFIG, STATUSES } from '@/utils/helpers'

const props = defineProps({
  applications: { type: Array, required: true }
})

const store = useApplicationsStore()
const { success, error } = useToast()

const columns = computed(() =>
  STATUSES.map(status => ({
    status,
    items: props.applications.filter(a => a.status === status)
  }))
)

async function onDragChange(evt, toStatus) {
  if (!evt.added) return
  const app = evt.added.element
  if (app.status === toStatus) return
  try {
    await store.updateApplication(app.id, { status: toStatus })
    success(`Moved to ${toStatus}`)
  } catch {
    error('Failed to update status')
    await store.fetchApplications()
  }
}

const colColors = {
  Applied:   'border-t-blue-500',
  Interview: 'border-t-purple-500',
  Offer:     'border-t-green-500',
  Rejected:  'border-t-red-500',
  Ghosted:   'border-t-gray-400',
  Withdrawn: 'border-t-orange-400'
}
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4">
    <div
      v-for="col in columns"
      :key="col.status"
      class="shrink-0 w-72 flex flex-col"
    >
      <!-- Column header -->
      <div class="flex items-center justify-between mb-2.5 px-1">
        <div class="flex items-center gap-2">
          <StatusBadge :status="col.status" />
          <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ col.items.length }}</span>
        </div>
      </div>

      <!-- Drop zone -->
      <draggable
        :list="col.items"
        group="applications"
        item-key="id"
        class="flex flex-col gap-2 min-h-[120px] bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-2 border-t-4 transition-colors"
        :class="[colColors[col.status], 'border border-gray-200 dark:border-gray-700']"
        ghost-class="opacity-40"
        drag-class="rotate-1 scale-105"
        @change="(evt) => onDragChange(evt, col.status)"
      >
        <template #item="{ element: app }">
          <RouterLink
            :to="{ name: 'application-detail', params: { id: app.id } }"
            class="block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3.5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all cursor-grab active:cursor-grabbing group"
          >
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <p class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                {{ app.company_name }}
              </p>
              <span v-if="app.is_favourite" class="text-amber-400 text-sm shrink-0">★</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2.5 leading-snug">{{ app.job_title }}</p>
            <div class="flex items-center justify-between">
              <PriorityBadge :priority="app.priority || 'Medium'" />
              <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(app.date_applied) }}</span>
            </div>
          </RouterLink>
        </template>

        <!-- Empty column placeholder -->
        <template #footer>
          <div v-if="col.items.length === 0" class="flex items-center justify-center h-16 text-xs text-gray-400 dark:text-gray-600">
            Drop here
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
