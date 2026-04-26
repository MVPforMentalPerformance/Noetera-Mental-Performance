# Operations (Supabase + Vercel)

This document focuses on long‑term stability: backups, recovery, and environment hygiene.

## Environments

- **Local**: `http://localhost:3000`
- **Production**: Vercel deployment domain (set in Supabase redirect URLs)

Environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Never commit secrets. Keep all secrets in `.env.local` (local) and Vercel env vars (prod).

## Supabase backups (what you get + what to do)

Supabase backup availability depends on your current plan and Supabase’s platform policy at the time.
Treat the **project’s Dashboard** (Database → Backups) as the source of truth.

As of this project’s current state:
- **Free plan**: the Dashboard indicates that **scheduled/project backups are not included**.
- **Pro plan**: unlocks scheduled backups (and Pro commonly provides a retention window such as 7 days).
- **PITR** (Point-in-Time Recovery): Pro plan add‑on for more granular restores.

Supabase documentation reference (may not match plan gating shown in the Dashboard):
`https://supabase.com/docs/guides/platform/backups`

Important limitations:
- Backups do **not** include Storage objects (only database metadata).
- If you have custom Postgres roles, backups do not store their passwords.

Reference: `https://supabase.com/docs/guides/platform/backups`

### What to do right now on Free tier

Minimum recommended steps:

1. Assume there are **no managed scheduled backups**.
2. Implement an off‑site logical export cadence:
   - Use Supabase CLI `db dump` to export and store the dump outside Supabase (e.g. private S3, encrypted Google Drive, or another secure location).
3. Decide RPO/RTO targets for the MVP:
   - RPO (data loss): depends on your dump cadence (e.g. daily = up to ~24h)
   - RTO (restore time): depends on DB size; restore causes downtime

Example (local/manual) backup command:

```bash
supabase db dump --db-url "<your-connection-string>" --file "backup.sql"
```

Automate this later via CI (GitHub Actions) or a small scheduled job that runs in your own environment.

### Future upgrade path (recommended once the app has real users)

1. Move to **Pro** at minimum once retention and support expectations increase.
2. Use **scheduled backups** in the Dashboard once unlocked.
3. Enable **Point-in-Time Recovery (PITR)** if you need restore granularity better than daily.
   - PITR is an add‑on on paid plans and requires at least **Small compute**.
   - Supabase PITR can achieve an RPO around minutes (WAL archiving).

Reference: `https://supabase.com/docs/guides/platform/backups#point-in-time-recovery`

## Recovery process (how it works)

### Restore from a daily backup

- Dashboard → Database → Backups → pick a backup → Restore
- The project is **inaccessible during restore** (downtime).

### Restore to a precise time (PITR)

- Enable PITR (paid)
- Dashboard → Database → Backups → Point in Time → choose timestamp → Restore

## Storage backups (separate concern)

If you later use Supabase Storage for audio or uploads:
- Database backups do not restore deleted objects.
- Keep a separate storage backup strategy (bucket replication or periodic export).

## GitHub repository access (best practice)

If you want the client to have early visibility:
- Add them as read‑only collaborators early (after project kickoff/payment milestone).
- Keep secrets out of Git.
- Use issues/milestones to show progress without exposing internal credentials.

