<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useApplicationsStore } from '@/stores/applications'
import { STATUSES, PRIORITIES, WORK_SETUPS, EMPLOYMENT_TYPES, todayISO, toInputDate } from '@/utils/helpers'

const props = defineProps({
  initial: { type: Object, default: null }
})
const emit = defineEmits(['submit', 'cancel'])

const store = useApplicationsStore()

const defaultForm = () => ({
  company_name: '', job_title: '', job_url: '',
  date_applied: todayISO(), status: 'Applied', priority: 'Medium',
  salary_min: '', salary_max: '', work_setup: '', employment_type: '',
  contact_name: '', contact_email: '',
  interview_date: '', interview_notes: '', followup_date: '',
  rating: null, confidence_score: null, notes: '', is_favourite: false
})

const form    = ref(defaultForm())
const errors  = ref({})
const dirty   = ref(false)
const loading = ref(false)
let watchReady = false

onMounted(async () => {
  if (props.initial) {
    form.value = {
      ...defaultForm(),
      ...props.initial,
      date_applied:   toInputDate(props.initial.date_applied),
      interview_date: props.initial.interview_date ? toInputDate(props.initial.interview_date) : '',
      followup_date:  toInputDate(props.initial.followup_date)
    }
  }
  await nextTick()
  watchReady = true
})

watch(form, () => { if (watchReady) dirty.value = true }, { deep: true })

onBeforeRouteLeave(() => {
  if (dirty.value && !loading.value) {
    return window.confirm('You have unsaved changes. Leave without saving?')
  }
})

const companySuggestions = () =>
  [...new Set(store.applications.map(a => a.company_name).filter(Boolean))]

function setScore(val, field) {
  form.value[field] = form.value[field] === val ? null : val
}

