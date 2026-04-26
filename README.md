# NOETERA MVP

Mobile-first web app (Next.js, TypeScript, Supabase, Vercel). Master plan and M1 artifacts: **[docs/MASTER_PLAN.md](./docs/MASTER_PLAN.md)**. Project language: **English** (UI, docs, comments).

**Layout:** application source lives under **`src/`** (`app`, `components`, `lib`, `config`, and **`proxy.ts`** for Next.js 16+ session refresh). Repo root: `public/`, `supabase/`, `docs/`, and project config files.

## Documentation (handover)

- Handover index: **[docs/HANDOVER.md](./docs/HANDOVER.md)**
- Operations (backups & recovery): **[docs/OPERATIONS.md](./docs/OPERATIONS.md)**
- Program architecture (data-driven): **[docs/PROGRAM_STRUCTURE.md](./docs/PROGRAM_STRUCTURE.md)**
- Database schema & RLS: **[docs/DATABASE.md](./docs/DATABASE.md)**

## Local development

```bash
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Initial schema and RLS: [supabase/migrations/001_initial_schema.sql](./supabase/migrations/001_initial_schema.sql). Apply in Supabase (SQL Editor or CLI).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint

## Notes

Next.js 16 deprecates the `middleware.ts` file name in favor of **`src/proxy.ts`** exporting `proxy` ([docs](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)). Supabase cookie refresh uses the same logic via `src/lib/supabase/middleware.ts` (helper only).

## Supabase Auth redirect URLs (M2)

To make **email confirmation** and **password reset** work, add these Redirect URLs in your Supabase project (Auth → URL Configuration):

- `http://localhost:3000/**`
- `https://mvp-for-mental-performance-app.vercel.app/**`

In code we use:

- **Sign up confirm**: `emailRedirectTo = <origin>/dashboard` (see `src/app/(auth)/_actions.ts`)
- **Reset password**: `redirectTo = <origin>/update-password` (see `src/app/(auth)/_actions.ts`)

**Password reset session:** The email link returns tokens in the URL (PKCE `?code=` or hash). The server cannot read the hash, so `/update-password` uses a **client** flow: it exchanges the code or waits for the browser session, then calls `updateUser` (see `src/app/(auth)/update-password/update-password-form.tsx`).

If a `noetera-scaffold` folder remains at the repo root from the first scaffold, delete it manually (close any process using `node_modules` inside it). It is not part of the app.
