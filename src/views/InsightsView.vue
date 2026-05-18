<script setup>
import { computed, onMounted } from 'vue'
import { Doughnut, Bar, Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend, Title,
  BarElement, CategoryScale, LinearScale, RadialLinearScale,
  PointElement, LineElement
} from 'chart.js'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import TipsPanel from '@/components/dashboard/TipsPanel.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { useApplicationsStore } from '@/stores/applications'
import { useUiStore } from '@/stores/ui'
import { daysDiff } from '@/utils/helpers'

ChartJS.register(
  ArcElement, Tooltip, Legend, Title,
  BarElement, CategoryScale, LinearScale, RadialLinearScale,
  PointElement, LineElement
)

const store = useApplicationsStore()
const ui = useUiStore()

onMounted(async () => {
  if (!store.applications.length) await store.fetchApplications()
})

const apps = computed(() => store.applications)

const gridColor = computed(() => ui.darkMode ? '#1e293b' : '#f1f5f9')
const tickColor = computed(() => ui.darkMode ? '#64748b' : '#94a3b8')
const tooltipBg = computed(() => ui.darkMode ? '#1e293b' : '#fff')
const tooltipBorder = computed(() => ui.darkMode ? '#334155' : '#e2e8f0')
const tooltipTitle = computed(() => ui.darkMode ? '#e2e8f0' : '#1e293b')
const tooltipBody = computed(() => ui.darkMode ? '#94a3b8' : '#64748b')

const baseTooltip = computed(() => ({
  backgroundColor: tooltipBg.value,
  titleColor: tooltipTitle.value,
  bodyColor: tooltipBody.value,
  borderColor: tooltipBorder.value,
  borderWidth: 1,
  padding: 10,
  cornerRadius: 10
}))

// ── Status distribution doughnut ────────────────────────────────────────────
const statusChart = computed(() => {
  const counts = {}
  apps.value.forEach(a => { counts[a.status] = (counts[a.status] ?? 0) + 1 })
  const labels = Object.keys(counts)
  const colors = {
    Applied: '#2563eb', Interview: '#7c3aed', Offer: '#059669',
    Rejected: '#dc2626', Ghosted: '#9ca3af', Withdrawn: '#f59e0b'
  }
  return {
    data: {
      labels,
      datasets: [{
        data: labels.map(l => counts[l]),
        backgroundColor: labels.map(l => colors[l] ?? '#6b7280'),
        borderWidth: 2,
        borderColor: ui.darkMode ? '#1f2937' : '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { color: tickColor.value, padding: 12, font: { size: 12 } } },
        tooltip: { ...baseTooltip.value }
      }
    }
  }
})

// ── Rejection by stage ─────────────────────────────────────────────────────
const rejectionStageChart = computed(() => {
  const stages = ['Applied', 'Interview', 'Offer']
  const rejected = stages.map(s => {
    if (s === 'Applied') return apps.value.filter(a => a.status === 'Rejected' && !a.interview_date).length
    if (s === 'Interview') return apps.value.filter(a => a.status === 'Rejected' && a.interview_date).length
    return 0
  })
  return {
    data: {
      labels: stages,
      datasets: [{
        label: 'Rejections',
        data: rejected,
        backgroundColor: ['rgba(37,99,235,.8)', 'rgba(124,58,237,.8)', 'rgba(5,150,105,.8)'],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...baseTooltip.value } },
      scales: {
        x: { grid: { display: false }, ticks: { color: tickColor.value } },
        y: { grid: { color: gridColor.value }, ticks: { color: tickColor.value, stepSize: 1, precision: 0 }, beginAtZero: true }
      }
    }
  }
})

// ── Top job titles ─────────────────────────────────────────────────────────
const topTitlesChart = computed(() => {
  const counts = {}
  apps.value.forEach(a => {
    const t = a.job_title?.trim()
    if (t) counts[t] = (counts[t] ?? 0) + 1
  })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  return {
    data: {
      labels: sorted.map(([t]) => t),
      datasets: [{
        label: 'Applications',
        data: sorted.map(([, n]) => n),
        backgroundColor: 'rgba(37,99,235,.8)',
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...baseTooltip.value } },
      scales: {
        x: { grid: { color: gridColor.value }, ticks: { color: tickColor.value, stepSize: 1, precision: 0 }, beginAtZero: true },
        y: { grid: { display: false }, ticks: { color: tickColor.value, font: { size: 11 } } }
      }
    }
  }
})

// ── Salary comparison ──────────────────────────────────────────────────────
const salaryChart = computed(() => {
  const withSalary = apps.value.filter(a => a.salary_min || a.salary_max)
  if (!withSalary.length) return null
  const labels = withSalary.slice(0, 10).map(a => a.company_name)
  return {
    data: {
      labels,
      datasets: [
        {
          label: 'Salary Min',
          data: withSalary.slice(0, 10).map(a => a.salary_min ?? 0),
          backgroundColor: 'rgba(37,99,235,.7)',
          borderRadius: 4
        },
        {
          label: 'Salary Max',
          data: withSalary.slice(0, 10).map(a => a.salary_max ?? 0),
          backgroundColor: 'rgba(37,99,235,.2)',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: tickColor.value, font: { size: 11 } } },
        tooltip: { ...baseTooltip.value }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: tickColor.value, font: { size: 10 }, maxRotation: 45 } },
        y: { grid: { color: gridColor.value }, ticks: { color: tickColor.value, callback: v => '$' + (v/1000).toFixed(0) + 'k' }, beginAtZero: true }
      }
    }
  }
})

