<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useGoalsStore } from '@/stores/goals'
import { useApplicationsStore } from '@/stores/applications'
import { useToast } from '@/composables/useToast'
import { exportJSON, exportFullCSV } from '@/utils/exportUtils'

const auth  = useAuthStore()
const ui    = useUiStore()
const goals = useGoalsStore()
const store = useApplicationsStore()
const { success, error } = useToast()
const router = useRouter()

const goalInput     = ref(goals.weeklyGoal)
const showSignOut   = ref(false)
const savingGoal    = ref(false)

watch(() => goals.weeklyGoal, v => { goalInput.value = v })

async function saveGoal() {
  if (!goalInput.value || goalInput.value < 1) return
  savingGoal.value = true
  try {
    await goals.saveGoal(Number(goalInput.value))
    success('Weekly goal updated')
  } catch {
    error('Failed to save goal')
  } finally {
    savingGoal.value = false
  }
}

function exportAllJSON() {
  exportJSON(store.applications)
  success('JSON backup downloaded')
}

function exportAllCSV() {
  exportFullCSV(store.applications)
  success('CSV exported')
}

async function confirmSignOut() {
  showSignOut.value = false
  await auth.logout()
  success('Signed out')
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-0">
    <AppHeader />

    <main class="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">

      <!-- Page title -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account, preferences, and data</p>
      </div>

      <!-- ── Profile ─────────────────────────────────────────────────────── -->
      <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Profile</h2>
        </div>
        <div class="px-6 py-5 flex items-center gap-4">
          <img v-if="auth.avatarUrl" :src="auth.avatarUrl" :alt="auth.displayName"
            class="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-200 dark:ring-gray-700 shrink-0" />
          <div v-else
            class="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
            {{ auth.displayName.charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <p class="font-semibold text-gray-900 dark:text-white truncate">{{ auth.displayName }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ auth.user?.email }}</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Signed in via Google</p>
          </div>
        </div>
      </section>

      <!-- ── Preferences ─────────────────────────────────────────────────── -->
      <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Preferences</h2>
        </div>

        <!-- Dark mode row -->
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Switch between light and dark interface</p>
          </div>
          <button
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            :class="ui.darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
            @click="ui.toggleDarkMode"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
              :class="ui.darkMode ? 'translate-x-6' : 'translate-x-1'"
            ></span>
          </button>
        </div>
      </section>

      <!-- ── Weekly Goal ─────────────────────────────────────────────────── -->
      <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Weekly Goal</h2>
        </div>
        <div class="px-6 py-5">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Set how many applications you aim to submit each week. Your progress is tracked on the Dashboard.
          </p>
          <div class="flex gap-3 max-w-xs">
            <input
              v-model.number="goalInput"
              type="number" min="1" max="100"
              class="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="e.g. 5"
              @keyup.enter="saveGoal"
            />
            <button
              :disabled="savingGoal"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
              @click="saveGoal"
            >
              {{ savingGoal ? 'Saving…' : 'Save' }}
            </button>
          </div>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">Current goal: <strong class="text-gray-700 dark:text-gray-300">{{ goals.weeklyGoal }} applications / week</strong></p>
        </div>
      </section>

      <!-- ── Data Export ─────────────────────────────────────────────────── -->
      <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Export Your Data</h2>
        </div>
        <div class="divide-y divide-gray-100 dark:divide-gray-800">

          <div class="px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">JSON Backup</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Complete raw export of all {{ store.applications.length }} applications</p>
            </div>
            <button
              class="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              @click="exportAllJSON"
            >
              <!-- Heroicon: arrow-down-tray -->
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              Download JSON
            </button>
          </div>

          <div class="px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Full CSV Export</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">All fields for every application as a spreadsheet</p>
            </div>
            <button
              class="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              @click="exportAllCSV"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              Download CSV
            </button>
          </div>
        </div>
      </section>

      <!-- ── About ───────────────────────────────────────────────────────── -->
      <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">About</h2>
        </div>
        <div class="px-6 py-4 space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">App</span>
            <span class="font-semibold text-gray-900 dark:text-white">Tracera</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Version</span>
            <span class="text-gray-700 dark:text-gray-300">1.0.0</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Plan</span>
            <span class="text-green-600 dark:text-green-400 font-medium">Free — All features included</span>
          </div>
        </div>
      </section>

      <!-- ── Account ─────────────────────────────────────────────────────── -->
      <section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Account</h2>
        </div>
        <div class="px-6 py-4">
          <button
            class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            @click="showSignOut = true"
          >
            <!-- Heroicon: arrow-right-on-rectangle -->
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
            </svg>
            Sign Out
          </button>
        </div>
      </section>

    </main>

    <ConfirmModal
      v-if="showSignOut"
      title="Sign out?"
      message="You will be redirected to the login page."
      confirm-text="Sign Out"
      :danger="false"
      @confirm="confirmSignOut"
      @cancel="showSignOut = false"
    />

    <MobileNav />
  </div>
</template>
