export const STATUSES        = ['Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted', 'Withdrawn']
export const PRIORITIES      = ['Low', 'Medium', 'High']
export const WORK_SETUPS     = ['Remote', 'Hybrid', 'On-site']
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

// ─── Timezone-safe local date string ─────────────────────────────────────────
// Always uses the local calendar date, never UTC — avoids off-by-one day bugs
export function localDateStr(d = new Date()) {
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, '0')
  const dy = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dy}`
}

// Extract YYYY-MM-DD from a Supabase date string (already in YYYY-MM-DD form)
export function appDateStr(dateField) {
  if (!dateField) return null
  return String(dateField).slice(0, 10)
}

// ─── Date formatting ──────────────────────────────────────────────────────────
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = String(dateStr).slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = String(dateStr).slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function toInputDate(dateStr) {
  if (!dateStr) return ''
  return String(dateStr).slice(0, 10)
}

export function todayISO() {
  return localDateStr()
}

export function isOverdue(dateStr) {
  if (!dateStr) return false
  return appDateStr(dateStr) < localDateStr()
}

export function isDueToday(dateStr) {
  if (!dateStr) return false
  return appDateStr(dateStr) === localDateStr()
}

export function daysDiff(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = String(dateStr).slice(0, 10).split('-').map(Number)
  const then = new Date(y, m - 1, d)
  const now  = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.floor((now - then) / 86400000)
}

export function formatSalary(min, max) {
  if (!min && !max) return '—'
  const fmt = n => '$' + Number(n).toLocaleString()
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  return min ? `from ${fmt(min)}` : `up to ${fmt(max)}`
}

// ─── Last 7 calendar days as local date strings ───────────────────────────────
export function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return { str: localDateStr(d), label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
  })
}

// ─── Monday of the current week as local date string ─────────────────────────
export function getWeekStart() {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff)
  return localDateStr(monday)
}

// ─── Consecutive-day streak from a list of applications ──────────────────────
export function getCurrentStreak(applications) {
  // Collect unique applied dates as local YYYY-MM-DD strings, newest first
  const dates = [...new Set(
    applications.filter(a => a.date_applied).map(a => appDateStr(a.date_applied))
  )].sort().reverse()

  if (!dates.length) return 0

  let streak = 0
  let cursor = localDateStr() // today as local date string

  for (const dateStr of dates) {
    // Parse both as local dates to avoid UTC shift
    const [cy, cm, cd] = cursor.split('-').map(Number)
    const [dy, dm, dd] = dateStr.split('-').map(Number)
    const cursorMs = new Date(cy, cm - 1, cd).getTime()
    const dateMs   = new Date(dy, dm - 1, dd).getTime()
    const diffDays = Math.round((cursorMs - dateMs) / 86400000)

    if (diffDays === 0 || diffDays === 1) {
      streak++
      cursor = dateStr
    } else {
      break
    }
  }

  return streak
}
