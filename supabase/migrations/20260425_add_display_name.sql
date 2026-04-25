-- Add display_name to user_profiles for onboarding flow
alter table public.user_profiles
  add column if not exists display_name text;
