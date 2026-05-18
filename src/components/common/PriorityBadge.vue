<script setup>
import { computed } from 'vue'
import { PRIORITY_CONFIG } from '@/utils/helpers'

const props = defineProps({
  priority: { type: String, required: true }
})

const cfg = computed(() => PRIORITY_CONFIG[props.priority] ?? PRIORITY_CONFIG.Medium)
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
    :class="[cfg.bg, cfg.text, cfg.darkBg, cfg.darkText]"
  >
    {{ priority }}
  </span>
</template>