// ── Confidence vs outcome ──────────────────────────────────────────────────
const confidenceChart = computed(() => {
  const outcomes = ['Offer', 'Interview', 'Applied', 'Ghosted', 'Withdrawn', 'Rejected']
  const avgConf = outcomes.map(status => {
    const group = apps.value.filter(a => a.status === status && a.confidence_score)
    return group.length ? (group.reduce((s, a) => s + a.confidence_score, 0) / group.length).toFixed(1) : null
  })
  return {
    data: {
      labels: outcomes,
      datasets: [{
        label: 'Avg Confidence',
        data: avgConf,
        backgroundColor: 'rgba(37,99,235,.7)',
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { ...baseTooltip.value } },
      scales: {
        x: { grid: { display: false }, ticks: { color: tickColor.value } },
        y: { grid: { color: gridColor.value }, min: 0, max: 5, ticks: { color: tickColor.value, stepSize: 1 } }
      }
    }
  }
})

// ── Computed stats ─────────────────────────────────────────────────────────
const stats = computed(() => {
  const total = apps.value.length
  if (!total) return null
  const offers = apps.value.filter(a => a.status === 'Offer').length
  const interviews = apps.value.filter(a => ['Interview', 'Offer'].includes(a.status)).length
  const rejected = apps.value.filter(a => a.status === 'Rejected').length
  const successRate = Math.round((offers / total) * 100)
  const interviewRate = Math.round((interviews / total) * 100)
  const salaryApps = apps.value.filter(a => a.salary_min)
  const avgSalary = salaryApps.length
    ? Math.round(salaryApps.reduce((s, a) => s + Number(a.salary_min), 0) / salaryApps.length)
    : null
  const responseTimes = apps.value
    .filter(a => ['Rejected', 'Interview', 'Offer'].includes(a.status) && a.date_applied)
    .map(a => daysDiff(a.date_applied))
    .filter(d => d !== null && d >= 0)
  const avgResponse = responseTimes.length
    ? Math.round(responseTimes.reduce((s, d) => s + d, 0) / responseTimes.length)
    : null
  return { total, offers, interviews, rejected, successRate, interviewRate, avgSalary, avgResponse }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 md:pb-0">
    <AppHeader />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your job search performance at a glance</p>
      </div>

      <LoadingSkeleton v-if="store.loading" type="card" :rows="4" />

      <EmptyState
        v-else-if="!apps.length"
        title="No data yet"
        description="Add some applications to see your insights and analytics."
        icon="chart"
      />

      <template v-else>
        <!-- Summary stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Success Rate"        :value="(stats?.successRate ?? 0) + '%'"  icon="🎯" color="green"  />
          <StatCard label="Interview Rate"      :value="(stats?.interviewRate ?? 0) + '%'" icon="🎤" color="purple" />
          <StatCard label="Avg. Response Time"  :value="stats?.avgResponse != null ? stats.avgResponse + 'd' : '—'" icon="⏱" color="blue" />
          <StatCard label="Avg. Min Salary"     :value="stats?.avgSalary ? '$' + stats.avgSalary.toLocaleString() : '—'" icon="💰" color="amber" />
        </div>

        <!-- Charts row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Status distribution -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Application Status Distribution</h3>
            <div class="h-60">
              <Doughnut :data="statusChart.data" :options="statusChart.options" />
            </div>
          </div>

          <!-- Rejection stages -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Rejections by Stage</h3>
            <div class="h-60">
              <Bar :data="rejectionStageChart.data" :options="rejectionStageChart.options" />
            </div>
          </div>
        </div>

        <!-- Charts row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Top job titles -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Top Job Titles Applied To</h3>
            <div class="h-64">
              <Bar :data="topTitlesChart.data" :options="topTitlesChart.options" />
            </div>
          </div>

          <!-- Confidence vs outcome -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">Confidence Score by Outcome</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">Average confidence rating per final status</p>
            <div class="h-60">
              <Bar :data="confidenceChart.data" :options="confidenceChart.options" />
            </div>
          </div>
        </div>

        <!-- Salary chart (conditional) -->
        <div v-if="salaryChart" class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Salary Range Comparison</h3>
          <div class="h-64">
            <Bar :data="salaryChart.data" :options="salaryChart.options" />
          </div>
        </div>

        <!-- Contextual tips -->
        <TipsPanel :applications="apps" />
      </template>
    </main>
    <MobileNav />
  </div>
</template>
