<script setup>
import { computed } from 'vue'
import { getCurrentStreak } from '@/utils/helpers'

const props = defineProps({
  applications: { type: Array, required: true }
})

const streak = computed(() => getCurrentStreak(props.applications))

const message = computed(() => {
  if (streak.value === 0) return 'Apply today to start your streak!'
  if (streak.value === 1) return 'Great start! Keep it going tomorrow.'
  if (streak.value < 5)  return "You're on a roll! Don't break the chain."
  if (streak.value < 10) return 'Impressive streak! Stay consistent.'
  return "You're a machine! Incredible dedication 🚀"
})

const emoji = computed(() => {
  if (streak.value === 0)  return '💤'
  if (streak.value < 3)   return '🔥'
  if (streak.value < 7)   return '🔥🔥'
  if (streak.value < 14)  return '🔥🔥🔥'
  return '🔥🔥🔥🔥'
})
</script>

<template>
  <div class="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-2xl p-5 text-white">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-blue-200">Daily Streak</p>
        <div class="flex items-end gap-2 mt-1">
          <span class="text-4xl font-bold">{{ streak }}</span>
          <span class="text-blue-200 text-sm mb-1.5">{{ streak === 1 ? 'day' : 'days' }}</span>
        </div>
        <p class="text-xs text-blue-200 mt-1.5 leading-relaxed max-w-[180px]">{{ message }}</p>
      </div>
      <div class="text-4xl">{{ emoji }}</div>
    </div>
  </div>
</template>
