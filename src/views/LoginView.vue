<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const loading = ref(false)
const errorMsg = ref('')

async function login() {
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.loginWithGoogle()
  } catch (e) {
    errorMsg.value = e.message || 'Login failed. Please try again.'
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex flex-col items-center justify-center px-4">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-700/30 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-5 shadow-xl ring-1 ring-white/20">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-white tracking-tight mb-2">Tracera</h1>
        <p class="text-blue-200 text-base leading-relaxed">
          Track every application.<br />Land your dream job.
        </p>
      </div>

      <!-- Card -->
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">
        <h2 class="text-center text-white font-semibold mb-1">Welcome back</h2>
        <p class="text-center text-blue-200 text-sm mb-6">Sign in to continue to your dashboard</p>

        <p v-if="errorMsg" class="mb-4 p-3 bg-red-500/20 text-red-200 text-sm rounded-xl text-center">
          {{ errorMsg }}
        </p>

        <button
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed group"
          @click="login"
        >
          <!-- Google logo -->
          <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>{{ loading ? 'Redirecting...' : 'Continue with Google' }}</span>
        </button>

        <p class="text-center text-blue-300 text-xs mt-5 leading-relaxed">
          Free forever · No credit card · Your data stays private
        </p>
      </div>

      <!-- Features preview -->
      <div class="mt-8 grid grid-cols-3 gap-3">
        <div v-for="f in [
          { icon: '📊', label: 'Visual insights' },
          { icon: '📌', label: 'Kanban board' },
          { icon: '🎯', label: 'Goal tracking' }
        ]" :key="f.label" class="text-center">
          <div class="text-2xl mb-1">{{ f.icon }}</div>
          <p class="text-blue-300 text-xs">{{ f.label }}</p>
        </div>
      </div>
    </div>

    <p class="relative mt-8 text-blue-400/60 text-xs text-center">
      © {{ new Date().getFullYear() }} Tracera. All rights reserved.
    </p>
  </div>
</template>
