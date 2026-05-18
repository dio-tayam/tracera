<script setup>
defineProps({
  title:       { type: String, default: 'Nothing here yet' },
  description: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  icon:        { type: String, default: 'briefcase' }
})
defineEmits(['action'])
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <!-- Illustration -->
    <div class="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-5 text-4xl">
      <span v-if="icon === 'briefcase'">💼</span>
      <span v-else-if="icon === 'chart'">📊</span>
      <span v-else-if="icon === 'search'">🔍</span>
      <span v-else-if="icon === 'star'">⭐</span>
      <span v-else>📋</span>
    </div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
    <p v-if="description" class="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed mb-6">
      {{ description }}
    </p>
    <button
      v-if="actionLabel"
      class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
