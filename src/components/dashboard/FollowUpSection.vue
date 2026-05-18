<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { formatDate, isOverdue, isDueToday } from '@/utils/helpers'
import StatusBadge from '@/components/common/StatusBadge.vue'

const props = defineProps({
  applications: { type: Array, required: true }
})

const dueItems = computed(() => {
  return props.applications
    .filter(a => a.followup_date && (isOverdue(a.followup_date) || isDueToday(a.followup_date)))
    .sort((a, b) => new Date(a.followup_date) - new Date(b.followup_date))
    .slice(0, 6)
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Follow-ups Due</h3>
      <span v-if="dueItems.length" class="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full">
        {{ dueItems.length }}
      </span>
    </div>

    <div v-if="!dueItems.length" class="text-center py-6">
      <p class="text-3xl mb-2">🎉</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">No follow-ups due</p>
    </div>

    <div v-else class="space-y-2">
      <RouterLink
        v-for="app in dueItems"
        :key="app.id"
        :to="{ name: 'application-detail', params: { id: app.id } }"
        class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
      >
        <div
          class="w-2 h-2 rounded-full shrink-0"
          :class="isOverdue(app.followup_date) ? 'bg-red-500' : 'bg-amber-500'"
        ></div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ app.company_name }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ app.job_title }}</p>
        </div>
        <div class="text-right shrink-0">
          <StatusBadge :status="app.status" size="sm" />
          <p class="text-xs mt-0.5" :class="isOverdue(app.followup_date) ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'">
            {{ isOverdue(app.followup_date) ? 'Overdue' : 'Today' }} · {{ formatDate(app.followup_date) }}
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
