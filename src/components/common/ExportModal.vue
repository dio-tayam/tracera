<script setup>
import { ref } from 'vue'
import {
  exportFullCSV, exportRecruiterCSV, exportFollowUpCSV,
  exportJSON, exportPDF
} from '@/utils/exportUtils'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  applications: { type: Array, required: true }
})
defineEmits(['close'])

const { success } = useToast()
const activeTab = ref('csv')
const selectedCSV = ref('full')
const selectedPDF = ref('modern')

function runCSV() {
  if (selectedCSV.value === 'full')      exportFullCSV(props.applications)
  if (selectedCSV.value === 'recruiter') exportRecruiterCSV(props.applications)
  if (selectedCSV.value === 'followup')  exportFollowUpCSV(props.applications)
  success('CSV exported successfully')
}

function runPDF() {
  exportPDF(props.applications, selectedPDF.value)
  success('PDF opened for printing')
}

function runJSON() {
  exportJSON(props.applications)
  success('JSON backup exported')
}

const csvTemplates = [
  { id: 'full',      label: 'Full Export',       desc: 'Every field for every application' },
  { id: 'recruiter', label: 'Recruiter Summary',  desc: 'Company, title, status, date, salary' },
  { id: 'followup',  label: 'Follow-up Sheet',    desc: 'Applications needing follow-up with contact info' }
]

const pdfTemplates = [
  { id: 'classic',   label: 'Classic',           desc: 'Clean black & white table layout' },
  { id: 'modern',    label: 'Modern',             desc: 'Blue-accented layout with status badges' },
  { id: 'executive', label: 'Executive Summary',  desc: 'One-page overview with key stats' }
]
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up">

        <!-- Header -->
        <div class="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Export Applications</h2>
          <button class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500" @click="$emit('close')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-100 dark:border-gray-700">
          <button
            v-for="tab in ['csv','pdf','json']"
            :key="tab"
            class="flex-1 py-3 text-sm font-medium uppercase tracking-wide transition-colors"
            :class="activeTab === tab
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            @click="activeTab = tab"
          >{{ tab }}</button>
        </div>

        <div class="p-5">
          <!-- CSV -->
          <div v-if="activeTab === 'csv'" class="space-y-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">Choose a template, then download as .csv</p>
            <div class="space-y-2">
              <label
                v-for="t in csvTemplates" :key="t.id"
                class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                :class="selectedCSV === t.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
              >
                <input type="radio" v-model="selectedCSV" :value="t.id" class="mt-0.5 accent-blue-600" />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ t.label }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ t.desc }}</p>
                </div>
              </label>
            </div>
            <button
              class="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
              @click="runCSV"
            >
              Download CSV
            </button>
          </div>

          <!-- PDF -->
          <div v-else-if="activeTab === 'pdf'" class="space-y-3">
            <p class="text-sm text-gray-500 dark:text-gray-400">Choose a template, then open the browser print dialog to save as PDF</p>
            <div class="space-y-2">
              <label
                v-for="t in pdfTemplates" :key="t.id"
                class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                :class="selectedPDF === t.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
              >
                <input type="radio" v-model="selectedPDF" :value="t.id" class="mt-0.5 accent-blue-600" />
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ t.label }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ t.desc }}</p>
                </div>
              </label>
            </div>
            <button
              class="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
              @click="runPDF"
            >
              Generate PDF
            </button>
          </div>

          <!-- JSON -->
          <div v-else class="space-y-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Download a complete JSON backup of all <strong class="text-gray-700 dark:text-gray-300">{{ applications.length }} applications</strong>.
              Use this to migrate to another tool or keep a personal archive.
            </p>
            <button
              class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
              @click="runJSON"
            >
              Download JSON Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
