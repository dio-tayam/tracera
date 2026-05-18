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
    name: 'favourites',
    label: 'Favourites',
    path: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z'
  },
  {
    name: 'insights',
    label: 'Insights',
    path: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z'
  }
]
</script>

<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800"
    style="padding-bottom: env(safe-area-inset-bottom, 0px)"
  >
    <div class="flex items-end justify-around h-16 px-1">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="{ name: link.name }"
        class="flex flex-col items-center justify-center flex-1 transition-colors relative"
        :class="link.isAdd ? '-mt-5' : 'pt-1 pb-1'"
      >
        <!-- Center Add button -->
        <template v-if="link.isAdd">
          <div
            class="w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            style="width:52px;height:52px"
            :class="route.name === link.name ? 'bg-blue-700' : 'bg-blue-600'"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
          </div>
          <span
            class="text-[10px] font-medium mt-0.5"
            :class="route.name === link.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-500'"
          >Add</span>
        </template>

        <!-- Regular nav item -->
        <template v-else>
          <!-- Active: filled star for favourites -->
          <svg
            v-if="link.name === 'favourites' && route.name === link.name"
            class="w-5 h-5 mb-0.5 text-blue-600 dark:text-blue-400"
            fill="currentColor" viewBox="0 0 24 24"
          >
            <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"/>
          </svg>
          <svg
            v-else
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
