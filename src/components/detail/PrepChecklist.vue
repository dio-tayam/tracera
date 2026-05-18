<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  applicationId: { type: String, required: true }
})

const defaultItems = [
  { id: 'research',  label: 'Research the company culture, mission, and products' },
  { id: 'jd',       label: 'Review and highlight key points from the job description' },
  { id: 'resume',   label: 'Tailor your resume to match the role' },
  { id: 'story',    label: 'Prepare STAR-method stories for behavioural questions' },
  { id: 'qs',       label: 'Write 3–5 thoughtful questions to ask the interviewer' },
  { id: 'attire',   label: 'Plan your attire (or test your video setup for virtual interviews)' },
  { id: 'thankyou', label: 'Send a thank-you email within 24 hours of the interview' }
]

const storageKey = computed(() => `tracera_checklist_${props.applicationId}`)
const checked = ref({})

onMounted(() => {
  try {
    const saved = localStorage.getItem(storageKey.value)
    checked.value = saved ? JSON.parse(saved) : {}
  } catch {
    checked.value = {}
  }
})

watch(checked, val => {
  localStorage.setItem(storageKey.value, JSON.stringify(val))
}, { deep: true })

const progress = computed(() => {
  const done = defaultItems.filter(i => checked.value[i.id]).length
  return Math.round((done / defaultItems.length) * 100)
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
    <div class="flex items-center justify-between mb-1">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Interview Prep Checklist</h3>
      <span class="text-xs font-medium text-blue-600 dark:text-blue-400">{{ progress }}%</span>
    </div>

    <!-- Progress bar -->
    <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-500"
        :class="progress === 100 ? 'bg-green-500' : 'bg-blue-600'"
        :style="{ width: progress + '%' }"
      ></div>
    </div>

    <div class="space-y-2">
      <label
        v-for="item in defaultItems"
        :key="item.id"
        class="flex items-start gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
      >
        <div class="mt-0.5 shrink-0">
          <div
            class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
            :class="checked[item.id]
              ? 'bg-blue-600 border-blue-600'
              : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'"
          >
            <svg v-if="checked[item.id]" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
        <input
          type="checkbox"
          class="sr-only"
          :checked="checked[item.id]"
          @change="checked[item.id] = $event.target.checked"
        />
        <span
          class="text-sm leading-relaxed"
          :class="checked[item.id]
            ? 'text-gray-400 dark:text-gray-500 line-through'
            : 'text-gray-700 dark:text-gray-300'"
        >{{ item.label }}</span>
      </label>
    </div>

    <div v-if="progress === 100" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-400 text-center font-medium">
      🎉 You're fully prepared — go ace that interview!
    </div>
  </div>
</template>