function validate() {
  const e = {}
  if (!form.value.company_name.trim()) e.company_name = 'Required'
  if (!form.value.job_title.trim())    e.job_title    = 'Required'
  if (!form.value.status)              e.status       = 'Required'
  if (form.value.salary_min && form.value.salary_max &&
      Number(form.value.salary_min) > Number(form.value.salary_max))
    e.salary_max = 'Max must be ≥ min'
  if (form.value.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.contact_email))
    e.contact_email = 'Invalid email'
  errors.value = e
  return !Object.keys(e).length
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  dirty.value   = false
  const payload = { ...form.value }
  if (!payload.salary_min)    payload.salary_min    = null
  if (!payload.salary_max)    payload.salary_max    = null
  if (!payload.interview_date) payload.interview_date = null
  emit('submit', payload)
  loading.value = false
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit" novalidate>

    <!-- ── 1. Basic Info ─────────────────────────────────────────────────── -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
      <div class="px-6 py-4">
        <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Basic Information</h2>
      </div>
      <div class="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

        <div>
          <label class="form-label">Company Name <span class="text-red-500">*</span></label>
          <input v-model="form.company_name" type="text" list="co-suggestions"
            placeholder="e.g. Stripe" class="form-input" :class="errors.company_name ? 'border-red-400 focus:ring-red-400' : ''" />
          <datalist id="co-suggestions">
            <option v-for="s in companySuggestions()" :key="s" :value="s" />
          </datalist>
          <p v-if="errors.company_name" class="form-error">{{ errors.company_name }}</p>
        </div>

        <div>
          <label class="form-label">Job Title <span class="text-red-500">*</span></label>
          <input v-model="form.job_title" type="text"
            placeholder="e.g. Software Engineer" class="form-input" :class="errors.job_title ? 'border-red-400 focus:ring-red-400' : ''" />
          <p v-if="errors.job_title" class="form-error">{{ errors.job_title }}</p>
        </div>

        <div class="sm:col-span-2">
          <label class="form-label">Job Listing URL</label>
          <input v-model="form.job_url" type="url" placeholder="https://..." class="form-input" />
        </div>

        <div>
          <label class="form-label">Date Applied</label>
          <input v-model="form.date_applied" type="date" class="form-input" />
        </div>

        <div>
          <label class="form-label">Status <span class="text-red-500">*</span></label>
          <select v-model="form.status" class="form-input">
            <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div>
          <label class="form-label">Priority</label>
          <div class="flex gap-2 mt-1">
            <button v-for="p in PRIORITIES" :key="p" type="button"
              class="flex-1 py-2 rounded-xl border text-sm font-medium transition-colors"
              :class="form.priority === p
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700'"
              @click="form.priority = p">{{ p }}</button>
          </div>
        </div>

        <div class="flex items-center">
          <button type="button"
            class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
            :class="form.is_favourite
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
              : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-amber-300'"
            @click="form.is_favourite = !form.is_favourite">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
            </svg>
            {{ form.is_favourite ? 'Saved as Favourite' : 'Mark as Favourite' }}
          </button>
        </div>
      </div>
    </section>

    <!-- ── 2. Employment ──────────────────────────────────────────────────── -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
      <div class="px-6 py-4">
        <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Employment Details</h2>
      </div>
      <div class="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label class="form-label">Work Setup</label>
          <div class="flex gap-2 mt-1">
            <button v-for="w in WORK_SETUPS" :key="w" type="button"
              class="flex-1 py-2 rounded-xl border text-sm font-medium transition-colors"
              :class="form.work_setup === w
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700'"
              @click="form.work_setup = form.work_setup === w ? '' : w">{{ w }}</button>
          </div>
        </div>
        <div>
          <label class="form-label">Employment Type</label>
          <div class="flex flex-wrap gap-2 mt-1">
            <button v-for="t in EMPLOYMENT_TYPES" :key="t" type="button"
              class="px-3 py-2 rounded-xl border text-sm font-medium transition-colors"
              :class="form.employment_type === t
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700'"
              @click="form.employment_type = form.employment_type === t ? '' : t">{{ t }}</button>
          </div>
        </div>
        <div>
          <label class="form-label">Salary Min (USD)</label>
          <input v-model.number="form.salary_min" type="number" min="0" placeholder="60,000" class="form-input" />
        </div>
        <div>
          <label class="form-label">Salary Max (USD)</label>
          <input v-model.number="form.salary_max" type="number" min="0" placeholder="90,000"
            class="form-input" :class="errors.salary_max ? 'border-red-400' : ''" />
          <p v-if="errors.salary_max" class="form-error">{{ errors.salary_max }}</p>
        </div>
      </div>
    </section>

    <!-- ── 3. Contact ─────────────────────────────────────────────────────── -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
      <div class="px-6 py-4">
        <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Contact Details</h2>
      </div>
      <div class="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label class="form-label">Contact Name</label>
          <input v-model="form.contact_name" type="text" placeholder="Hiring manager or recruiter" class="form-input" />
        </div>
        <div>
          <label class="form-label">Contact Email</label>
          <input v-model="form.contact_email" type="email" placeholder="recruiter@company.com"
            class="form-input" :class="errors.contact_email ? 'border-red-400' : ''" />
          <p v-if="errors.contact_email" class="form-error">{{ errors.contact_email }}</p>
        </div>
      </div>
    </section>

    <!-- ── 4. Timeline ────────────────────────────────────────────────────── -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
      <div class="px-6 py-4">
        <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Timeline & Notes</h2>
      </div>
      <div class="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label class="form-label">Interview Date & Time</label>
          <input v-model="form.interview_date" type="date" class="form-input" />
        </div>
        <div>
          <label class="form-label">Follow-up Date</label>
          <input v-model="form.followup_date" type="date" class="form-input" />
        </div>
        <div class="sm:col-span-2">
          <label class="form-label">Interview Notes</label>
          <textarea v-model="form.interview_notes" rows="3"
            placeholder="Notes from calls, interviews, prep questions..."
            class="form-input resize-none"></textarea>
        </div>
      </div>
    </section>

    <!-- ── 5. Scoring ─────────────────────────────────────────────────────── -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
      <div class="px-6 py-4">
        <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Scoring</h2>
      </div>
      <div class="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="form-label mb-2">Role Excitement</label>
          <div class="flex gap-1.5">
            <button v-for="n in 5" :key="n" type="button"
              class="text-2xl transition-transform hover:scale-110 focus:outline-none"
              :class="(form.rating ?? 0) >= n ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'"
              @click="setScore(n, 'rating')">★</button>
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1.5">How excited are you about this role?</p>
        </div>
        <div>
          <label class="form-label mb-2">Confidence Level</label>
          <div class="flex gap-1.5">
            <button v-for="n in 5" :key="n" type="button"
              class="text-2xl transition-transform hover:scale-110 focus:outline-none"
              :class="(form.confidence_score ?? 0) >= n ? 'text-blue-500' : 'text-gray-200 dark:text-gray-700'"
              @click="setScore(n, 'confidence_score')">◆</button>
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1.5">How confident do you feel about this role?</p>
        </div>
      </div>
    </section>

    <!-- ── 6. Notes ───────────────────────────────────────────────────────── -->
    <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
      <div class="px-6 py-4">
        <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Notes</h2>
      </div>
      <div class="px-6 py-5">
        <textarea v-model="form.notes" rows="4"
          placeholder="Any additional context, thoughts, or reminders..."
          class="form-input resize-none w-full"></textarea>
      </div>
    </section>

    <!-- ── Actions ───────────────────────────────────────────────────────── -->
    <div class="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pb-24 md:pb-0">
      <button type="button"
        class="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        @click="$emit('cancel')">
        Cancel
      </button>
      <button type="submit" :disabled="loading"
        class="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-60">
        {{ loading ? 'Saving…' : (initial ? 'Save Changes' : 'Add Application') }}
      </button>
    </div>

  </form>
</template>
