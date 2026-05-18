<script setup>
import { computed, onMounted } from 'vue'
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

const store = useApplicationsStore()
const goals = useGoalsStore()

onMounted(async () => {
  await store.fetchApplications()
  try { await goals.fetchGoal() } catch {}
})

const apps  = computed(() => store.applications)
const stats = computed(() => {
  const total      = apps.value.length
  const pending    = apps.value.filter(a => ['Applied', 'Interview'].includes(a.status)).length
  const interviews = apps.value.filter(a => a.status === 'Interview').length
  const offers     = apps.value.filter(a => a.status === 'Offer').length
  const rejected   = apps.value.filter(a => a.status === 'Rejected').length
  const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0
  return { total, pending, interviews, offers, rejectionRate }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
    <AppHeader />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

      <!-- Page heading (no duplicate button — AppHeader already has New) -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your job search at a glance</p>
      </div>

      <!-- Loading skeleton -->
      <LoadingSkeleton v-if="store.loading" type="card" :rows="5" />

      <template v-else>
        <!-- ── Stat cards ──────────────────────────────────────────────── -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total Applied"   :value="stats.total"                icon="clipboard"   color="blue"   />
          <StatCard label="In Progress"     :value="stats.pending"              icon="clock"       color="amber"  />
          <StatCard label="Interviews"      :value="stats.interviews"           icon="microphone"  color="purple" />
          <StatCard label="Offers"          :value="stats.offers"               icon="trophy"      color="green"  />
          <StatCard label="Rejection Rate"  :value="stats.rejectionRate + '%'"  icon="x-circle"    color="red"    />
        </div>

        <!-- ── Charts row ─────────────────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2">
            <WeeklyChart :applications="apps" />
          </div>
          <StreakCounter :applications="apps" />
        </div>

        <!-- ── Progress row ───────────────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2">
            <FollowUpSection :applications="apps" />
          </div>
          <WeeklyGoalBar :applications="apps" />
        </div>

        <!-- ── Smart Tips ──────────────────────────────────────────────── -->
        <TipsPanel :applications="apps" />
      </template>
    </main>

    <MobileNav />
  </div>
</template>
