<script setup>
import { useToast } from '@/composables/useToast'
const { toasts, remove } = useToast()

const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' }
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium cursor-pointer select-none"
          :class="{
            'bg-green-600 text-white': t.type === 'success',
            'bg-red-600 text-white':   t.type === 'error',
            'bg-blue-600 text-white':  t.type === 'info',
            'bg-amber-500 text-white': t.type === 'warning'
          }"
          @click="remove(t.id)"
        >
          <span class="mt-px text-base leading-none">{{ icons[t.type] }}</span>
          <span class="flex-1 leading-snug">{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(.4,0,.2,1); }
.toast-enter-from { opacity: 0; transform: translateX(110%); }
.toast-leave-to   { opacity: 0; transform: translateX(110%); }
</style>
