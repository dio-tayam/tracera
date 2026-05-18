<script setup>
import { RouterLink } from 'vue-router'

const links = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>`
  },
  {
    name: 'applications',
    label: 'Applications',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>`
  },
  {
    name: 'add-application',
    label: 'Add',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>`,
    isAdd: true
  },
  {
    name: 'insights',
    label: 'Insights',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`
  }
]
</script>

<template>
  <nav class="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
    <div class="flex items-center justify-around h-16 px-2">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="{ name: link.name }"
        class="flex flex-col items-center justify-center gap-1 flex-1 py-1 rounded-xl transition-colors"
        :class="link.isAdd ? '' : ($route.name === link.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400')"
      >
        <!-- Special Add button -->
        <div
          v-if="link.isAdd"
          class="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg"
          :class="$route.name === link.name ? 'ring-4 ring-blue-200 dark:ring-blue-900' : ''"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <g v-html="link.icon"></g>
          </svg>
        </div>

        <!-- Regular nav item -->
        <template v-else>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <g v-html="link.icon"></g>
          </svg>
          <span class="text-[10px] font-medium">{{ link.label }}</span>
        </template>
      </RouterLink>
    </div>
  </nav>
</template>
