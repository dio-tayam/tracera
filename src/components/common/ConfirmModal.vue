<script setup>
defineProps({
  title:       { type: String, default: 'Are you sure?' },
  message:     { type: String, default: 'This action cannot be undone.' },
  confirmText: { type: String, default: 'Delete' },
  danger:      { type: Boolean, default: true }
})
defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('cancel')"></div>
      <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-800 p-6 animate-slide-up">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{{ message }}</p>
        <div class="flex gap-3 justify-end">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
            @click="$emit('cancel')"
          >Cancel</button>
          <button
            class="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors"
            :class="danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'"
            @click="$emit('confirm')"
          >{{ confirmText }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
