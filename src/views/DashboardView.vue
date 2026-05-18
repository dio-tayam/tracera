<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import WeeklyChart from '@/components/dashboard/WeeklyChart.vue'
import FollowUpSection from '@/components/dashboard/FollowUpSection.vue'
import StreakCounter from '@/components/dashboard/StreakCounter.vue'
import WeeklyGoalBar from '@/components/dashboard/WeeklyGoalBar.vue'
import TipsPanel from '@/components/dashboard/TipsPanel.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useGoalsStore } from '@/stores/goals'
import { getWeekStart } from '@/utils/helpers'

const store = useApplicationsStore()
const goals = useGoalsStore()

onMounted(async () => {
  if (!store.applications.length) await store.fetchApplications()
  await goals.fetchGoal()
})

const apps = computed(() => store.applications)

const stats = computed(() => {
  const total = apps.value.length
  const pending = apps.value.filter(a => ['Applied', 'Interview'].includes(a.status)).length
  const interviews = apps.value.filter(a => a.status === 'Interview').length
  const offers = apps.value.filter(a => a.status === 'Offer').length
  const rejected = apps.value.filter(a => a.status === 'Rejected').length
  const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0
  return { total, pending, interviews, offers, rejectionRate }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 md:pb-0">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <!-- Page header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your job search at a glance</p>
        </div>
        <RouterLink
          :to="{ name: 'add-application' }"
          class="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
          New Application
        </RouterLink>
      </div>

      <!-- Loading state -->
      <LoadingSkeleton v-if="store.loading" type="card" :rows="5" />

      <template v-else>
        <!-- Stat cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Applied"       :value="stats.total"         icon="📋" color="blue"   />
          <StatCard label="In Progress"         :value="stats.pending"       icon="⏳" color="amber"  />
          <StatCard label="Interviews"          :value="stats.interviews"    icon="🎤" color="purple" />
          <StatCard label="Offers"              :value="stats.offers"        icon="🎉" color="green"  />
          <StatCard label="Rejection Rate"      :value="stats.rejectionRate + '%'" icon="📉" color="red" />
        </div>

        <!-- Charts row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2">
            <WeeklyChart :applications="apps" />
          </div>
          <StreakCounter :applications="apps" />
        </div>

        <!-- Middle row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2">
            <FollowUpSection :applications="apps" />
          </div>
          <WeeklyGoalBar :applications="apps" />
        </div>

        <!-- Tips -->
        <TipsPanel :applications="apps" />

        <!-- Quick actions (mobile) -->
        <div class="sm:hidden grid grid-cols-2 gap-3">
          <RouterLink
            :to="{ name: 'applications' }"
            class="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            📋 View All
          </RouterLink>
          <RouterLink
            :to="{ name: 'insights' }"
            class="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            📊 Insights
          </RouterLink>
        </div>

      </template>
    </main>

    <MobileNav />
  </div>
</template>
