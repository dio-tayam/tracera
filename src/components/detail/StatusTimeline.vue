<script setup>
import { ref, onMounted } from 'vue'
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
const loading = ref(true)
const adding = ref(false)
const newEntry = ref({ status: 'Applied', mood: '', note: '' })

onMounted(async () => {
  await loadTimeline()
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
  if (!newEntry.value.status) return
  try {
    const entry = await store.addTimelineEntry(props.applicationId, {
      status: newEntry.value.status,
      mood: newEntry.value.mood || null,
      note: newEntry.value.note || null
    })
    timeline.value.push(entry)
    newEntry.value = { status: 'Applied', mood: '', note: '' }
    adding.value = false
    success('Timeline entry added')
  } catch {
    error('Failed to add entry')
  }
}

const STATUS_COLORS = {
  Applied:   'border-blue-500 bg-blue-500',
  Interview: 'border-purple-500 bg-purple-500',
  Offer:     'border-green-500 bg-green-500',
  Rejected:  'border-red-500 bg-red-500',
  Ghosted:   'border-gray-400 bg-gray-400',
  Withdrawn: 'border-orange-400 bg-orange-400'
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Status Timeline</h3>
      <button
        class="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
        @click="adding = !adding"
      >
        {{ adding ? 'Cancel' : '+ Add entry' }}
      </button>
    </div>

    <!-- Add entry form -->
    <Transition name="slide-down">
      <div v-if="adding" class="mb-5 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
            <select
              v-model="newEntry.status"
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Mood</label>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="m in MOODS"
                :key="m"
                type="button"
                class="text-xl hover:scale-125 transition-transform rounded p-0.5"
                :class="newEntry.mood === m ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-400' : ''"
                @click="newEntry.mood = newEntry.mood === m ? '' : m"
              >{{ m }}</button>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Note</label>
          <input
            v-model="newEntry.note"
            type="text"
            placeholder="What happened? How did it go?"
            class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="addEntry"
          />
        </div>
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          @click="addEntry"
        >
          Save Entry
        </button>
      </div>
    </Transition>

    <!-- Loading -->
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
      <div class="absolute left-1.5 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
      <div class="space-y-4">
        <div
          v-for="(entry, i) in [...timeline].reverse()"
          :key="entry.id"
          class="flex gap-4 pl-6 relative"
        >
          <div
            class="absolute left-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 top-0.5"
            :class="STATUS_COLORS[entry.status] ?? 'bg-gray-400'"
          ></div>
          <div class="flex-1 pb-1">
            <div class="flex items-center gap-2 flex-wrap">
              <StatusBadge :status="entry.status" size="sm" />
              <span v-if="entry.mood" class="text-lg">{{ entry.mood }}</span>
              <span class="text-xs text-gray-400 dark:text-gray-500 ml-auto">{{ formatDateTime(entry.changed_at) }}</span>
            </div>
            <p v-if="entry.note" class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ entry.note }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
      No timeline entries yet
    </div>
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
