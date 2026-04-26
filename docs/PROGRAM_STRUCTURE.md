# Program structure (data-driven)

The 5‑day program is designed so that the **UI is generic** and the **content is centralized** in a small set of “data” modules and database tables.

## What “data-driven” means here

- Screen routes render **by day index** (`1..5`) rather than hardcoding five different components.
- Titles, blurbs, and reflection options are pulled from a single metadata object.
- Audio is mapped via a single configuration layer (day → URL).
- User progress is persisted in the database in a single table keyed by `(user_id, day_index)`.

## Program meta (copy + reflection)

File: `src/lib/program/meta.ts`

- `DAY_META` is a `Record<1|2|3|4|5, DayMeta>` with:
  - `title`
  - `blurb`
  - `reflection` (tap-only choices)

This is intentionally simple so content changes do not require touching UI components.

## Audio mapping

File: `src/config/audio.ts`

- Keeps audio URLs out of components.
- The “day page” reads the URL for the current day and renders an audio player.

## Persistence model

Tables (see `docs/DATABASE.md` for full schema/RLS):

- `public.user_profiles`
  - `program_max_unlocked_day` is the **source of truth** for which day a user can access.
- `public.program_day_progress`
  - One row per user per day.
  - `unlocked_at` is set (Day 1 initially; later days when they become available).
  - `completed_at` is set when the day is completed.
  - `reflection_payload` stores the tap reflection result as JSONB.

Server helper module:

- `src/lib/program/server.ts`
  - Creates/ensures progress rows idempotently (`ensureProgramProgressRows`)
  - Reads progress (`listProgramProgress`)
  - Fetches the user profile (`getUserProfile`)

## Typical future extensions (without changing the overall shape)

- Add longer-form reflections (text) by extending `reflection_payload` or adding a table
- Add richer content (multiple cards, sections, exercises) by expanding `DAY_META` to include arrays of blocks
- Add conditional content rules based on latest NPP results without changing persistence

