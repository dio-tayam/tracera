<script setup>
defineProps({
  label:   { type: String, required: true },
  value:   { type: [String, Number], required: true },
  sub:     { type: String, default: '' },
  color:   { type: String, default: 'blue' },
  icon:    { type: String, default: '' }
})

const colorMap = {
  blue:   'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  green:  'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  red:    'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  amber:  'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ label }}</p>
        <p class="mt-1.5 text-3xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
        <p v-if="sub" class="mt-1 text-xs text-gray-400 dark:text-gray-500">{{ sub }}</p>
      </div>
      <div v-if="icon" class="w-10 h-10 rounded-xl flex items-center justify-center text-xl" :class="colorMap[color]">
        {{ icon }}
      </div>
    </div>
  </div>
</template>
