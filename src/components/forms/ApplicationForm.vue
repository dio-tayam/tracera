<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useApplicationsStore } from '@/stores/applications'
import { STATUSES, PRIORITIES, WORK_SETUPS, EMPLOYMENT_TYPES, todayISO, toInputDate, MOODS } from '@/utils/helpers'

const props = defineProps({
  initial: { type: Object, default: null }
})

const emit = defineEmits(['submit', 'cancel'])

const store = useApplicationsStore()

const defaultForm = () => ({
  company_name:    '',
  job_title:       '',
  job_url:         '',
  date_applied:    todayISO(),
  status:          'Applied',
  priority:        'Medium',
  salary_min:      '',
  salary_max:      '',
  work_setup:      '',
  employment_type: '',
  contact_name:    '',
  contact_email:   '',
  interview_date:  '',
  interview_notes: '',
  followup_date:   '',
  rating:          null,
  confidence_score: null,
  notes:           '',
  is_favourite:    false
})

const form = ref(defaultForm())
const errors = ref({})
const dirty = ref(false)
const loading = ref(false)

onMounted(() => {
  if (props.initial) {
    form.value = {
      ...defaultForm(),
      ...props.initial,
      date_applied:   toInputDate(props.initial.date_applied),
      interview_date: props.initial.interview_date ? toInputDate(props.initial.interview_date) : '',
      followup_date:  toInputDate(props.initial.followup_date)
    }
  }
})

watch(form, () => { dirty.value = true }, { deep: true })

onBeforeRouteLeave(() => {
  if (dirty.value && !loading.value) {
    return window.confirm('You have unsaved changes. Are you sure you want to leave?')
  }
})

const companySuggestions = computed(() =>
  [...new Set(store.applications.map(a => a.company_name).filter(Boolean))]
)

function setRating(val, field) {
  if (form.value[field] === val) form.value[field] = null
  else form.value[field] = val
}

