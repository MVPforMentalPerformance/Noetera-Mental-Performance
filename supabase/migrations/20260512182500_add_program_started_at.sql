alter table public.program_day_progress
  add column if not exists started_at timestamptz;
