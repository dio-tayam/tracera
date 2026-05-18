<script setup>
import { STATUSES, PRIORITIES, WORK_SETUPS, EMPLOYMENT_TYPES } from '@/utils/helpers'

const props = defineProps({
  modelValue: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue'])

function update(key, value) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

function reset() {
  emit('update:modelValue', {
    search: '',
    status: [],
    priority: [],
    workSetup: [],
    employmentType: [],
    dateFrom: '',
    dateTo: '',
    favouritesOnly: false
  })
}

const hasFilters = Object.entries(props.modelValue).some(([k, v]) => {
  if (k === 'search') return !!v
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === 'boolean') return v
  return !!v
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 space-y-4">
    <!-- Search -->
    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
      </svg>
      <input
        type="text"
        :value="modelValue.search"
        placeholder="Search company, role..."
        class="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @input="update('search', $event.target.value)"
      />
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      <!-- Status filter -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Status</label>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="s in STATUSES"
            :key="s"
            class="px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors"
            :class="modelValue.status.includes(s)
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700'"
            @click="update('status', modelValue.status.includes(s)
              ? modelValue.status.filter(x => x !== s)
              : [...modelValue.status, s])"
          >{{ s }}</button>
        </div>
      </div>

      <!-- Priority -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Priority</label>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="p in PRIORITIES"
            :key="p"
            class="px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors"
            :class="modelValue.priority.includes(p)
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'"
            @click="update('priority', modelValue.priority.includes(p)
              ? modelValue.priority.filter(x => x !== p)
              : [...modelValue.priority, p])"
          >{{ p }}</button>
        </div>
      </div>

      <!-- Work Setup -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Work Setup</label>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="w in WORK_SETUPS"
            :key="w"
            class="px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors"
            :class="modelValue.workSetup.includes(w)
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'"
            @click="update('workSetup', modelValue.workSetup.includes(w)
              ? modelValue.workSetup.filter(x => x !== w)
              : [...modelValue.workSetup, w])"
          >{{ w }}</button>
        </div>
      </div>

      <!-- Employment Type -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Type</label>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="t in EMPLOYMENT_TYPES"
            :key="t"
            class="px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors"
            :class="modelValue.employmentType.includes(t)
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'"
            @click="update('employmentType', modelValue.employmentType.includes(t)
              ? modelValue.employmentType.filter(x => x !== t)
              : [...modelValue.employmentType, t])"
          >{{ t }}</button>
        </div>
      </div>

      <!-- Date range -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Date From</label>
        <input
          type="date"
          :value="modelValue.dateFrom"
          class="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="update('dateFrom', $event.target.value)"
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Date To</label>
        <input
          type="date"
          :value="modelValue.dateTo"
          class="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="update('dateTo', $event.target.value)"
        />
      </div>
    </div>

    <!-- Favourites + Reset -->
    <div class="flex items-center justify-between pt-1">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          :checked="modelValue.favouritesOnly"
          class="rounded accent-blue-600"
          @change="update('favouritesOnly', $event.target.checked)"
        />
        <span class="text-sm text-gray-600 dark:text-gray-400">⭐ Favourites only</span>
      </label>
      <button
        class="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
        @click="reset"
      >
        Reset filters
      </button>
    </div>
  </div>
</template>
