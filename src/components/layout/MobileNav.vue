<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const links = [
  {
    name: 'dashboard',
    label: 'Home',
    path: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
  },
  {
    name: 'applications',
    label: 'Applications',
    path: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.5v-.625c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125V8.25m-13.5 0H15'
  },
  { name: 'add-application', label: 'Add', isAdd: true },
  {
    name: 'insights',
    label: 'Insights',
    path: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z'
  },
  {
    name: 'settings',
    label: 'Settings',
    path: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'
  }
]
</script>

<template>
  <nav class="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800" style="padding-bottom: env(safe-area-inset-bottom, 0px)">
    <div class="flex items-end justify-around h-16 px-1">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="{ name: link.name }"
        class="flex flex-col items-center justify-center flex-1 transition-colors relative"
        :class="link.isAdd ? '-mt-6' : 'pt-1 pb-1'"
      >
        <!-- Center Add button -->
        <template v-if="link.isAdd">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95"
            :class="route.name === link.name
              ? 'bg-blue-700 shadow-blue-500/30'
              : 'bg-blue-600 shadow-blue-500/20'"
          >
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
          </div>
          <span class="text-[10px] font-medium mt-1"
            :class="route.name === link.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-500'">
            Add
          </span>
        </template>

        <!-- Regular nav item -->
        <template v-else>
          <svg
            class="w-5 h-5 mb-0.5 transition-colors"
            :class="route.name === link.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" :d="link.path"/>
          </svg>
          <span
            class="text-[10px] font-medium transition-colors"
            :class="route.name === link.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'"
          >{{ link.label }}</span>
        </template>
      </RouterLink>
    </div>
  </nav>
</template>
