// ─── Shared download helper ───────────────────────────────────────────────────
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href     = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

// ─── CSV ──────────────────────────────────────────────────────────────────────
function toCSV(rows, fields, headers) {
  const head = headers.map(h => `"${h}"`).join(',')
  const body = rows.map(row =>
    fields.map(f => {
      const val = row[f] ?? ''
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(',')
  )
  return '﻿' + [head, ...body].join('\r\n')   // BOM for Excel UTF-8
}

export function exportFullCSV(apps) {
  const fields  = ['company_name','job_title','job_url','date_applied','status','priority',
    'salary_min','salary_max','work_setup','employment_type',
    'contact_name','contact_email','interview_date','interview_notes',
    'followup_date','rating','confidence_score','notes','is_favourite']
  const headers = ['Company','Job Title','Job URL','Date Applied','Status','Priority',
    'Salary Min','Salary Max','Work Setup','Employment Type',
    'Contact Name','Contact Email','Interview Date','Interview Notes',
    'Follow-up Date','Rating (1-5)','Confidence (1-5)','Notes','Favourite']
  downloadBlob(new Blob([toCSV(apps, fields, headers)], { type: 'text/csv;charset=utf-8' }), 'tracera-full-export.csv')
}

export function exportRecruiterCSV(apps) {
  const fields  = ['company_name','job_title','status','date_applied','salary_min','salary_max','work_setup','employment_type']
  const headers = ['Company','Job Title','Status','Date Applied','Salary Min ($)','Salary Max ($)','Work Setup','Employment Type']
  downloadBlob(new Blob([toCSV(apps, fields, headers)], { type: 'text/csv;charset=utf-8' }), 'tracera-recruiter-summary.csv')
}

export function exportFollowUpCSV(apps) {
  const due = apps.filter(a => ['Applied','Interview'].includes(a.status) && a.followup_date)
  const fields  = ['company_name','job_title','status','contact_name','contact_email','followup_date','notes']
  const headers = ['Company','Job Title','Status','Contact Name','Contact Email','Follow-up Date','Notes']
  downloadBlob(new Blob([toCSV(due, fields, headers)], { type: 'text/csv;charset=utf-8' }), 'tracera-followup-sheet.csv')
}

export function exportJSON(apps) {
  const json = JSON.stringify(apps, null, 2)
  downloadBlob(new Blob([json], { type: 'application/json' }), 'tracera-backup.json')
}

// ─── PDF via browser print API ────────────────────────────────────────────────
function openAndPrint(html) {
  const w = window.open('', '_blank', 'width=960,height=720')
  if (!w) {
    alert('Popup blocked — please allow popups for this site to export PDF, then try again.')
    return
  }
  w.document.write(html)
  w.document.close()
  // Fire print after DOM is painted
  setTimeout(() => { try { w.focus(); w.print() } catch {} }, 800)
}

function fmtDate(d)   { return d ? new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '–' }
function fmtMoney(n)  { return n ? '$' + Number(n).toLocaleString() : '' }
function fmtSalary(min, max) {
  if (min && max) return `${fmtMoney(min)} – ${fmtMoney(max)}`
  if (min)        return `from ${fmtMoney(min)}`
  if (max)        return `up to ${fmtMoney(max)}`
  return '–'
}

const STATUS_HEX = {
  Applied:   '#2563EB', Interview: '#7C3AED', Offer: '#059669',
  Rejected:  '#DC2626', Ghosted:   '#6B7280', Withdrawn: '#D97706'
}

function badge(status) {
  const c = STATUS_HEX[status] ?? '#6B7280'
  return `<span style="display:inline-block;padding:2px 10px;border-radius:99px;font-size:10.5px;font-weight:600;letter-spacing:.3px;background:${c}1A;color:${c};border:1px solid ${c}40">${status}</span>`
}

// ── Classic PDF ───────────────────────────────────────────────────────────────
function classicPDF(apps, date) {
  const rows = apps.map((a, i) => `
    <tr class="${i % 2 === 0 ? 'even' : ''}">
      <td>${a.company_name ?? ''}</td>
      <td>${a.job_title ?? ''}</td>
      <td>${fmtDate(a.date_applied)}</td>
      <td>${a.status ?? ''}</td>
      <td>${a.priority ?? ''}</td>
      <td>${fmtSalary(a.salary_min, a.salary_max)}</td>
      <td class="notes">${a.notes ?? ''}</td>
    </tr>`).join('')

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
  <title>Tracera — Job Applications</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #111827; background: #fff; padding: 48px 52px; }
    header { border-bottom: 2px solid #111827; padding-bottom: 14px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
    header h1 { font-size: 22px; font-weight: 700; letter-spacing: -.5px; }
    header .meta { text-align: right; color: #6B7280; font-size: 10.5px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #F9FAFB; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: .6px; color: #6B7280; text-align: left; padding: 8px 10px; border-bottom: 1px solid #E5E7EB; }
    tbody td { padding: 7px 10px; border-bottom: 1px solid #F3F4F6; vertical-align: top; color: #374151; }
    tbody tr.even td { background: #F9FAFB; }
    .notes { color: #6B7280; font-size: 10px; max-width: 180px; }
    @media print { body { padding: 20px 24px; } @page { margin: 12mm; } }
  </style></head><body>
  <header>
    <div><h1>Tracera</h1><p style="color:#6B7280;font-size:10.5px;margin-top:4px">Job Application Log</p></div>
    <div class="meta"><p>Exported: ${date}</p><p>${apps.length} application${apps.length !== 1 ? 's' : ''}</p></div>
  </header>
  <table>
    <thead><tr><th>Company</th><th>Job Title</th><th>Applied</th><th>Status</th><th>Priority</th><th>Salary Range</th><th>Notes</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="7" style="text-align:center;color:#9CA3AF;padding:28px">No applications found</td></tr>'}</tbody>
  </table>
  </body></html>`
}

// ── Modern PDF ────────────────────────────────────────────────────────────────
function modernPDF(apps, date) {
  const counts = {}
  apps.forEach(a => { counts[a.status] = (counts[a.status] ?? 0) + 1 })
  const summary = Object.entries(counts).map(([s, n]) => `${badge(s)} <span style="font-size:10px;color:#6B7280">×${n}</span>`).join(' &nbsp; ')

  const rows = apps.map(a => `
    <tr>
      <td><strong style="color:#111827">${a.company_name ?? ''}</strong></td>
      <td style="color:#374151">${a.job_title ?? ''}</td>
      <td style="color:#6B7280">${fmtDate(a.date_applied)}</td>
      <td>${badge(a.status)}</td>
      <td style="color:#374151">${a.work_setup ?? '–'}</td>
      <td style="color:#374151">${fmtSalary(a.salary_min, a.salary_max)}</td>
    </tr>`).join('')

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
  <title>Tracera — Applications</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; font-size: 11px; background: #fff; color: #111827; }
    .header { background: linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%); color: #fff; padding: 32px 44px; }
    .header h1 { font-size: 28px; font-weight: 800; letter-spacing: -.8px; margin-bottom: 3px; }
    .header p  { opacity: .75; font-size: 12px; }
    .stats { padding: 14px 44px; background: #EFF6FF; border-bottom: 1px solid #BFDBFE; font-size: 11px; color: #1E40AF; }
    .body  { padding: 24px 44px; }
    table  { width: 100%; border-collapse: collapse; }
    thead th { text-align: left; padding: 9px 10px; border-bottom: 2px solid #2563EB; color: #2563EB; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .7px; }
    tbody td  { padding: 9px 10px; border-bottom: 1px solid #F3F4F6; vertical-align: middle; }
    tbody tr:hover td { background: #F8FAFF; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } @page { margin: 8mm; } }
  </style></head><body>
  <div class="header"><h1>Tracera</h1><p>Job Application Tracker &nbsp;·&nbsp; Exported ${date}</p></div>
  <div class="stats">${apps.length} total application${apps.length !== 1 ? 's' : ''} &nbsp;&nbsp; ${summary || ''}</div>
  <div class="body">
    <table>
      <thead><tr><th>Company</th><th>Job Title</th><th>Date Applied</th><th>Status</th><th>Work Setup</th><th>Salary Range</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="6" style="text-align:center;color:#9CA3AF;padding:28px">No applications found</td></tr>'}</tbody>
    </table>
  </div></body></html>`
}

// ── Executive Summary PDF ─────────────────────────────────────────────────────
function executivePDF(apps, date) {
  const total      = apps.length
  const offers     = apps.filter(a => a.status === 'Offer').length
  const interviews = apps.filter(a => a.status === 'Interview').length
  const rejected   = apps.filter(a => a.status === 'Rejected').length
  const pending    = apps.filter(a => a.status === 'Applied').length
  const rate       = total ? Math.round((offers / total) * 100) : 0
  const iRate      = total ? Math.round(((interviews + offers) / total) * 100) : 0

  const highlights = apps.filter(a => ['Interview', 'Offer'].includes(a.status)).slice(0, 10)
  const rows = highlights.map(a => `
    <tr>
      <td><strong style="color:#111827">${a.company_name ?? ''}</strong></td>
      <td style="color:#374151">${a.job_title ?? ''}</td>
      <td>${badge(a.status)}</td>
      <td style="color:#6B7280">${fmtDate(a.date_applied)}</td>
      <td style="color:#374151">${fmtSalary(a.salary_min, a.salary_max)}</td>
    </tr>`).join('')

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
  <title>Tracera — Executive Summary</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #111827; background: #fff; padding: 48px 52px; }
    h1  { font-size: 24px; font-weight: 800; color: #1D4ED8; letter-spacing: -.5px; margin-bottom: 4px; }
    .sub { color: #6B7280; font-size: 11px; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 36px; }
    .card { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 16px 12px; text-align: center; }
    .card .n { font-size: 28px; font-weight: 800; color: #2563EB; line-height: 1; }
    .card .l { font-size: 9.5px; color: #6B7280; text-transform: uppercase; letter-spacing: .6px; margin-top: 6px; }
    h2 { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: #2563EB; margin: 0 0 12px; }
    table { width: 100%; border-collapse: collapse; }
    thead th { text-align: left; padding: 8px 10px; border-bottom: 2px solid #E5E7EB; color: #6B7280; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; }
    tbody td  { padding: 8px 10px; border-bottom: 1px solid #F3F4F6; vertical-align: middle; }
    @media print { body { padding: 20px 24px; } .grid { -webkit-print-color-adjust: exact; print-color-adjust: exact; } @page { margin: 10mm; } }
  </style></head><body>
  <h1>Tracera</h1>
  <p class="sub">Executive Summary &nbsp;·&nbsp; Exported ${date}</p>
  <div class="grid">
    <div class="card"><div class="n">${total}</div><div class="l">Total Applied</div></div>
    <div class="card"><div class="n">${pending}</div><div class="l">Pending</div></div>
    <div class="card"><div class="n">${interviews + offers}</div><div class="l">Interviews (${iRate}%)</div></div>
    <div class="card"><div class="n">${offers}</div><div class="l">Offers (${rate}%)</div></div>
    <div class="card"><div class="n">${rejected}</div><div class="l">Rejected</div></div>
  </div>
  <h2>Active — Interview &amp; Offer Stage</h2>
  <table>
    <thead><tr><th>Company</th><th>Job Title</th><th>Status</th><th>Date Applied</th><th>Salary Range</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:#9CA3AF;padding:24px">No interview-stage applications yet</td></tr>'}</tbody>
  </table>
  </body></html>`
}

export function exportPDF(apps, template) {
  const date = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
  if (template === 'classic')   return openAndPrint(classicPDF(apps, date))
  if (template === 'modern')    return openAndPrint(modernPDF(apps, date))
  if (template === 'executive') return openAndPrint(executivePDF(apps, date))
}
