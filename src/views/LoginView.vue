<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth    = useAuthStore()
const loading = ref(false)
const errMsg  = ref('')

async function login() {
  loading.value = true
  errMsg.value  = ''
  try {
    await auth.loginWithGoogle()
  } catch (e) {
    errMsg.value  = e.message || 'Sign in failed. Please try again.'
    loading.value = false
  }
}

const features = [
  {
    title: 'Track Applications',
    desc:  'Log every job you apply to in one organised place',
    icon:  'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.5v-.625c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125V8.25m-13.5 0H15'
  },
  {
    title: 'Kanban Board',
    desc:  'Drag and drop applications across pipeline stages',
    icon:  'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z'
  },
  {
    title: 'Visual Insights',
    desc:  'Charts and analytics to optimise your job search strategy',
    icon:  'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z'
  },
  {
    title: 'Goal Tracking',
    desc:  'Set weekly targets and maintain your application streak',
    icon:  'M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5'
  },
  {
    title: 'Interview Prep',
    desc:  'Built-in checklists so you never walk in unprepared',
    icon:  'M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75'
  },
  {
    title: 'Export & Backup',
    desc:  'Download your data anytime as PDF, CSV, or JSON',
    icon:  'M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
  }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">

    <!-- ── Main content ─────────────────────────────────────────────────── -->
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-4xl">

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <!-- Left: Brand + features -->
          <div>
            <!-- Brand -->
            <div class="mb-10">
              <h1 class="text-5xl font-extrabold text-blue-600 dark:text-blue-500 tracking-tight mb-3">
                Tracera
              </h1>
              <p class="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                The smarter way to manage your job search — from application to offer.
              </p>
            </div>

            <!-- Feature grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="f in features"
                :key="f.title"
                class="flex items-start gap-3"
              >
                <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="f.icon" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ f.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{{ f.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Sign in card -->
          <div class="flex justify-center lg:justify-end">
            <div class="w-full max-w-sm">
              <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8">

                <!-- Heading -->
                <div class="mb-6 text-center">
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to continue to your dashboard</p>
                </div>

                <!-- Error message -->
                <div
                  v-if="errMsg"
                  class="mb-4 flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl"
                >
                  <!-- Heroicon: exclamation-circle -->
                  <svg class="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/>
                  </svg>
                  <p class="text-sm text-red-700 dark:text-red-400">{{ errMsg }}</p>
                </div>

                <!-- Google button -->
                <button
                  :disabled="loading"
                  class="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-800 dark:text-gray-100 font-semibold text-sm transition-all shadow-sm hover:shadow-md active:scale-[.99] disabled:opacity-60 disabled:cursor-not-allowed"
                  @click="login"
                >
                  <!-- Official Google G logo -->
                  <svg v-if="!loading" class="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>

                  <!-- Spinner while loading -->
                  <svg v-else class="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>

                  <span>{{ loading ? 'Redirecting…' : 'Continue with Google' }}</span>
                </button>

                <!-- Trust badges -->
                <div class="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
                  <div class="grid grid-cols-3 gap-2 text-center">
                    <div
                      v-for="badge in [
                        { icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', label: 'Free forever' },
                        { icon: 'M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z', label: 'Private data' },
                        { icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z', label: 'No credit card' }
                      ]"
                      :key="badge.label"
                    >
                      <svg class="w-4 h-4 text-blue-500 dark:text-blue-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="badge.icon" />
                      </svg>
                      <p class="text-[10px] font-medium text-gray-400 dark:text-gray-500 leading-tight">{{ badge.label }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

    <!-- ── Footer ────────────────────────────────────────────────────────── -->
    <footer class="py-5 text-center">
      <p class="text-xs text-gray-400 dark:text-gray-600">
        © {{ new Date().getFullYear() }} Tracera. All rights reserved.
      </p>
    </footer>

  </div>
</template>
