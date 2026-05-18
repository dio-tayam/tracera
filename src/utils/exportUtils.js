function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function toCSV(rows, fields, headers) {
  const head = headers.join(',')
  const body = rows.map(row =>
    fields.map(f => `"${String(row[f] ?? '').replace(/"/g, '""')}"`).join(',')
  )
  return [head, ...body].join('\n')
}

export function exportFullCSV(apps) {
  const fields = [
    'company_name', 'job_title', 'job_url', 'date_applied', 'status', 'priority',
    'salary_min', 'salary_max', 'work_setup', 'employment_type',
    'contact_name', 'contact_email', 'interview_date', 'interview_notes',
    'followup_date', 'rating', 'confidence_score', 'notes', 'is_favourite'
  ]
  const headers = [
    'Company', 'Job Title', 'URL', 'Date Applied', 'Status', 'Priority',
    'Salary Min', 'Salary Max', 'Work Setup', 'Employment Type',
    'Contact Name', 'Contact Email', 'Interview Date', 'Interview Notes',
    'Follow-up Date', 'Rating', 'Confidence', 'Notes', 'Favourite'
  ]
  downloadBlob(new Blob([toCSV(apps, fields, headers)], { type: 'text/csv' }), 'tracera-full-export.csv')
}

export function exportRecruiterCSV(apps) {
  const fields = ['company_name', 'job_title', 'status', 'date_applied', 'salary_min', 'salary_max', 'work_setup']
  const headers = ['Company', 'Job Title', 'Status', 'Date Applied', 'Salary Min', 'Salary Max', 'Work Setup']
  downloadBlob(new Blob([toCSV(apps, fields, headers)], { type: 'text/csv' }), 'tracera-recruiter-summary.csv')
}

export function exportFollowUpCSV(apps) {
  const filtered = apps.filter(a => ['Applied', 'Interview'].includes(a.status) && a.followup_date)
  const fields = ['company_name', 'job_title', 'status', 'contact_name', 'contact_email', 'followup_date', 'notes']
  const headers = ['Company', 'Job Title', 'Status', 'Contact Name', 'Contact Email', 'Follow-up Date', 'Notes']
  downloadBlob(new Blob([toCSV(filtered, fields, headers)], { type: 'text/csv' }), 'tracera-followup-sheet.csv')
}

export function exportJSON(apps) {
  const json = JSON.stringify(apps, null, 2)
  downloadBlob(new Blob([json], { type: 'application/json' }), 'tracera-backup.json')
}

// ─── PDF Export via browser print API ────────────────────────────────────────

function statusColor(status) {
  const map = {
    Applied: '#2563eb', Interview: '#7c3aed', Offer: '#059669',
    Rejected: '#dc2626', Ghosted: '#6b7280', Withdrawn: '#d97706'
  }
  return map[status] ?? '#6b7280'
}

function badge(status) {
  const c = statusColor(status)
  return `<span style="background:${c}18;color:${c};border:1px solid ${c}55;padding:2px 9px;border-radius:12px;font-size:11px;font-weight:600">${status}</span>`
}

function fmtDate(d) { return d ? new Date(d).toLocaleDateString() : '' }
function fmtSalary(min, max) {
  const f = n => '$' + Number(n).toLocaleString()
  if (min && max) return `${f(min)} – ${f(max)}`
  if (min) return `From ${f(min)}`
  if (max) return `Up to ${f(max)}`
  return ''
}

function openAndPrint(html) {
  const w = window.open('', '_blank', 'width=900,height=700')
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 600)
}

export function exportPDF(apps, template) {
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  if (template === 'classic')   return openAndPrint(classicPDF(apps, now))
  if (template === 'modern')    return openAndPrint(modernPDF(apps, now))
  if (template === 'executive') return openAndPrint(executivePDF(apps, now))
}

