-- NOETERA MVP — initial schema (apply via Supabase SQL Editor or CLI)

create extension if not exists "pgcrypto";

create table public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  program_max_unlocked_day smallint not null default 1
    check (program_max_unlocked_day >= 1 and program_max_unlocked_day <= 5)
);

create table public.npp_assessment_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  responses jsonb not null,
  domain_scores jsonb not null,
  derived_map jsonb,
  profile_key text not null,
  scoring_version text not null default '1'
);

create index npp_assessment_results_user_created_idx
  on public.npp_assessment_results (user_id, created_at desc);

create table public.program_day_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  day_index smallint not null check (day_index >= 1 and day_index <= 5),
  unlocked_at timestamptz,
  completed_at timestamptz,
  reflection_payload jsonb,
  unique (user_id, day_index)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row
  execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

alter table public.user_profiles enable row level security;
alter table public.npp_assessment_results enable row level security;
alter table public.program_day_progress enable row level security;

create policy "user_profiles_select_own"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "user_profiles_update_own"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "npp_select_own"
  on public.npp_assessment_results for select
  using (auth.uid() = user_id);

create policy "npp_insert_own"
  on public.npp_assessment_results for insert
  with check (auth.uid() = user_id);

create policy "program_select_own"
  on public.program_day_progress for select
  using (auth.uid() = user_id);

create policy "program_insert_own"
  on public.program_day_progress for insert
  with check (auth.uid() = user_id);

create policy "program_update_own"
  on public.program_day_progress for update
  using (auth.uid() = user_id);
