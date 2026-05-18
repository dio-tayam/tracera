<script setup>
import { computed } from 'vue'
import { getCurrentStreak } from '@/utils/helpers'

const props = defineProps({
  applications: { type: Array, required: true }
})

const streak = computed(() => getCurrentStreak(props.applications))

const message = computed(() => {
  if (streak.value === 0)  return 'Apply today to start your streak!'
  if (streak.value === 1)  return 'Great start! Keep applying tomorrow.'
  if (streak.value < 5)   return "You're building momentum. Don't break the chain!"
  if (streak.value < 14)  return 'Impressive consistency! Keep it up.'
  return '🚀 You are unstoppable!'
})

const flameCount = computed(() => {
  if (streak.value === 0)  return 0
  if (streak.value < 4)   return 1
  if (streak.value < 8)   return 2
  if (streak.value < 14)  return 3
  return 4
})
</script>

<template>
  <div class="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-2xl border border-blue-500/20 p-5 text-white h-full flex flex-col justify-between">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-2 mb-1">
        <!-- Heroicon: fire -->
        <svg class="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"/>
        </svg>
        <p class="text-sm font-medium text-blue-100">Daily Streak</p>
      </div>
      <div class="text-2xl leading-none">
        <template v-if="flameCount === 0">💤</template>
        <template v-else>{{ '🔥'.repeat(flameCount) }}</template>
      </div>
    </div>

    <div>
      <div class="flex items-end gap-1.5 mt-2">
        <span class="text-5xl font-extrabold leading-none tracking-tight">{{ streak }}</span>
        <span class="text-blue-200 text-base mb-1.5">{{ streak === 1 ? 'day' : 'days' }}</span>
      </div>
      <p class="text-xs text-blue-200 mt-2 leading-relaxed">{{ message }}</p>
    </div>
  </div>
</template>
