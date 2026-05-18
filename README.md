# Tracera

**Track every application. Land your dream job.**

Tracera is a full-stack job application tracker built with Vue 3, Tailwind CSS, Pinia, and Supabase. Every feature is completely free — no paywalls, no locked features.

---

## Features

- **Google OAuth login** — one-click sign in, private per user
- **Dashboard** — stat cards, weekly activity chart, follow-up reminders, streak counter, weekly goal bar, and contextual smart tips
- **Applications list** — searchable, filterable, sortable table with inline status editing and bulk delete
- **Kanban board** — drag-and-drop view grouped by status
- **Add / Edit form** — multi-section form with inline validation, star ratings, and unsaved-changes warning
- **Application detail** — full view with editable status timeline, mood log, and interview prep checklist
- **Insights** — charts for success rate, rejection stages, top job titles, salary ranges, and confidence vs outcome
- **Export** — PDF (3 templates), CSV (3 templates), JSON backup — all free, no libraries
- **Dark mode** — full dark/light mode toggle
- **Responsive** — bottom navigation on mobile, stacked layouts, large tap targets

---

## Stack

| Layer     | Tech                                   |
|-----------|----------------------------------------|
| Frontend  | Vue 3 + Composition API, Vite          |
| Styling   | Tailwind CSS, @tailwindcss/forms       |
| State     | Pinia                                  |
| Routing   | Vue Router 4                           |
| Backend   | Supabase (PostgreSQL + Auth + RLS)     |
| Charts    | Chart.js via vue-chartjs               |
| Kanban    | vuedraggable                           |
| Fonts     | Inter (Google Fonts)                   |

---

## Quick Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/tracera.git
cd tracera
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New project** and set a name and database password
3. Wait for the project to provision (~1–2 minutes)

### 3. Run the SQL schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Paste the full contents of `schema.sql` (in the project root)
4. Click **Run**

This creates the `applications`, `status_timeline`, and `user_goals` tables with Row Level Security enabled.

### 4. Enable Google OAuth

1. In Supabase, go to **Authentication → Providers**
2. Enable the **Google** provider
3. Go to [Google Cloud Console](https://console.cloud.google.com/) and create a new project (or use an existing one)
4. Enable the **Google+ API** (or Google Identity API)
5. Go to **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: add `https://your-project-id.supabase.co/auth/v1/callback`
6. Copy the **Client ID** and **Client Secret** back into Supabase → Google provider settings
7. Save

### 5. Add environment variables

Copy the example file:

```bash
cp .env.example .env
```

Fill in your credentials from the Supabase project dashboard (**Settings → API**):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — you'll see the login page.

---

## Database Schema

### `applications`
All job application data. Each row belongs to one user via `user_id` (RLS enforced).

| Column           | Type      | Description                                      |
|------------------|-----------|--------------------------------------------------|
| id               | uuid      | Primary key                                      |
| user_id          | uuid      | References auth.users                            |
| company_name     | text      | Required                                         |
| job_title        | text      | Required                                         |
| job_url          | text      | Optional link to job listing                     |
| date_applied     | date      | When you applied                                 |
| status           | text      | Applied / Interview / Offer / Rejected / Ghosted / Withdrawn |
| priority         | text      | Low / Medium / High                              |
| salary_min/max   | numeric   | Salary range                                     |
| work_setup       | text      | Remote / Hybrid / On-site                        |
| employment_type  | text      | Full-time / Part-time / Contract / Freelance     |
| contact_name     | text      | Recruiter or HM name                             |
| contact_email    | text      | Recruiter email                                  |
| interview_date   | timestamptz | Scheduled interview date/time                  |
| interview_notes  | text      | Notes from interviews                            |
| followup_date    | date      | When to follow up                                |
| rating           | smallint  | Role excitement (1–5 stars)                      |
| confidence_score | smallint  | Confidence level (1–5)                           |
| notes            | text      | Free notes                                       |
| is_favourite     | boolean   | Starred favourite                                |
| created_at       | timestamptz | Auto-set on insert                             |
| updated_at       | timestamptz | Auto-updated on change                         |

### `status_timeline`
Every status change is logged here, with an optional mood emoji and note.

### `user_goals`
One row per user storing their weekly application goal.

---

## Export Formats

All exports are completely free — no third-party libraries.

| Format | Templates                                               |
|--------|---------------------------------------------------------|
| PDF    | Classic, Modern (blue-branded), Executive Summary       |
| CSV    | Full Export, Recruiter Summary, Follow-up Sheet         |
| JSON   | Complete data backup (one click)                        |

PDF exports use the browser's built-in print API — when the print dialog opens, choose **"Save as PDF"**.

---
