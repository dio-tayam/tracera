<script setup>
import { computed } from 'vue'
import { daysDiff } from '@/utils/helpers'

const props = defineProps({
  applications: { type: Array, required: true }
})

const tips = computed(() => {
  const apps = props.applications
  const result = []

  const stale = apps.filter(a =>
    ['Applied'].includes(a.status) && daysDiff(a.date_applied) >= 14
  )
  if (stale.length >= 3) {
    result.push({
      icon: '📬',
      text: `You have ${stale.length} applications with no reply in 2+ weeks. Consider sending a polite follow-up.`,
      color: 'amber'
    })
  }

  const rejected = apps.filter(a => a.status === 'Rejected').length
  const total = apps.length
  if (total >= 5 && rejected / total > 0.5) {
    result.push({
      icon: '📄',
      text: 'Your rejection rate is over 50%. It may be worth reviewing your resume and cover letter.',
      color: 'red'
    })
  }

  const interviews = apps.filter(a => a.status === 'Interview').length
  if (interviews > 0) {
    result.push({
      icon: '🎯',
      text: `You have ${interviews} active interview${interviews > 1 ? 's' : ''}! Prepare your questions and research the company.`,
      color: 'blue'
    })
  }

  const offers = apps.filter(a => a.status === 'Offer').length
  if (offers > 0) {
    result.push({
      icon: '🥳',
      text: `Congrats! You have ${offers} offer${offers > 1 ? 's' : ''}. Take your time evaluating and negotiate confidently.`,
      color: 'green'
    })
  }

  const noApplyInDays = apps.length === 0 || !apps.some(a => {
    if (!a.date_applied) return false
    return daysDiff(a.date_applied) <= 3
  })
  if (noApplyInDays && apps.length > 0) {
    result.push({
      icon: '⏰',
      text: "You haven't applied in 3+ days. Consistency is key — try to apply to at least one role today!",
      color: 'purple'
    })
  }

  return result.slice(0, 3)
})

const colorMap = {
  amber:  'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
  red:    'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  blue:   'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  green:  'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
}
</script>

<template>
  <div v-if="tips.length" class="space-y-3">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Smart Tips</h3>
    <div
      v-for="(tip, i) in tips"
      :key="i"
      class="flex gap-3 p-3.5 rounded-xl border text-sm"
      :class="colorMap[tip.color]"
    >
      <span class="text-xl shrink-0">{{ tip.icon }}</span>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ tip.text }}</p>
    </div>
  </div>
</template>
