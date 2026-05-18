<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useGoalsStore } from '@/stores/goals'
import { getWeekStart, appDateStr } from '@/utils/helpers'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  applications: { type: Array, required: true }
})

const goals   = useGoalsStore()
const { success } = useToast()
const editing = ref(false)
const inputGoal = ref(goals.weeklyGoal)
const saving  = ref(false)

watch(() => goals.weeklyGoal, v => { inputGoal.value = v })

// Count apps applied on or after the Monday of the current week
const weekCount = computed(() => {
  const weekStart = getWeekStart()
  return props.applications.filter(a => {
    const d = appDateStr(a.date_applied)
    return d !== null && d >= weekStart
  }).length
})

const progress = computed(() =>
  goals.weeklyGoal > 0 ? Math.min(100, Math.round((weekCount.value / goals.weeklyGoal) * 100)) : 0
)

async function saveGoal() {
  const val = Math.max(1, Number(inputGoal.value) || 1)
  saving.value = true
  try {
    await goals.saveGoal(val)
    editing.value = false
    success('Weekly goal updated')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="card p-5">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <!-- Heroicon: flag -->
        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"/>
        </svg>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Weekly Goal</h3>
      </div>
      <button
        class="text-xs font-medium transition-colors"
        :class="editing ? 'text-gray-400 dark:text-gray-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700'"
        @click="editing = !editing"
      >{{ editing ? 'Cancel' : 'Edit' }}</button>
    </div>

    <!-- Edit form -->
    <Transition name="slide-down">
      <div v-if="editing" class="flex gap-2 mb-3">
        <input
          v-model.number="inputGoal"
          type="number" min="1" max="100"
          class="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Applications / week"
          @keyup.enter="saveGoal"
        />
        <button
          :disabled="saving"
          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          @click="saveGoal"
        >{{ saving ? '…' : 'Save' }}</button>
      </div>
    </Transition>

    <!-- Progress numbers -->
    <div class="flex items-end justify-between mb-2">
      <span class="text-3xl font-bold text-gray-900 dark:text-white leading-none">{{ weekCount }}</span>
      <span class="text-sm text-gray-400 dark:text-gray-500">of {{ goals.weeklyGoal }} this week</span>
    </div>

    <!-- Progress bar -->
    <div class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out"
        :class="progress >= 100 ? 'bg-green-500' : 'bg-blue-600'"
        :style="{ width: progress + '%' }"
      ></div>
    </div>
    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
      {{ progress >= 100 ? '🎉 Goal reached!' : `${progress}% complete` }}
    </p>
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
