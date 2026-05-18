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

const store = useApplicationsStore()
const router = useRouter()

const viewMode = ref('list')
const showExport = ref(false)
const showFilters = ref(false)

const filters = ref({
  search: '',
  status: [],
  priority: [],
  workSetup: [],
  employmentType: [],
  dateFrom: '',
  dateTo: '',
  favouritesOnly: false
})

onMounted(async () => {
  if (!store.applications.length) await store.fetchApplications()
})

const filtered = computed(() => {
  let apps = store.applications

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    apps = apps.filter(a =>
      a.company_name?.toLowerCase().includes(q) ||
      a.job_title?.toLowerCase().includes(q) ||
      a.notes?.toLowerCase().includes(q)
    )
  }
  if (filters.value.status.length)
    apps = apps.filter(a => filters.value.status.includes(a.status))
  if (filters.value.priority.length)
    apps = apps.filter(a => filters.value.priority.includes(a.priority))
  if (filters.value.workSetup.length)
    apps = apps.filter(a => filters.value.workSetup.includes(a.work_setup))
  if (filters.value.employmentType.length)
    apps = apps.filter(a => filters.value.employmentType.includes(a.employment_type))
  if (filters.value.dateFrom)
    apps = apps.filter(a => a.date_applied >= filters.value.dateFrom)
  if (filters.value.dateTo)
    apps = apps.filter(a => a.date_applied <= filters.value.dateTo)
  if (filters.value.favouritesOnly)
    apps = apps.filter(a => a.is_favourite)

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
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 md:pb-0">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

      <!-- Page header -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Applications</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ filtered.length }} of {{ store.applications.length }} applications
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Filter toggle -->
          <button
            class="relative flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors"
            :class="showFilters
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'"
            @click="showFilters = !showFilters"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            Filters
            <span v-if="activeFilterCount" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {{ activeFilterCount }}
            </span>
          </button>

          <!-- View toggle -->
          <div class="flex rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 gap-1">
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              :class="viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
              @click="viewMode = 'list'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
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
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
              </svg>
              <span class="hidden sm:inline">Board</span>
            </button>
          </div>

          <!-- Export -->
          <button
            class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 transition-colors"
            @click="showExport = true"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
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
        <!-- Empty state (no apps at all) -->
        <EmptyState
          v-if="store.applications.length === 0"
          title="No applications yet"
          description="Start tracking your job search by adding your first application. It only takes 30 seconds!"
          action-label="+ Add Application"
          icon="briefcase"
          @action="router.push({ name: 'add-application' })"
        />

        <!-- Empty filtered state -->
        <EmptyState
          v-else-if="filtered.length === 0"
          title="No matches found"
          description="Try adjusting your filters or search query to see more applications."
          action-label="Reset Filters"
          icon="search"
          @action="filters = { search: '', status: [], priority: [], workSetup: [], employmentType: [], dateFrom: '', dateTo: '', favouritesOnly: false }"
        />

        <!-- List view -->
        <ApplicationTable v-else-if="viewMode === 'list'" :applications="filtered" />

        <!-- Kanban view -->
        <KanbanBoard v-else :applications="store.applications" />
      </template>
    </main>

    <MobileNav />

    <!-- Export modal -->
    <ExportModal
      v-if="showExport"
      :applications="filtered"
      @close="showExport = false"
    />
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
