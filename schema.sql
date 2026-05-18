-- Tracera Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Applications ────────────────────────────────────────────────────────────
create table if not exists applications (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  company_name    text not null,
  job_title       text not null,
  job_url         text,
  date_applied    date,
  status          text not null default 'Applied'
                  check (status in ('Applied','Interview','Offer','Rejected','Ghosted','Withdrawn')),
  priority        text default 'Medium'
                  check (priority in ('Low','Medium','High')),
  salary_min      numeric,
  salary_max      numeric,
  work_setup      text check (work_setup in ('Remote','Hybrid','On-site')),
  employment_type text check (employment_type in ('Full-time','Part-time','Contract','Freelance')),
  contact_name    text,
  contact_email   text,
  interview_date  timestamptz,
  interview_notes text,
  followup_date   date,
  rating          smallint check (rating between 1 and 5),
  confidence_score smallint check (confidence_score between 1 and 5),
  notes           text,
  is_favourite    boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists idx_applications_user_id      on applications(user_id);
create index if not exists idx_applications_status        on applications(status);
create index if not exists idx_applications_date_applied  on applications(date_applied);
create index if not exists idx_applications_followup_date on applications(followup_date);

-- ─── Status Timeline ─────────────────────────────────────────────────────────
create table if not exists status_timeline (
  id              uuid primary key default uuid_generate_v4(),
  application_id  uuid references applications(id) on delete cascade not null,
  user_id         uuid references auth.users(id) on delete cascade not null,
  status          text not null,
  mood            text,
  note            text,
  changed_at      timestamptz default now()
);

create index if not exists idx_timeline_application_id on status_timeline(application_id);
create index if not exists idx_timeline_user_id        on status_timeline(user_id);

-- ─── User Goals ──────────────────────────────────────────────────────────────
create table if not exists user_goals (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null unique,
  weekly_goal integer default 5,
  created_at  timestamptz default now()
);

create index if not exists idx_user_goals_user_id on user_goals(user_id);

-- ─── Updated-at trigger ──────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on applications;
create trigger set_updated_at
  before update on applications
  for each row execute procedure update_updated_at();

-- ─── Row Level Security ──────────────────────────────────────────────────────
alter table applications    enable row level security;
alter table status_timeline enable row level security;
alter table user_goals      enable row level security;

-- Applications policies
create policy "Users read own applications"
  on applications for select using (auth.uid() = user_id);

create policy "Users insert own applications"
  on applications for insert with check (auth.uid() = user_id);

create policy "Users update own applications"
  on applications for update using (auth.uid() = user_id);

create policy "Users delete own applications"
  on applications for delete using (auth.uid() = user_id);

-- Status timeline policies
create policy "Users read own timeline"
  on status_timeline for select using (auth.uid() = user_id);

create policy "Users insert own timeline"
  on status_timeline for insert with check (auth.uid() = user_id);

create policy "Users delete own timeline"
  on status_timeline for delete using (auth.uid() = user_id);

-- User goals policies
create policy "Users read own goals"
  on user_goals for select using (auth.uid() = user_id);

create policy "Users upsert own goals"
  on user_goals for insert with check (auth.uid() = user_id);

create policy "Users update own goals"
  on user_goals for update using (auth.uid() = user_id);
