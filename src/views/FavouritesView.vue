<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import ApplicationTable from '@/components/applications/ApplicationTable.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useApplicationsStore } from '@/stores/applications'

const store  = useApplicationsStore()
const router = useRouter()

onMounted(async () => {
  if (!store.applications.length) await store.fetchApplications()
})

const favourites = computed(() => store.applications.filter(a => a.is_favourite))
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-0">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

      <!-- Page heading -->
      <div class="flex items-center gap-3">
        <!-- Filled star icon -->
        <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Favourites</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ favourites.length }} starred application{{ favourites.length !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>

      <!-- Loading -->
      <LoadingSkeleton v-if="store.loading" type="table" :rows="4" />

      <template v-else>
        <!-- Empty state -->
        <EmptyState
          v-if="!favourites.length"
          title="No favourites yet"
          description="Star any application from the list or detail view to save it here for quick access."
          action-label="Browse Applications"
          icon="star"
          @action="router.push({ name: 'applications' })"
        />

        <!-- Favourites table -->
        <ApplicationTable v-else :applications="favourites" />
      </template>

    </main>

    <MobileNav />
  </div>
</template>
