# NOETERA MVP — master plan

This document ties together milestones, the locked scope from the Developer Handoff, and confirmed client decisions. M1 details live alongside it under `docs/`.

## Product and stack

- **Product:** NOETERA — a mobile-first web app for mental performance.
- **Core journey:** Assessment → Insight → Action (NPP Lite → results; 5-day program as the entry path).
- **Stack:** Next.js (App Router), TypeScript, Supabase (Auth + Postgres), Vercel, GitHub.

**Language:** English for all public-facing repo content — UI copy, `docs/`, `README`, code comments, and migration notes — unless a file is explicitly marked as private/local.

## Milestones

| Phase | Scope | Status |
|-------|--------|--------|
| **M1** | Scope refinement, user flow, DB schema, wireframes, repo bootstrap (Next + Supabase stubs), **`src/` layout** | Done |
| **M2** | Auth (email/password, session, forgot password), layout, navigation, program shell (days 1–5, states) | Done |
| **M3** | NPP Lite (10 items), scoring engine, persistence (history) | Done |
| **M4** | Results screens (profile, domains, strengths/focus) + dashboard + assessment polish | Done |
| **M5** | Full 5-day program (content, audio via URL), UI polish, tests, deploy, documentation | Done |

## Planning artifacts (M1)

| File | Purpose |
|------|---------|
| [SCOPE.md](./SCOPE.md) | Locked MVP scope and explicit non-goals |
| [USER_FLOW.md](./USER_FLOW.md) | First-time and returning user flows |
| [DATABASE.md](./DATABASE.md) | Tables, RLS, source of truth for program unlock |
| [wireframes.md](./wireframes.md) | Low-fidelity screen skeletons |

SQL migrations: `supabase/migrations/` (apply in your Supabase project).

## Client decisions (working direction)

1. **Profile:** map from the dominant pattern in domain scores (e.g. weakest domain or imbalance). Keep logic in one module so it is easy to change after reviewing results screens.
2. **Audio:** assets from the client; in code use a day → URL layer, not hard-coded local files in components.
3. **NPP retakes:** each completion is a new row with a timestamp; history is not overwritten.
4. **Design:** no Figma at this planning stage — clean, minimal, premium, mobile-first, calm, card-based, one primary CTA per screen.
5. **Reflections:** store answers in the database (JSONB), not only “day completed”. **MVP:** tap-based choices only — lightweight; no journaling or long-form text (keeps friction low).
6. **Dashboard (M2+):** for **new users**, the **5-day program** is the **main primary CTA** (“Start Day 1” first time, “Continue” when returning); other actions (e.g. profile card, retake NPP) stay clearly secondary so the next step is obvious.

## Milestone 4 — execution notes (client polish)

M4 is a product-facing milestone: the app should feel less like a form and more like guided training.

- **Assessment guidance**: add a short softening line above each question (e.g. “Quick check‑in”) so the experience feels coached.
- **Button hierarchy**: keep **Next / Finish** as the clear primary action; **Back** should read as secondary.
- **Post-assessment**: the completion state should feel like momentum (progress/insight) rather than a technical “saved” confirmation.
- **Copy pass**: make small wording refinements where needed to keep tone natural and calm.

### M4 defaults (chosen to keep scope tight)

- **Results navigation**: a single `/insights` route with a **3-step wizard** (Profile → Domains → Strengths).
- **History UI**: **latest-only** in M4. History is already stored append-only; a picker can be added later without changing persistence.

### Future-proofing (do not implement in M4)

- **Conditional content**: keep domain scores easy to access so a separate, rule-based recommendation layer can be added in M5+ without changing scoring/persistence.
- **Payments / IAP flexibility**: keep business logic provider-agnostic. A lightweight entitlements/access-state abstraction is a good **M5 foundation** item so Stripe can be one provider among future IAP sources.

## Target code layout

**Convention:** all application code lives under **`src/`** (officially supported by Next.js). Repo root keeps `public/`, `supabase/`, `docs/`, and config files (`package.json`, `next.config.ts`, `.env.example`, etc.).

- `src/app/` — App Router routes
- `src/components/` — UI
- `src/lib/supabase/` — browser + server clients, `updateSession` helper (used by `proxy.ts`)
- `src/lib/scoring/` — NPP scoring (M3)
- `src/config/audio.ts` — audio URLs per day (M5)
- `src/proxy.ts` — Next.js 16 **Proxy** entry (Supabase session / cookie refresh); imports `src/lib/supabase/middleware.ts`

## After M1

**M1 code:** `src/` layout is complete, including shared UI primitives under `src/components/` (screen shell, card, primary button, text link). Remaining setup is Supabase (steps 2–3) before M2.

1. ~~Adopt **`src/` layout~~** — done: `src/app`, `src/lib`, `src/config`, `src/proxy.ts`, alias `@/*` → `./src/*`, `src/components/`.
2. Create the Supabase project, apply migrations, enable Email auth.
3. Fill `.env.local` from `.env.example`.
4. Move to M2: auth screens and protected routes.

## Out of MVP scope

AI feedback, 32-item NPP, full 8-week program, payments, notifications, admin panel.
