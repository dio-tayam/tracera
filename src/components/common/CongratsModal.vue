<script setup>
defineProps({
  companyName: { type: String, required: true },
  jobTitle:    { type: String, required: true }
})
defineEmits(['close'])

// Generate confetti pieces with random properties
const COLORS = ['#2563EB','#7C3AED','#059669','#F59E0B','#EF4444','#EC4899','#06B6D4','#10B981','#F97316']
const SHAPES = ['circle', 'square', 'ribbon']

const pieces = Array.from({ length: 80 }, (_, i) => ({
  id:       i,
  left:     Math.random() * 100,
  width:    5 + Math.random() * 9,
  height:   4 + Math.random() * 10,
  color:    COLORS[Math.floor(Math.random() * COLORS.length)],
  shape:    SHAPES[Math.floor(Math.random() * SHAPES.length)],
  delay:    Math.random() * 2.5,
  duration: 2.2 + Math.random() * 2.8,
  swing:    (Math.random() - 0.5) * 80,
  startRot: Math.random() * 360,
  endRot:   Math.random() * 720 * (Math.random() > 0.5 ? 1 : -1)
}))
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Confetti layer -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          v-for="p in pieces"
          :key="p.id"
          class="absolute confetti"
          :style="{
            left:             p.left + '%',
            top:              '-12px',
            width:            p.width + 'px',
            height:           p.shape === 'ribbon' ? p.height * 3 + 'px' : p.height + 'px',
            backgroundColor:  p.color,
            borderRadius:     p.shape === 'circle' ? '50%' : p.shape === 'ribbon' ? '2px' : '2px',
            '--swing':        p.swing + 'px',
            '--start-rot':    p.startRot + 'deg',
            '--end-rot':      p.endRot + 'deg',
            animationDelay:   p.delay + 's',
            animationDuration: p.duration + 's',
          }"
        ></div>
      </div>

      <!-- Modal card -->
      <div class="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md overflow-hidden animate-slide-up">

        <!-- Header gradient -->
        <div class="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 px-8 pt-8 pb-6 text-center text-white">
          <div class="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 class="text-2xl font-bold tracking-tight">Congratulations!</h2>
          <p class="text-blue-200 text-sm mt-1">You received an offer</p>
        </div>

        <!-- Content -->
        <div class="px-8 py-6 text-center">
          <div class="mb-4">
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ companyName }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ jobTitle }}</p>
          </div>

          <div class="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-2xl px-5 py-4 mb-6">
            <p class="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              All your hard work has paid off! Take a moment to celebrate, then review the offer carefully and negotiate with confidence. 💪
            </p>
          </div>

          <button
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-colors text-sm shadow-sm"
            @click="$emit('close')"
          >
            Celebrate! 🥂
          </button>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-3">You can view full details in the application</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confetti {
  animation: fall linear forwards;
  opacity: 0;
}

@keyframes fall {
  0% {
    transform: translateY(0) translateX(0) rotate(var(--start-rot));
    opacity: 1;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(110vh) translateX(var(--swing)) rotate(var(--end-rot));
    opacity: 0;
  }
}
</style>
