<script setup>
defineProps({
  rows: { type: Number, default: 5 },
  type: { type: String, default: 'table' }
})
</script>

<template>
  <!-- Table skeleton -->
  <div v-if="type === 'table'" class="animate-pulse space-y-3">
    <div v-for="i in rows" :key="i" class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div class="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-1/2"></div>
      </div>
      <div class="hidden sm:flex gap-2">
        <div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div class="h-6 w-12 bg-gray-100 dark:bg-gray-700/60 rounded-full"></div>
      </div>
      <div class="h-4 w-20 bg-gray-100 dark:bg-gray-700/60 rounded hidden md:block"></div>
    </div>
  </div>

  <!-- Card skeleton -->
  <div v-else-if="type === 'card'" class="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div v-for="i in rows" :key="i" class="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div class="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-full"></div>
    </div>
  </div>

  <!-- Kanban skeleton -->
  <div v-else-if="type === 'kanban'" class="animate-pulse flex gap-4 overflow-x-auto">
    <div v-for="i in 6" :key="i" class="shrink-0 w-72 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
      <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
      <div v-for="j in (i % 3) + 1" :key="j" class="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2 border border-gray-100 dark:border-gray-700">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div class="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-1/2"></div>
      </div>
    </div>
  </div>
</template>
