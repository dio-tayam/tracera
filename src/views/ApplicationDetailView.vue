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

const store  = useApplicationsStore()
const route  = useRoute()
const router = useRouter()
const { success, error } = useToast()

const loading           = ref(false)
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
  const wasFav = app.value.is_favourite
  try {
    await store.updateApplication(app.value.id, { is_favourite: !wasFav })
    success(wasFav ? 'Removed from favourites' : 'Saved as favourite')
  } catch { error('Failed to update') }
}

async function handleDelete() {
  try {
    await store.deleteApplication(app.value.id)
    success('Application deleted')
    router.push({ name: 'applications' })
  } catch { error('Failed to delete') }
  finally { showDeleteConfirm.value = false }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
    <AppHeader />
    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">

      <!-- Back -->
      <button
        class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        @click="$router.back()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/>
        </svg>
        Applications
      </button>

      <LoadingSkeleton v-if="loading" type="table" :rows="4" />

      <div v-else-if="!app" class="text-center py-16 text-sm text-gray-500 dark:text-gray-400">
        Application not found.
        <RouterLink :to="{ name: 'applications' }" class="text-blue-600 ml-1 hover:underline">Go back</RouterLink>
      </div>

      <template v-else>

        <!-- ── Header card ──────────────────────────────────────────────── -->
        <div class="card p-6">
          <div class="flex items-start gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ app.company_name }}</h1>
                <button
                  class="transition-transform hover:scale-110 leading-none"
                  :class="app.is_favourite ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'"
                  @click="toggleFavourite"
                  title="Toggle favourite"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z"/>
                  </svg>
                </button>
              </div>
              <p class="text-base text-gray-500 dark:text-gray-400 mb-3">{{ app.job_title }}</p>
              <div class="flex items-center gap-2 flex-wrap">
                <StatusBadge :status="app.status" />
                <PriorityBadge :priority="app.priority || 'Medium'" />
                <span v-if="app.work_setup" class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-lg">{{ app.work_setup }}</span>
                <span v-if="app.employment_type" class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-lg">{{ app.employment_type }}</span>
              </div>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <a v-if="app.job_url" :href="app.job_url" target="_blank" rel="noopener noreferrer"
                class="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                title="Open job listing">
                <!-- Heroicon: arrow-top-right-on-square -->
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                </svg>
              </a>
              <RouterLink :to="{ name: 'edit-application', params: { id: app.id } }"
                class="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                title="Edit">
                <!-- Heroicon: pencil-square -->
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                </svg>
              </RouterLink>
              <button
                class="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors"
                title="Delete"
                @click="showDeleteConfirm = true">
                <!-- Heroicon: trash -->
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- ── Content grid ─────────────────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <!-- Left / main -->
          <div class="lg:col-span-2 space-y-4">

            <!-- Key details -->
            <div class="card p-5">
              <h3 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Details</h3>
              <dl class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <dt class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Date Applied</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(app.date_applied) }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Salary Range</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ formatSalary(app.salary_min, app.salary_max) }}</dd>
                </div>
                <div v-if="app.interview_date">
                  <dt class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Interview Date</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDateTime(app.interview_date) }}</dd>
                </div>
                <div v-if="app.followup_date">
                  <dt class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Follow-up Date</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(app.followup_date) }}</dd>
                </div>
                <div v-if="app.contact_name">
                  <dt class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Contact</dt>
                  <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ app.contact_name }}</dd>
                </div>
                <div v-if="app.contact_email">
                  <dt class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Contact Email</dt>
                  <dd class="text-sm"><a :href="`mailto:${app.contact_email}`" class="text-blue-600 dark:text-blue-400 hover:underline">{{ app.contact_email }}</a></dd>
                </div>
              </dl>
            </div>

            <!-- Scoring -->
            <div class="card p-5">
              <h3 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Scoring</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Role Excitement</p>
                  <div class="flex gap-1">
                    <svg v-for="n in 5" :key="n" class="w-5 h-5" :class="(app.rating ?? 0) >= n ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Confidence Level</p>
                  <div class="flex gap-1">
                    <span v-for="n in 5" :key="n" class="text-xl" :class="(app.confidence_score ?? 0) >= n ? 'text-blue-500' : 'text-gray-200 dark:text-gray-700'">◆</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Interview notes -->
            <div v-if="app.interview_notes" class="card p-5">
              <h3 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Interview Notes</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ app.interview_notes }}</p>
            </div>

            <!-- Notes -->
            <div v-if="app.notes" class="card p-5">
              <h3 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Notes</h3>
              <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{{ app.notes }}</p>
            </div>

            <!-- Status Timeline -->
            <StatusTimeline :application-id="app.id" />
          </div>

          <!-- Right sidebar -->
          <div class="space-y-4">
            <PrepChecklist :application-id="app.id" />

            <!-- Meta -->
            <div class="card p-4 text-xs text-gray-400 dark:text-gray-500 space-y-1">
              <div class="flex justify-between">
                <span>Added</span>
                <span>{{ formatDate(app.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Last updated</span>
                <span>{{ formatDate(app.updated_at) }}</span>
              </div>
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
