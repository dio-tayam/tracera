<script setup>
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import ApplicationForm from '@/components/forms/ApplicationForm.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useToast } from '@/composables/useToast'

const store = useApplicationsStore()
const router = useRouter()
const { success, error } = useToast()

async function handleSubmit(payload) {
  try {
    const app = await store.addApplication(payload)
    success(`${app.company_name} added successfully!`)
    router.push({ name: 'application-detail', params: { id: app.id } })
  } catch (e) {
    error(e.message || 'Failed to save application')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 md:pb-0">
    <AppHeader />
    <main class="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div class="mb-6 flex items-center gap-3">
        <button
          class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          @click="$router.back()"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add Application</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Track a new job opportunity</p>
        </div>
      </div>
      <ApplicationForm @submit="handleSubmit" @cancel="$router.back()" />
    </main>
    <MobileNav />
  </div>
</template>