function classicPDF(apps, date) {
  const rows = apps.map(a => `
    <tr>
      <td>${a.company_name ?? ''}</td>
      <td>${a.job_title ?? ''}</td>
      <td>${fmtDate(a.date_applied)}</td>
      <td>${a.status ?? ''}</td>
      <td>${a.priority ?? ''}</td>
      <td>${fmtSalary(a.salary_min, a.salary_max)}</td>
      <td>${a.notes ?? ''}</td>
    </tr>`).join('')

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Tracera – Applications</title>
  <style>
    body{font-family:Georgia,serif;margin:40px;color:#111;font-size:13px}
    h1{font-size:22px;margin-bottom:4px}
    .sub{color:#666;font-size:12px;margin-bottom:24px}
    table{width:100%;border-collapse:collapse}
    th{background:#f4f4f4;text-align:left;padding:8px 10px;border-bottom:2px solid #ccc;font-size:11px}
    td{padding:7px 10px;border-bottom:1px solid #eee;vertical-align:top}
    tr:nth-child(even) td{background:#fafafa}
    @media print{body{margin:16px}}
  </style></head><body>
  <h1>Tracera — Job Application Log</h1>
  <p class="sub">Exported ${date} · ${apps.length} application${apps.length !== 1 ? 's' : ''}</p>
  <table>
    <thead><tr><th>Company</th><th>Job Title</th><th>Applied</th><th>Status</th><th>Priority</th><th>Salary</th><th>Notes</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="7" style="text-align:center;color:#999;padding:20px">No applications yet</td></tr>'}</tbody>
  </table></body></html>`
}

function modernPDF(apps, date) {
  const counts = {}
  apps.forEach(a => { counts[a.status] = (counts[a.status] ?? 0) + 1 })
  const summary = Object.entries(counts).map(([s, n]) => `${badge(s)} ×${n}`).join(' &nbsp; ')

  const rows = apps.map(a => `
    <tr>
      <td><strong>${a.company_name ?? ''}</strong></td>
      <td>${a.job_title ?? ''}</td>
      <td>${fmtDate(a.date_applied)}</td>
      <td>${badge(a.status)}</td>
      <td>${a.work_setup ?? ''}</td>
      <td>${fmtSalary(a.salary_min, a.salary_max)}</td>
    </tr>`).join('')

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Tracera – Applications</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:'Helvetica Neue',Arial,sans-serif;margin:0;color:#1e293b;font-size:12px}
    .hdr{background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;padding:28px 40px}
    .hdr h1{margin:0 0 4px;font-size:26px;letter-spacing:-0.5px}
    .hdr p{margin:0;opacity:.8;font-size:12px}
    .stats{padding:12px 40px;background:#f0f7ff;border-bottom:1px solid #bfdbfe;font-size:11px}
    .body{padding:20px 40px}
    table{width:100%;border-collapse:collapse}
    th{text-align:left;padding:8px 10px;border-bottom:2px solid #2563eb;color:#2563eb;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
    td{padding:8px 10px;border-bottom:1px solid #f1f5f9;vertical-align:middle}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
  <div class="hdr"><h1>Tracera</h1><p>Job Application Tracker · Exported ${date}</p></div>
  <div class="stats">${apps.length} total &nbsp;·&nbsp; ${summary || 'No applications'}</div>
  <div class="body">
    <table>
      <thead><tr><th>Company</th><th>Job Title</th><th>Applied</th><th>Status</th><th>Work Setup</th><th>Salary</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:20px">No applications yet</td></tr>'}</tbody>
    </table>
  </div></body></html>`
}

function executivePDF(apps, date) {
  const total = apps.length
  const offers = apps.filter(a => a.status === 'Offer').length
  const interviews = apps.filter(a => a.status === 'Interview').length
  const rejected = apps.filter(a => a.status === 'Rejected').length
  const rate = total ? Math.round((offers / total) * 100) : 0
  const iRate = total ? Math.round(((interviews + offers) / total) * 100) : 0

  const highlights = apps
    .filter(a => ['Interview', 'Offer'].includes(a.status))
    .slice(0, 10)

  const rows = highlights.map(a => `
    <tr>
      <td><strong>${a.company_name ?? ''}</strong></td>
      <td>${a.job_title ?? ''}</td>
      <td>${badge(a.status)}</td>
      <td>${fmtDate(a.date_applied)}</td>
      <td>${fmtSalary(a.salary_min, a.salary_max)}</td>
    </tr>`).join('')

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Tracera – Executive Summary</title>
  <style>
    body{font-family:'Helvetica Neue',Arial,sans-serif;margin:40px;color:#1e293b;font-size:12px}
    h1{font-size:24px;color:#1d4ed8;margin-bottom:2px}
    .sub{color:#64748b;font-size:12px;margin-bottom:28px}
    .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
    .card{background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px;text-align:center}
    .card .n{font-size:30px;font-weight:700;color:#2563eb}
    .card .l{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-top:4px}
    h2{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#2563eb;margin:20px 0 10px}
    table{width:100%;border-collapse:collapse}
    th{text-align:left;padding:7px 10px;border-bottom:2px solid #e2e8f0;color:#64748b;font-size:10px;text-transform:uppercase}
    td{padding:7px 10px;border-bottom:1px solid #f1f5f9;vertical-align:middle}
    @media print{body{margin:20px}.grid{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style></head><body>
  <h1>Tracera Executive Summary</h1>
  <p class="sub">Job Search Overview · Exported ${date}</p>
  <div class="grid">
    <div class="card"><div class="n">${total}</div><div class="l">Total Applications</div></div>
    <div class="card"><div class="n">${interviews + offers}</div><div class="l">Interviews / Offers (${iRate}%)</div></div>
    <div class="card"><div class="n">${offers}</div><div class="l">Offers Received (${rate}%)</div></div>
    <div class="card"><div class="n">${rejected}</div><div class="l">Rejections</div></div>
  </div>
  <h2>Top Applications (Interview & Offer Stage)</h2>
  <table>
    <thead><tr><th>Company</th><th>Job Title</th><th>Status</th><th>Date Applied</th><th>Salary Range</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:20px">No interview-stage applications yet</td></tr>'}</tbody>
  </table></body></html>`
}
