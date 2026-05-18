<script setup>
import { ref } from 'vue'
import { exportFullCSV, exportRecruiterCSV, exportFollowUpCSV, exportJSON, exportPDF } from '@/utils/exportUtils'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  applications: { type: Array, required: true }
})
defineEmits(['close'])

const { success } = useToast()
const activeTab   = ref('csv')
const selectedCSV = ref('full')
const selectedPDF = ref('modern')

function runCSV() {
  if (selectedCSV.value === 'full')      exportFullCSV(props.applications)
  if (selectedCSV.value === 'recruiter') exportRecruiterCSV(props.applications)
  if (selectedCSV.value === 'followup')  exportFollowUpCSV(props.applications)
  success('CSV downloaded')
}

function runPDF() {
  exportPDF(props.applications, selectedPDF.value)
  success('PDF preview opened — use browser print to save')
}

function runJSON() {
  exportJSON(props.applications)
  success('JSON backup downloaded')
}

const csvTemplates = [
  { id: 'full',      label: 'Full Export',      desc: 'Every field for every application' },
  { id: 'recruiter', label: 'Recruiter Summary', desc: 'Company, title, status, date applied, and salary' },
  { id: 'followup',  label: 'Follow-up Sheet',   desc: 'Applications needing follow-up with contact details' }
]

const pdfTemplates = [
  { id: 'classic',   label: 'Classic',           desc: 'Clean black and white table layout' },
  { id: 'modern',    label: 'Modern',             desc: 'Blue-accented with status badges' },
  { id: 'executive', label: 'Executive Summary',  desc: 'One-page overview with key stats' }
]
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')"></div>
      <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-lg animate-slide-up">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Export Applications</h2>
          <button class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors" @click="$emit('close')">
            <!-- Heroicon: x-mark -->
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-100 dark:border-gray-800">
          <button v-for="tab in ['csv', 'pdf', 'json']" :key="tab"
            class="flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition-colors"
            :class="activeTab === tab
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            @click="activeTab = tab">{{ tab }}</button>
        </div>

        <div class="p-5">

          <!-- CSV -->
          <div v-if="activeTab === 'csv'" class="space-y-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">Choose a template and download a <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.csv</code> file.</p>
            <div class="space-y-2">
              <label v-for="t in csvTemplates" :key="t.id"
                class="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors"
                :class="selectedCSV === t.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'">
                <input type="radio" v-model="selectedCSV" :value="t.id" class="mt-0.5 accent-blue-600 shrink-0" />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ t.label }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ t.desc }}</p>
                </div>
              </label>
            </div>
            <button class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors" @click="runCSV">
              Download CSV
            </button>
          </div>

          <!-- PDF -->
          <div v-else-if="activeTab === 'pdf'" class="space-y-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">A preview will open in a new tab. Use your browser's <strong class="text-gray-700 dark:text-gray-300">Print → Save as PDF</strong> to download.</p>
            <div class="space-y-2">
              <label v-for="t in pdfTemplates" :key="t.id"
                class="flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors"
                :class="selectedPDF === t.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'">
                <input type="radio" v-model="selectedPDF" :value="t.id" class="mt-0.5 accent-blue-600 shrink-0" />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ t.label }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ t.desc }}</p>
                </div>
              </label>
            </div>
            <button class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors" @click="runPDF">
              Generate PDF Preview
            </button>
          </div>

          <!-- JSON -->
          <div v-else class="space-y-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Download a complete JSON backup of all
              <strong class="text-gray-900 dark:text-white">{{ applications.length }} application{{ applications.length !== 1 ? 's' : '' }}</strong>.
              Use this to migrate or keep a personal archive.
            </p>
            <button class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors" @click="runJSON">
              Download JSON Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
