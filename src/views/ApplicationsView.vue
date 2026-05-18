<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import ApplicationTable from '@/components/applications/ApplicationTable.vue'
import KanbanBoard from '@/components/applications/KanbanBoard.vue'
import ApplicationFilters from '@/components/applications/ApplicationFilters.vue'
import ExportModal from '@/components/common/ExportModal.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useRouter } from 'vue-router'

const store  = useApplicationsStore()
const router = useRouter()

const viewMode    = ref('list')
const showExport  = ref(false)
const showFilters = ref(false)

const emptyFilters = () => ({
  search: '', status: [], priority: [],
  workSetup: [], employmentType: [],
  dateFrom: '', dateTo: '', favouritesOnly: false
})

const filters = ref(emptyFilters())

onMounted(async () => {
  if (!store.applications.length) await store.fetchApplications()
})

const filtered = computed(() => {
  let apps = store.applications
  const f  = filters.value

  if (f.search) {
    const q = f.search.toLowerCase()
    apps = apps.filter(a =>
      a.company_name?.toLowerCase().includes(q) ||
      a.job_title?.toLowerCase().includes(q) ||
      a.notes?.toLowerCase().includes(q)
    )
  }
  if (f.status.length)         apps = apps.filter(a => f.status.includes(a.status))
  if (f.priority.length)       apps = apps.filter(a => f.priority.includes(a.priority))
  if (f.workSetup.length)      apps = apps.filter(a => f.workSetup.includes(a.work_setup))
  if (f.employmentType.length) apps = apps.filter(a => f.employmentType.includes(a.employment_type))
  if (f.dateFrom)              apps = apps.filter(a => a.date_applied >= f.dateFrom)
  if (f.dateTo)                apps = apps.filter(a => a.date_applied <= f.dateTo)
  if (f.favouritesOnly)        apps = apps.filter(a => a.is_favourite)
  return apps
})

const activeFilterCount = computed(() => {
  const f = filters.value
  return (f.search ? 1 : 0) +
    f.status.length + f.priority.length + f.workSetup.length + f.employmentType.length +
    (f.dateFrom ? 1 : 0) + (f.dateTo ? 1 : 0) + (f.favouritesOnly ? 1 : 0)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-0">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

      <!-- Page header -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Applications</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ filtered.length }}<span v-if="filtered.length !== store.applications.length"> of {{ store.applications.length }}</span>
            application{{ filtered.length !== 1 ? 's' : '' }}
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">

          <!-- Filter toggle -->
          <button
            class="relative flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors"
            :class="showFilters || activeFilterCount
              ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400'
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'"
            @click="showFilters = !showFilters"
          >
            <!-- Heroicon: funnel -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3z"/>
            </svg>
            Filters
            <span v-if="activeFilterCount"
              class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {{ activeFilterCount }}
            </span>
          </button>

          <!-- List / Board toggle -->
          <div class="flex rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-1 gap-1">
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
              @click="viewMode = 'list'"
            >
              <!-- Heroicon: bars-3 -->
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
              </svg>
              <span class="hidden sm:inline">List</span>
            </button>
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="viewMode === 'kanban'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
              @click="viewMode = 'kanban'"
            >
              <!-- Heroicon: squares-2x2 -->
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
              </svg>
              <span class="hidden sm:inline">Board</span>
            </button>
          </div>

          <!-- Export -->
          <button
            class="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            @click="showExport = true"
          >
            <!-- Heroicon: arrow-down-tray -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
            </svg>
            <span class="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      <!-- Filters panel -->
      <Transition name="slide-down">
        <ApplicationFilters v-if="showFilters" v-model="filters" />
      </Transition>

      <!-- Loading -->
      <LoadingSkeleton v-if="store.loading" :type="viewMode === 'kanban' ? 'kanban' : 'table'" />

      <template v-else>
        <EmptyState
          v-if="store.applications.length === 0"
          title="No applications yet"
          description="Start tracking your job search. Add your first application — it takes less than a minute."
          action-label="Add Application"
          icon="briefcase"
          @action="router.push({ name: 'add-application' })"
        />

        <EmptyState
          v-else-if="filtered.length === 0"
          title="No matches found"
          description="Try adjusting or clearing your filters to see more results."
          action-label="Clear Filters"
          icon="search"
          @action="filters = emptyFilters()"
        />

        <ApplicationTable v-else-if="viewMode === 'list'" :applications="filtered" />

        <KanbanBoard v-else :applications="filtered" />
      </template>
    </main>

    <MobileNav />

    <ExportModal v-if="showExport" :applications="filtered" @close="showExport = false" />
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
