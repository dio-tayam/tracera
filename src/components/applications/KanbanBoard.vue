<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import draggable from 'vuedraggable'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PriorityBadge from '@/components/common/PriorityBadge.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useToast } from '@/composables/useToast'
import { useCongratsModal } from '@/composables/useCongratsModal'
import { formatDate, STATUSES } from '@/utils/helpers'

const props = defineProps({
  applications: { type: Array, required: true }
})

const store   = useApplicationsStore()
const { success, error } = useToast()
const { celebrate } = useCongratsModal()

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
  const prevStatus = app.status
  try {
    await store.updateApplication(app.id, { status: toStatus })
    success(`Moved to ${toStatus}`)
    if (toStatus === 'Offer' && prevStatus !== 'Offer') {
      celebrate(app.company_name, app.job_title)
    }
  } catch {
    error('Failed to update status')
    await store.fetchApplications()
  }
}

const COL_ACCENT = {
  Applied:   'border-t-blue-500',
  Interview: 'border-t-purple-500',
  Offer:     'border-t-green-500',
  Rejected:  'border-t-red-400',
  Ghosted:   'border-t-gray-400',
  Withdrawn: 'border-t-orange-400'
}

const COL_HEADER_DOT = {
  Applied:   'bg-blue-500',
  Interview: 'bg-purple-500',
  Offer:     'bg-green-500',
  Rejected:  'bg-red-400',
  Ghosted:   'bg-gray-400',
  Withdrawn: 'bg-orange-400'
}
</script>

<template>
  <div class="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
    <div
      v-for="col in columns"
      :key="col.status"
      class="shrink-0 w-64 sm:w-72 flex flex-col snap-start"
    >
      <!-- Column header -->
      <div class="flex items-center justify-between mb-2 px-0.5">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="COL_HEADER_DOT[col.status]"></span>
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ col.status }}</span>
          <span class="text-xs font-medium text-gray-400 dark:text-gray-500 tabular-nums">{{ col.items.length }}</span>
        </div>
      </div>

      <!-- Drop zone -->
      <draggable
        :list="col.items"
        group="applications"
        item-key="id"
        class="flex flex-col gap-2 flex-1 min-h-[120px] rounded-xl p-2 border-t-[3px] border border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-800/30 transition-colors"
        :class="COL_ACCENT[col.status]"
        ghost-class="opacity-30 scale-95"
        chosen-class="shadow-xl rotate-1"
        @change="(evt) => onDragChange(evt, col.status)"
      >
        <template #item="{ element: app }">
          <RouterLink
            :to="{ name: 'application-detail', params: { id: app.id } }"
            class="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-3.5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
          >
            <!-- Company + favourite -->
            <div class="flex items-start justify-between gap-1.5 mb-1">
              <p class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                {{ app.company_name }}
              </p>
              <span v-if="app.is_favourite" class="text-amber-400 text-sm shrink-0 mt-0.5">★</span>
            </div>

            <!-- Job title -->
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-snug line-clamp-2">{{ app.job_title }}</p>

            <!-- Footer: priority + date -->
            <div class="flex items-center justify-between gap-2">
              <PriorityBadge :priority="app.priority || 'Medium'" />
              <span class="text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap">{{ formatDate(app.date_applied) }}</span>
            </div>
          </RouterLink>
        </template>

        <!-- Empty column -->
        <template #footer>
          <div v-if="col.items.length === 0"
            class="flex items-center justify-center h-20 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-600 select-none">
            Drop here
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
