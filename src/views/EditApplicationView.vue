<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import ApplicationForm from '@/components/forms/ApplicationForm.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useToast } from '@/composables/useToast'

const store  = useApplicationsStore()
const route  = useRoute()
const router = useRouter()
const { success, error } = useToast()
const loading = ref(false)

onMounted(async () => {
  if (!store.applications.length) {
    loading.value = true
    await store.fetchApplications()
    loading.value = false
  }
})

const application = computed(() => store.applications.find(a => a.id === route.params.id))

async function handleSubmit(payload) {
  try {
    await store.updateApplication(route.params.id, payload)
    success('Application updated')
    router.push({ name: 'application-detail', params: { id: route.params.id } })
  } catch (e) {
    error(e.message || 'Failed to update')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28 md:pb-10">
    <AppHeader />
    <main class="max-w-2xl mx-auto px-4 sm:px-6 py-6">

      <div class="mb-6 flex items-center gap-3">
        <button
          class="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
          @click="$router.back()"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Edit Application</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
            {{ application?.company_name }} · {{ application?.job_title }}
          </p>
        </div>
      </div>

      <LoadingSkeleton v-if="loading" type="table" :rows="3" />

      <div v-else-if="!application" class="text-center py-16 text-gray-500 dark:text-gray-400 text-sm">
        Application not found.
      </div>

      <ApplicationForm
        v-else
        :initial="application"
        @submit="handleSubmit"
        @cancel="$router.back()"
      />
    </main>
    <MobileNav />
  </div>
</template>
