<script setup>
import { computed } from 'vue'
import { STATUS_CONFIG } from '@/utils/helpers'

const props = defineProps({
  status: { type: String, required: true },
  size:   { type: String, default: 'md' }
})

const cfg = computed(() => STATUS_CONFIG[props.status] ?? STATUS_CONFIG.Applied)
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 font-medium rounded-full"
    :class="[
      cfg.bg, cfg.text, cfg.darkBg, cfg.darkText,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
    ]"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="cfg.dot"></span>
    {{ status }}
  </span>
</template>
