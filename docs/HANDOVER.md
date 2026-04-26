# NOETERA MVP — Handover documentation

This folder is intended to make long‑term ownership and future development straightforward.

## Quick links

- Product scope and milestones: `docs/MASTER_PLAN.md`, `docs/SCOPE.md`
- User flow: `docs/USER_FLOW.md`
- Database structure (tables + RLS): `docs/DATABASE.md`
- Operations (backups, restore, environments): `docs/OPERATIONS.md`
- Program content architecture (“data‑driven”): `docs/PROGRAM_STRUCTURE.md`

## Stack

- Next.js (App Router), TypeScript
- Supabase (Auth + Postgres)
- Vercel (hosting)

## Local development

Prereqs:
- Node.js + npm
- A Supabase project with migrations applied

Steps:

1. Install deps

```bash
npm install
```

2. Configure environment variables

```bash
cp .env.example .env.local
```

Set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Run

```bash
npm run dev
```

App: `http://localhost:3000`

## Supabase setup checklist

- Create Supabase project
- Apply SQL migrations from `supabase/migrations/` (in order)
- Enable Email Auth
- Configure **Auth Redirect URLs** (important for email confirm + password reset):
  - `http://localhost:3000/**`
  - your production domain `https://<your-domain>/**`

Notes:
- Database tables live in `public` and are protected by **RLS**.
- A `public.user_profiles` row is created automatically on sign‑up by a trigger.

## Where to look in code

- Routes: `src/app/`
  - Auth: `src/app/(auth)/...`
  - App: `src/app/(app)/...` (dashboard, program, assessment, insights, profile)
- Supabase clients:
  - Server client: `src/lib/supabase/server.ts`
  - Browser client: `src/lib/supabase/client.ts`
- Session refresh / cookie maintenance (Next.js 16+):
  - Entry: `src/proxy.ts` (exports `proxy`)
  - Helper: `src/lib/supabase/middleware.ts`
- Program state + persistence helpers: `src/lib/program/server.ts`
- Program content metadata: `src/lib/program/meta.ts`
- Audio mapping (day → URL): `src/config/audio.ts`
- NPP Lite questions: `src/lib/npp/npp-lite-questions.ts`
- NPP scoring + tests: `src/lib/scoring/*`

## Data ownership & security (high level)

- Authentication identities: `auth.users` (managed by Supabase)
- App data: Postgres tables under `public` with **Row Level Security**
- Policies enforce “users can only read/write their own rows” via `auth.uid()`

