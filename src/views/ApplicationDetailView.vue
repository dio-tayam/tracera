<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PriorityBadge from '@/components/common/PriorityBadge.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import StatusTimeline from '@/components/detail/StatusTimeline.vue'
import PrepChecklist from '@/components/detail/PrepChecklist.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useToast } from '@/composables/useToast'
import { formatDate, formatDateTime, formatSalary } from '@/utils/helpers'

const store = useApplicationsStore()
const route = useRoute()
const router = useRouter()
const { success, error } = useToast()

const loading = ref(false)
const showDeleteConfirm = ref(false)

onMounted(async () => {
  if (!store.applications.length) {
    loading.value = true
    await store.fetchApplications()
    loading.value = false
  }
})

const app = computed(() => store.applications.find(a => a.id === route.params.id))

async function toggleFavourite() {
  if (!app.value) return
  try {
    await store.updateApplication(app.value.id, { is_favourite: !app.value.is_favourite })
    success(app.value.is_favourite ? 'Removed from favourites' : 'Added to favourites')
  } catch {
    error('Failed to update')
  }
}

async function handleDelete() {
  try {
    await store.deleteApplication(app.value.id)
    success('Application deleted')
    router.push({ name: 'applications' })
  } catch {
    error('Failed to delete')
  } finally {
    showDeleteConfirm.value = false
  }
}

const fields = [
  { label: 'Status',          key: 'status',          type: 'status' },
  { label: 'Priority',        key: 'priority',        type: 'priority' },
  { label: 'Date Applied',    key: 'date_applied',    type: 'date' },
  { label: 'Work Setup',      key: 'work_setup',      type: 'text' },
  { label: 'Employment Type', key: 'employment_type', type: 'text' },
  { label: 'Salary Range',    key: '_salary',         type: 'salary' },
  { label: 'Interview Date',  key: 'interview_date',  type: 'datetime' },
  { label: 'Follow-up Date',  key: 'followup_date',   type: 'date' },
  { label: 'Contact',         key: '_contact',        type: 'contact' },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 md:pb-0">
    <AppHeader />
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">

      <!-- Back -->
      <button
        class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        @click="$router.back()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Applications
      </button>

      <LoadingSkeleton v-if="loading" type="table" :rows="4" />

      <div v-else-if="!app" class="text-center py-16 text-gray-500 dark:text-gray-400">
        Application not found.
        <RouterLink :to="{ name: 'applications' }" class="text-blue-600 ml-1 hover:underline">Go back</RouterLink>
      </div>

      <template v-else>
        <!-- Header card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white truncate">{{ app.company_name }}</h1>
                <button
                  class="text-2xl transition-transform hover:scale-125"
                  :class="app.is_favourite ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'"
                  @click="toggleFavourite"
                >
                  {{ app.is_favourite ? '★' : '☆' }}
                </button>
              </div>
              <p class="text-lg text-gray-600 dark:text-gray-400 mb-3">{{ app.job_title }}</p>
              <div class="flex items-center gap-2 flex-wrap">
                <StatusBadge :status="app.status" />
                <PriorityBadge :priority="app.priority || 'Medium'" />
                <span v-if="app.work_setup" class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">{{ app.work_setup }}</span>
                <span v-if="app.employment_type" class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">{{ app.employment_type }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <a
                v-if="app.job_url"
                :href="app.job_url"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-colors"
                title="Open job listing"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
              <RouterLink
                :to="{ name: 'edit-application', params: { id: app.id } }"
                class="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-colors"
                title="Edit"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </RouterLink>
              <button
                class="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 transition-colors"
                title="Delete"
                @click="showDeleteConfirm = true"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Details grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Left col: details -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Key details -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Application Details</h3>
              <dl class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date Applied</dt>
                  <dd class="text-sm text-gray-900 dark:text-white">{{ formatDate(app.date_applied) }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Salary Range</dt>
                  <dd class="text-sm text-gray-900 dark:text-white">{{ formatSalary(app.salary_min, app.salary_max) }}</dd>
                </div>
                <div v-if="app.interview_date">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Interview Date</dt>
                  <dd class="text-sm text-gray-900 dark:text-white">{{ formatDateTime(app.interview_date) }}</dd>
                </div>
                <div v-if="app.followup_date">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Follow-up Date</dt>
                  <dd class="text-sm text-gray-900 dark:text-white">{{ formatDate(app.followup_date) }}</dd>
                </div>
                <div v-if="app.contact_name">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Contact</dt>
                  <dd class="text-sm text-gray-900 dark:text-white">{{ app.contact_name }}</dd>
                </div>
                <div v-if="app.contact_email">
                  <dt class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Contact Email</dt>
                  <dd class="text-sm text-blue-600 dark:text-blue-400">
                    <a :href="`mailto:${app.contact_email}`">{{ app.contact_email }}</a>
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Scoring -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Scoring</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Role Rating</p>
                  <div class="flex gap-1">
                    <span v-for="n in 5" :key="n" class="text-xl" :class="(app.rating ?? 0) >= n ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'">★</span>
                  </div>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Confidence Score</p>
                  <div class="flex gap-1">
                    <span v-for="n in 5" :key="n" class="text-xl" :class="(app.confidence_score ?? 0) >= n ? 'text-blue-500' : 'text-gray-200 dark:text-gray-700'">◆</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Interview notes -->
            <div v-if="app.interview_notes" class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Interview Notes</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{{ app.interview_notes }}</p>
            </div>

            <!-- Notes -->
            <div v-if="app.notes" class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Notes</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{{ app.notes }}</p>
            </div>

            <!-- Status Timeline -->
            <StatusTimeline :application-id="app.id" />
          </div>

          <!-- Right col: prep checklist -->
          <div class="space-y-4">
            <PrepChecklist :application-id="app.id" />

            <!-- Meta -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>Created {{ formatDate(app.created_at) }}</p>
              <p>Updated {{ formatDate(app.updated_at) }}</p>
            </div>
          </div>
        </div>
      </template>
    </main>

    <ConfirmModal
      v-if="showDeleteConfirm"
      :title="`Delete ${app?.company_name}?`"
      message="This will permanently remove this application and all its timeline history."
      confirm-text="Delete"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />

    <MobileNav />
  </div>
</template>
