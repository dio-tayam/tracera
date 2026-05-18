<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { getLast7Days } from '@/utils/helpers'
import { useUiStore } from '@/stores/ui'

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  applications: { type: Array, required: true }
})

const ui = useUiStore()

const chartData = computed(() => {
  const days = getLast7Days()

  const counts = days.map(({ str }) =>
    props.applications.filter(a => {
      if (!a.date_applied) return false
      return String(a.date_applied).slice(0, 10) === str
    }).length
  )

  return {
    labels: days.map(d => d.label),
    datasets: [{
      label: 'Applications',
      data: counts,
      backgroundColor: counts.map((_, i) => i === 6 ? 'rgba(37,99,235,0.9)' : 'rgba(37,99,235,0.55)'),
      hoverBackgroundColor: 'rgba(37,99,235,1)',
      borderRadius: 8,
      borderSkipped: false,
      borderWidth: 0
    }]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: ui.darkMode ? '#1e293b' : '#fff',
      titleColor:      ui.darkMode ? '#e2e8f0' : '#1e293b',
      bodyColor:       ui.darkMode ? '#94a3b8' : '#64748b',
      borderColor:     ui.darkMode ? '#334155' : '#e2e8f0',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 10,
      callbacks: {
        label: ctx => ` ${ctx.parsed.y} application${ctx.parsed.y !== 1 ? 's' : ''}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: ui.darkMode ? '#475569' : '#94a3b8', font: { size: 11 } }
    },
    y: {
      grid: { color: ui.darkMode ? '#1e293b' : '#f1f5f9', lineWidth: 1 },
      ticks: { color: ui.darkMode ? '#475569' : '#94a3b8', font: { size: 11 }, stepSize: 1, precision: 0 },
      beginAtZero: true
    }
  }
}))
</script>

<template>
  <div class="card p-5">
    <div class="flex items-center gap-2 mb-4">
      <!-- Heroicon: calendar-days -->
      <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"/>
      </svg>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Activity This Week</h3>
    </div>
    <div class="h-44">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
