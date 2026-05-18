<script setup>
import { ref, computed, watch } from 'vue'
import { useGoalsStore } from '@/stores/goals'
import { getWeekStart } from '@/utils/helpers'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  applications: { type: Array, required: true }
})

const goals = useGoalsStore()
const { success } = useToast()
const editing = ref(false)
const inputGoal = ref(goals.weeklyGoal)

const weekCount = computed(() => {
  const weekStart = getWeekStart()
  return props.applications.filter(a => {
    if (!a.date_applied) return false
    return new Date(a.date_applied) >= weekStart
  }).length
})

const progress = computed(() => {
  if (!goals.weeklyGoal) return 0
  return Math.min(100, Math.round((weekCount.value / goals.weeklyGoal) * 100))
})

watch(() => goals.weeklyGoal, v => { inputGoal.value = v })

async function saveGoal() {
  await goals.saveGoal(Number(inputGoal.value) || 5)
  editing.value = false
  success('Weekly goal updated!')
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Weekly Goal</h3>
      <button
        class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
        @click="editing = !editing"
      >
        {{ editing ? 'Cancel' : 'Set goal' }}
      </button>
    </div>

    <!-- Edit goal input -->
    <div v-if="editing" class="flex gap-2 mb-3">
      <input
        v-model.number="inputGoal"
        type="number"
        min="1"
        max="100"
        class="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Applications per week"
        @keyup.enter="saveGoal"
      />
      <button
        class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        @click="saveGoal"
      >Save</button>
    </div>

    <!-- Progress display -->
    <div class="flex items-end justify-between mb-2">
      <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ weekCount }}</span>
      <span class="text-sm text-gray-500 dark:text-gray-400">of {{ goals.weeklyGoal }} this week</span>
    </div>

    <!-- Progress bar -->
    <div class="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out"
        :class="progress >= 100 ? 'bg-green-500' : 'bg-blue-600'"
        :style="{ width: progress + '%' }"
      ></div>
    </div>
    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
      {{ progress >= 100 ? '🎉 Goal reached!' : `${progress}% complete` }}
    </p>
  </div>
</template>
