<script setup>
defineProps({
  companyName: { type: String, required: true },
  jobTitle:    { type: String, required: true }
})
defineEmits(['close'])

const COLORS  = ['#2563EB','#7C3AED','#059669','#F59E0B','#EF4444','#EC4899','#06B6D4','#10B981','#F97316']
const SHAPES  = ['circle', 'square', 'ribbon']

const pieces = Array.from({ length: 72 }, (_, i) => ({
  id:       i,
  left:     Math.random() * 100,
  width:    5 + Math.random() * 8,
  height:   5 + Math.random() * 10,
  color:    COLORS[i % COLORS.length],
  shape:    SHAPES[Math.floor(Math.random() * SHAPES.length)],
  delay:    Math.random() * 1.8,
  duration: 2.4 + Math.random() * 2.6,
  endX:     (Math.random() - 0.5) * 140,
  rotStart: Math.random() * 360,
  rotDelta: (Math.random() - 0.5) * 720
}))
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">

      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <!-- Confetti (fixed so it covers full screen behind the card) -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          v-for="p in pieces"
          :key="p.id"
          class="absolute confetti-piece"
          :style="{
            left:              p.left + '%',
            top:               '-8px',
            width:             p.width + 'px',
            height:            p.shape === 'ribbon' ? p.height * 2.5 + 'px' : p.height + 'px',
            backgroundColor:   p.color,
            borderRadius:      p.shape === 'circle' ? '50%' : '2px',
            '--end-x':         p.endX + 'px',
            '--rot-start':     p.rotStart + 'deg',
            '--rot-end':       (p.rotStart + p.rotDelta) + 'deg',
            animationDelay:    p.delay + 's',
            animationDuration: p.duration + 's',
          }"
        ></div>
      </div>

      <!-- Modal — uses the same card pattern as ConfirmModal / ExportModal -->
      <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-sm overflow-hidden animate-slide-up">

        <!-- Blue top accent (matches kanban columns) -->
        <div class="h-1 bg-blue-600"></div>

        <div class="p-6">

          <!-- Icon -->
          <div class="flex justify-center mb-4">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
              <!-- Heroicon: trophy -->
              <svg class="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"/>
              </svg>
            </div>
          </div>

          <!-- Title -->
          <h2 class="text-lg font-bold text-gray-900 dark:text-white text-center mb-1">
            Congratulations! 🎉
          </h2>

          <!-- Company / role -->
          <p class="text-sm font-semibold text-blue-600 dark:text-blue-400 text-center">{{ companyName }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-0.5 mb-4">{{ jobTitle }}</p>

          <!-- Message -->
          <div class="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 mb-5">
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center">
              You earned this. Take a moment to celebrate, then review the offer and negotiate with confidence. 💪
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              class="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              @click="$emit('close')"
            >
              Dismiss
            </button>
            <button
              class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
              @click="$emit('close')"
            >
              Celebrate! 🥂
            </button>
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confetti-piece {
  animation: confetti-fall linear both;
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translateY(0) translateX(0) rotate(var(--rot-start));
  }
  80% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
    transform: translateY(105vh) translateX(var(--end-x)) rotate(var(--rot-end));
  }
}
</style>
