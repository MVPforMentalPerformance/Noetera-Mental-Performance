# Database schema (Supabase / Postgres)

## Principles

- User identity: `auth.users` (Supabase Auth).
- App data in `public` with **RLS**: users only read/write their own rows (`auth.uid() = user_id` or `id`).
- **NPP history:** append-only new results; no overwriting history to “replace” a profile.
- **Reflections:** stored in JSONB (`reflection_payload`) alongside day completion.

## Tables

### `public.user_profiles`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid PK, FK → `auth.users(id)` | Same as auth user id |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |
| `program_max_unlocked_day` | smallint, default 1, check 1–5 | **Source of truth** for “through which day access is allowed” |

A row is created on sign-up via trigger `on_auth_user_created`.

Logic: when day `d` is completed, bump `program_max_unlocked_day` to `min(5, d+1)` (or equivalent) so unlock state does not require scanning all rows on every request. “Day completed” and reflection live in `program_day_progress`.

### `public.npp_assessment_results`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid PK | |
| `user_id` | uuid FK → `auth.users` | |
| `created_at` | timestamptz | Completion time |
| `responses` | jsonb | Answers 1–10 (e.g. `{"1":3,"2":5,...}`) |
| `domain_scores` | jsonb | Averages for 5 domains |
| `derived_map` | jsonb | Derived strengths and bands |
| `profile_key` | text | Internal profile key (maps to one of four names) |
| `scoring_version` | text, default `'1'` | For formula evolution |

Index: `(user_id, created_at DESC)` for “latest result” and history lists.

### `public.program_day_progress`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid PK | |
| `user_id` | uuid FK → `auth.users` | |
| `day_index` | smallint, check 1–5 | |
| `unlocked_at` | timestamptz, nullable | When the day became available |
| `completed_at` | timestamptz, nullable | When marked complete |
| `reflection_payload` | jsonb, nullable | Tap reflection choice(s) |

Unique: `(user_id, day_index)`.

## RLS (summary)

All three tables: `ENABLE ROW LEVEL SECURITY`.

Policies (intent):

- `user_profiles`: `SELECT/UPDATE` when `auth.uid() = id` (insert usually via trigger only).
- `npp_assessment_results`: `SELECT/INSERT` when `auth.uid() = user_id`; optionally no `UPDATE`/`DELETE` for end users to preserve history.
- `program_day_progress`: `SELECT/INSERT/UPDATE` when `auth.uid() = user_id`.

Exact SQL: `supabase/migrations/001_initial_schema.sql`.

## Migrations

Apply via Supabase CLI (`supabase db push`) or the Dashboard SQL Editor.

## Backups & recovery (operational note)

Backup availability depends on your Supabase plan and what the project’s Dashboard enables at the time. In this project’s current Free plan state, the Dashboard indicates **scheduled/project backups are not included**, so rely on regular off‑site exports (`supabase db dump`) until you upgrade.

See:
- `docs/OPERATIONS.md` (recommended process + limitations)
- `https://supabase.com/docs/guides/platform/backups`
