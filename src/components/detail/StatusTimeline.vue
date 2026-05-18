<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApplicationsStore } from '@/stores/applications'
import { useToast } from '@/composables/useToast'
import { formatDateTime, STATUSES, MOODS } from '@/utils/helpers'
import StatusBadge from '@/components/common/StatusBadge.vue'

const props = defineProps({
  applicationId: { type: String, required: true }
})

const store = useApplicationsStore()
const { success, error } = useToast()
const timeline = ref([])
const loading  = ref(true)
const adding   = ref(false)
const saving   = ref(false)

// Track the current application status from the store
const currentApp = computed(() => store.applications.find(a => a.id === props.applicationId))

// Default new entry to the application's current status (not always "Applied")
const newEntry = ref({ status: 'Applied', mood: '', note: '' })

onMounted(async () => {
  await loadTimeline()
  if (currentApp.value?.status) {
    newEntry.value.status = currentApp.value.status
  }
})

async function loadTimeline() {
  loading.value = true
  try {
    timeline.value = await store.fetchTimeline(props.applicationId)
  } catch {
    error('Failed to load timeline')
  } finally {
    loading.value = false
  }
}

async function addEntry() {
  if (!newEntry.value.status || saving.value) return
  saving.value = true

  const prevStatus = currentApp.value?.status

  try {
    if (newEntry.value.status !== prevStatus) {
      // Status is changing → update the application record (which also logs a timeline entry)
      await store.updateApplication(props.applicationId, {
        status: newEntry.value.status,
        _mood:  newEntry.value.mood  || null,
        _note:  newEntry.value.note  || null
      })
    } else {
      // Same status → just log a mood / note entry without changing the app record
      await store.addTimelineEntry(props.applicationId, {
        status: newEntry.value.status,
        mood:   newEntry.value.mood  || null,
        note:   newEntry.value.note  || null
      })
    }

    // Reload timeline so it reflects whatever was written to Supabase
    timeline.value = await store.fetchTimeline(props.applicationId)

    newEntry.value = { status: newEntry.value.status, mood: '', note: '' }
    adding.value   = false
    success('Entry saved')
  } catch {
    error('Failed to save entry')
  } finally {
    saving.value = false
  }
}

const DOT_COLOR = {
  Applied:   'bg-blue-500',
  Interview: 'bg-purple-500',
  Offer:     'bg-green-500',
  Rejected:  'bg-red-500',
  Ghosted:   'bg-gray-400',
  Withdrawn: 'bg-orange-400'
}
</script>

<template>
  <div class="card p-5">

    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <!-- Heroicon: clock -->
        <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Status Timeline</h3>
      </div>
      <button
        class="text-xs font-medium transition-colors"
        :class="adding
          ? 'text-gray-400 dark:text-gray-500'
          : 'text-blue-600 dark:text-blue-400 hover:text-blue-700'"
        @click="adding = !adding"
      >
        {{ adding ? 'Cancel' : '+ Log entry' }}
      </button>
    </div>

    <!-- Add entry form -->
    <Transition name="slide-down">
      <div v-if="adding"
        class="mb-5 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 space-y-3">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- Status picker -->
          <div>
            <label class="form-label text-xs">Status</label>
            <select
              v-model="newEntry.status"
              class="form-input text-sm py-2"
            >
              <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
            </select>
            <p
              v-if="currentApp && newEntry.status !== currentApp.status"
              class="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium"
            >
              Will update application status to <strong>{{ newEntry.status }}</strong>
            </p>
          </div>

          <!-- Mood picker -->
          <div>
            <label class="form-label text-xs">Mood (optional)</label>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="m in MOODS"
                :key="m"
                type="button"
                class="text-lg hover:scale-125 transition-transform rounded p-0.5"
                :class="newEntry.mood === m
                  ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-400'
                  : ''"
                @click="newEntry.mood = newEntry.mood === m ? '' : m"
              >{{ m }}</button>
            </div>
          </div>
        </div>

        <!-- Note -->
        <div>
          <label class="form-label text-xs">Note (optional)</label>
          <input
            v-model="newEntry.note"
            type="text"
            placeholder="What happened? How did it go?"
            class="form-input text-sm py-2"
            @keyup.enter="addEntry"
          />
        </div>

        <button
          :disabled="saving"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          @click="addEntry"
        >
          <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ saving ? 'Saving…' : 'Save Entry' }}
        </button>
      </div>
    </Transition>

    <!-- Loading skeleton -->
    <div v-if="loading" class="animate-pulse space-y-4">
      <div v-for="i in 3" :key="i" class="flex gap-3">
        <div class="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 shrink-0"></div>
        <div class="flex-1 space-y-1.5">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div class="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Timeline entries -->
    <div v-else-if="timeline.length" class="relative">
      <div class="absolute left-1.5 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700/60"></div>
      <div class="space-y-4">
        <div
          v-for="entry in [...timeline].reverse()"
          :key="entry.id"
          class="flex gap-4 pl-6 relative"
        >
          <!-- Status dot -->
          <div
            class="absolute left-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 top-0.5 shrink-0"
            :class="DOT_COLOR[entry.status] ?? 'bg-gray-400'"
          ></div>

          <div class="flex-1 min-w-0 pb-1">
            <div class="flex items-center gap-2 flex-wrap">
              <StatusBadge :status="entry.status" size="sm" />
              <span v-if="entry.mood" class="text-base leading-none">{{ entry.mood }}</span>
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-auto whitespace-nowrap">
                {{ formatDateTime(entry.changed_at) }}
              </span>
            </div>
            <p v-if="entry.note" class="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-snug">
              {{ entry.note }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
      No entries yet — log your first status update above
    </div>

  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
