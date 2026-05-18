<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  sub:   { type: String, default: '' },
  icon:  { type: String, default: 'clipboard' },
  color: { type: String, default: 'blue' }
})

const colorMap = {
  blue:   { bg: 'bg-blue-50 dark:bg-blue-950/40',   icon: 'text-blue-600 dark:text-blue-400'   },
  green:  { bg: 'bg-green-50 dark:bg-green-950/40',  icon: 'text-green-600 dark:text-green-400'  },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/40', icon: 'text-purple-600 dark:text-purple-400' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-950/40',  icon: 'text-amber-600 dark:text-amber-400'  },
  red:    { bg: 'bg-red-50 dark:bg-red-950/40',      icon: 'text-red-600 dark:text-red-400'      }
}

// Heroicon paths (outline, 24px)
const iconPaths = {
  // clipboard-document-list
  clipboard: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.5v-.625c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125V8.25m-13.5 0H15',
  // clock
  clock: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  // microphone
  microphone: 'M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z',
  // trophy
  trophy: 'M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0',
  // x-circle
  'x-circle': 'M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  // chart-bar
  'chart-bar': 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z',
}
</script>

<template>
  <div class="card p-5 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">{{ label }}</p>
        <p class="text-3xl font-bold text-gray-900 dark:text-white leading-none">{{ value }}</p>
        <p v-if="sub" class="text-xs text-gray-400 dark:text-gray-500 mt-1.5 leading-snug">{{ sub }}</p>
      </div>
      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        :class="colorMap[color]?.bg ?? colorMap.blue.bg"
      >
        <svg
          class="w-5 h-5"
          :class="colorMap[color]?.icon ?? colorMap.blue.icon"
          fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[icon] ?? iconPaths.clipboard" />
        </svg>
      </div>
    </div>
  </div>
</template>
