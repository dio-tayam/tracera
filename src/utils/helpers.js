export const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn']
export const PRIORITIES = ['Low', 'Medium', 'High']
export const WORK_SETUPS = ['Remote', 'Hybrid', 'On-site']
export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance']
export const MOODS = ['😊', '😐', '😟', '🤔', '😤', '🥳', '😔', '💪', '🎯', '😅']

export const STATUS_CONFIG = {
  Applied:   { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500',   darkBg: 'dark:bg-blue-900/40',   darkText: 'dark:text-blue-300'   },
  Interview: { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500', darkBg: 'dark:bg-purple-900/40', darkText: 'dark:text-purple-300' },
  Offer:     { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500',  darkBg: 'dark:bg-green-900/40',  darkText: 'dark:text-green-300'  },
  Rejected:  { bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500',    darkBg: 'dark:bg-red-900/40',    darkText: 'dark:text-red-300'    },
  Ghosted:   { bg: 'bg-gray-100',   text: 'text-gray-700',   dot: 'bg-gray-400',   darkBg: 'dark:bg-gray-700/60',   darkText: 'dark:text-gray-300'   },
  Withdrawn: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500', darkBg: 'dark:bg-orange-900/40', darkText: 'dark:text-orange-300' }
}

export const PRIORITY_CONFIG = {
  Low:    { bg: 'bg-green-100',  text: 'text-green-800',  darkBg: 'dark:bg-green-900/40',  darkText: 'dark:text-green-300'  },
  Medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900/40', darkText: 'dark:text-yellow-300' },
  High:   { bg: 'bg-red-100',    text: 'text-red-800',    darkBg: 'dark:bg-red-900/40',    darkText: 'dark:text-red-300'    }
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export function toInputDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toISOString().split('T')[0]
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function isOverdue(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date(new Date().toDateString())
}

export function isDueToday(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr).toDateString() === new Date().toDateString()
}

export function daysDiff(dateStr) {
  if (!dateStr) return null
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

export function getWeekStart() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return d
}

export function getCurrentStreak(applications) {
  const appliedDates = [...new Set(
    applications
      .filter(a => a.date_applied)
      .map(a => new Date(a.date_applied).toDateString())
  )].sort((a, b) => new Date(b) - new Date(a))

  if (!appliedDates.length) return 0

  let streak = 0
  let cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  for (const dateStr of appliedDates) {
    const d = new Date(dateStr)
    const diff = Math.round((cursor - d) / 86400000)
    if (diff === 0 || diff === 1) {
      streak++
      cursor = d
    } else {
      break
    }
  }

  return streak
}

export function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })
}

export function formatSalary(min, max) {
  if (!min && !max) return '—'
  const fmt = n => '$' + Number(n).toLocaleString()
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  return min ? `From ${fmt(min)}` : `Up to ${fmt(max)}`
}
