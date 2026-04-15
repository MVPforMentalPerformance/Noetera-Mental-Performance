-- Fix Supabase linter WARN: auth_rls_initplan
-- Use initplan-friendly auth function calls in RLS policies:
-- https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

drop policy if exists "user_profiles_select_own" on public.user_profiles;
create policy "user_profiles_select_own"
  on public.user_profiles for select
  using ((select auth.uid()) = id);

drop policy if exists "user_profiles_update_own" on public.user_profiles;
create policy "user_profiles_update_own"
  on public.user_profiles for update
  using ((select auth.uid()) = id);

drop policy if exists "npp_select_own" on public.npp_assessment_results;
create policy "npp_select_own"
  on public.npp_assessment_results for select
  using ((select auth.uid()) = user_id);

drop policy if exists "npp_insert_own" on public.npp_assessment_results;
create policy "npp_insert_own"
  on public.npp_assessment_results for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "program_select_own" on public.program_day_progress;
create policy "program_select_own"
  on public.program_day_progress for select
  using ((select auth.uid()) = user_id);

drop policy if exists "program_insert_own" on public.program_day_progress;
create policy "program_insert_own"
  on public.program_day_progress for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "program_update_own" on public.program_day_progress;
create policy "program_update_own"
  on public.program_day_progress for update
  using ((select auth.uid()) = user_id);

