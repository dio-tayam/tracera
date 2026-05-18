<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale
} from 'chart.js'
import { getLast7Days, formatDateShort } from '@/utils/helpers'
import { useUiStore } from '@/stores/ui'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  applications: { type: Array, required: true }
})

const ui = useUiStore()

const chartData = computed(() => {
  const days = getLast7Days()
  const counts = days.map(day => {
    const dayStr = day.toDateString()
    return props.applications.filter(a => {
      if (!a.date_applied) return false
      return new Date(a.date_applied).toDateString() === dayStr
    }).length
  })

  return {
    labels: days.map(d => formatDateShort(d)),
    datasets: [{
      label: 'Applications',
      data: counts,
      backgroundColor: 'rgba(37, 99, 235, 0.8)',
      hoverBackgroundColor: 'rgba(37, 99, 235, 1)',
      borderRadius: 8,
      borderSkipped: false
    }]
  }
})

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: ui.darkMode ? '#1e293b' : '#fff',
      titleColor: ui.darkMode ? '#e2e8f0' : '#1e293b',
      bodyColor: ui.darkMode ? '#94a3b8' : '#64748b',
      borderColor: ui.darkMode ? '#334155' : '#e2e8f0',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 10
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: ui.darkMode ? '#64748b' : '#94a3b8', font: { size: 12 } }
    },
    y: {
      grid: { color: ui.darkMode ? '#1e293b' : '#f1f5f9' },
      ticks: {
        color: ui.darkMode ? '#64748b' : '#94a3b8',
        font: { size: 12 },
        stepSize: 1,
        precision: 0
      },
      beginAtZero: true
    }
  }
}))
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Activity This Week</h3>
    <div class="h-44">
      <Bar :data="chartData" :options="options" />
    </div>
  </div>
</template>