function validate() {
  const e = {}
  if (!form.value.company_name.trim()) e.company_name = 'Company name is required'
  if (!form.value.job_title.trim()) e.job_title = 'Job title is required'
  if (!form.value.status) e.status = 'Status is required'
  if (form.value.salary_min && form.value.salary_max && Number(form.value.salary_min) > Number(form.value.salary_max)) {
    e.salary_max = 'Max salary must be ≥ min salary'
  }
  if (form.value.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.contact_email)) {
    e.contact_email = 'Invalid email address'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  dirty.value = false
  const payload = { ...form.value }
  if (!payload.salary_min) payload.salary_min = null
  if (!payload.salary_max) payload.salary_max = null
  if (!payload.interview_date) payload.interview_date = null
  emit('submit', payload)
  loading.value = false
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit" novalidate>

    <!-- ── Section: Basic Info ── -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">1</span>
        Basic Info
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Company Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Company Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.company_name"
            type="text"
            list="company-suggestions"
            placeholder="e.g. Google"
            class="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400"
            :class="errors.company_name
              ? 'border-red-400 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'"
          />
          <datalist id="company-suggestions">
            <option v-for="s in companySuggestions" :key="s" :value="s" />
          </datalist>
          <p v-if="errors.company_name" class="mt-1 text-xs text-red-500">{{ errors.company_name }}</p>
        </div>

        <!-- Job Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Job Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.job_title"
            type="text"
            placeholder="e.g. Software Engineer"
            class="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400"
            :class="errors.job_title
              ? 'border-red-400 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'"
          />
          <p v-if="errors.job_title" class="mt-1 text-xs text-red-500">{{ errors.job_title }}</p>
        </div>

        <!-- Job URL -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Job Listing URL</label>
          <input
            v-model="form.job_url"
            type="url"
            placeholder="https://..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <!-- Date Applied -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date Applied</label>
          <input
            v-model="form.date_applied"
            type="date"
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Status <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.status"
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Priority</label>
          <div class="flex gap-2">
            <button
              v-for="p in PRIORITIES"
              :key="p"
              type="button"
              class="flex-1 py-2 rounded-xl border text-sm font-medium transition-colors"
              :class="form.priority === p
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'"
              @click="form.priority = p"
            >{{ p }}</button>
          </div>
        </div>

        <!-- Favourite toggle -->
        <div class="flex items-center gap-3 sm:self-end sm:pb-0.5">
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
            :class="form.is_favourite
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-300'"
            @click="form.is_favourite = !form.is_favourite"
          >
            <span class="text-lg">{{ form.is_favourite ? '★' : '☆' }}</span>
            {{ form.is_favourite ? 'Saved as Favourite' : 'Mark as Favourite' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Section: Employment Details ── -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">2</span>
        Employment Details
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Work Setup</label>
          <div class="flex gap-2">
            <button
              v-for="w in WORK_SETUPS"
              :key="w"
              type="button"
              class="flex-1 py-2 rounded-xl border text-sm font-medium transition-colors"
              :class="form.work_setup === w
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'"
              @click="form.work_setup = form.work_setup === w ? '' : w"
            >{{ w }}</button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Employment Type</label>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="t in EMPLOYMENT_TYPES"
              :key="t"
              type="button"
              class="py-2 px-3 rounded-xl border text-sm font-medium transition-colors"
              :class="form.employment_type === t
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'"
              @click="form.employment_type = form.employment_type === t ? '' : t"
            >{{ t }}</button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Salary Min ($)</label>
          <input
            v-model.number="form.salary_min"
            type="number"
            min="0"
            placeholder="e.g. 60000"
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Salary Max ($)</label>
          <input
            v-model.number="form.salary_max"
            type="number"
            min="0"
            placeholder="e.g. 90000"
            class="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            :class="errors.salary_max ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'"
          />
          <p v-if="errors.salary_max" class="mt-1 text-xs text-red-500">{{ errors.salary_max }}</p>
        </div>
      </div>
    </div>

    <!-- ── Section: Contact ── -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">3</span>
        Contact
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contact Name</label>
          <input
            v-model="form.contact_name"
            type="text"
            placeholder="Recruiter or hiring manager name"
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contact Email</label>
          <input
            v-model="form.contact_email"
            type="email"
            placeholder="recruiter@company.com"
            class="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            :class="errors.contact_email ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'"
          />
          <p v-if="errors.contact_email" class="mt-1 text-xs text-red-500">{{ errors.contact_email }}</p>
        </div>
      </div>
    </div>

    <!-- ── Section: Timeline ── -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">4</span>
        Timeline & Notes
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Interview Date</label>
          <input
            v-model="form.interview_date"
            type="date"
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Follow-up Date</label>
          <input
            v-model="form.followup_date"
            type="date"
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Interview Notes</label>
          <textarea
            v-model="form.interview_notes"
            rows="3"
            placeholder="Notes from interviews, prep questions, etc."
            class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- ── Section: Scoring ── -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">5</span>
        Scoring
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role Rating</label>
          <div class="flex gap-2">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              class="text-2xl transition-transform hover:scale-110"
              :class="(form.rating ?? 0) >= n ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'"
              @click="setRating(n, 'rating')"
            >★</button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">How excited are you about this role?</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confidence Score</label>
          <div class="flex gap-2">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              class="text-2xl transition-transform hover:scale-110"
              :class="(form.confidence_score ?? 0) >= n ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'"
              @click="setRating(n, 'confidence_score')"
            >◆</button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">How confident do you feel about getting this role?</p>
        </div>
      </div>
    </div>

    <!-- ── Section: Notes ── -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
        <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold">6</span>
        Notes
      </h2>
      <textarea
        v-model="form.notes"
        rows="4"
        placeholder="Any additional notes about this application..."
        class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
      ></textarea>
    </div>

    <!-- ── Actions ── -->
    <div class="flex flex-col sm:flex-row gap-3 sm:justify-end pb-20 md:pb-0">
      <button
        type="button"
        class="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Saving...' : (initial ? 'Save Changes' : 'Add Application') }}
      </button>
    </div>

  </form>
</template>
