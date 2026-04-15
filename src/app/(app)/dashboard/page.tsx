import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { TextLink } from "@/components/text-link";
import {
  ensureProgramProgressRows,
  getUserProfile,
  getUserOrNull,
} from "@/lib/program/server";
import Link from "next/link";
import { redirect } from "next/navigation";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getPrimaryProgramCta(progress: Awaited<ReturnType<typeof ensureProgramProgressRows>>) {
  const nextIncomplete = progress.find((d) => d.completed_at == null);
  if (!nextIncomplete) return { label: "Program complete", href: "/program" };
  const started = progress.some((d) => d.completed_at != null);
  return {
    label: started ? "Continue your practice" : "Begin day 1",
    href: `/program/day/${nextIncomplete.day_index}`,
  };
}

export default async function DashboardPage() {
  const { user } = await getUserOrNull();
  if (!user) redirect("/sign-in");

  const [profile, progress] = await Promise.all([
    getUserProfile(user.id),
    ensureProgramProgressRows(user.id),
  ]);

  const cta = getPrimaryProgramCta(progress);
  const completedCount = progress.filter((d) => d.completed_at != null).length;
  const progressPct = clamp(Math.round((completedCount / 5) * 100), 0, 100);
  const daysLeft = Math.max(5 - completedCount, 0);

  return (
    <main className="flex flex-col gap-6">
      <AppCard className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(980px_320px_at_22%_-30%,color-mix(in_srgb,var(--color-accent2)_20%,transparent),transparent_58%)]" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Daily Focus
          </p>
          <h1 className="mt-2 text-4xl leading-[1.05] text-ink">Your next calm move</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Mental Clarity is built as a short sequence of focused daily sessions.
            Keep the rhythm gentle and consistent.
          </p>

          <div className="mt-6 rounded-3xl border border-border/80 bg-surface2/65 p-5 shadow-[0_22px_55px_-42px_var(--color-shadow)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">5-day journey</p>
                <p className="mt-1 text-xs text-muted">
                  Completed {completedCount} of 5. Unlocked through day {profile.program_max_unlocked_day}.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-ink">
                {progressPct}%
              </span>
            </div>

            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-linear-to-r from-accent to-accent2"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                <span>Day 1</span>
                <span>Day 5</span>
              </div>
            </div>

            <div className="mt-5">
              <Link href={cta.href} className="block cursor-pointer">
                <PrimaryButton type="button">{cta.label}</PrimaryButton>
              </Link>
            </div>
          </div>
        </div>
      </AppCard>

      <div className="grid grid-cols-2 gap-3">
        <AppCard className="p-5 sm:p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Completed</p>
          <p className="mt-2 text-3xl text-ink">{completedCount}</p>
          <p className="mt-1 text-xs text-muted">Sessions finished</p>
        </AppCard>
        <AppCard className="p-5 sm:p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Remaining</p>
          <p className="mt-2 text-3xl text-ink">{daysLeft}</p>
          <p className="mt-1 text-xs text-muted">Days to completion</p>
        </AppCard>
      </div>

      <AppCard className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-3xl leading-tight text-ink">Personal profile</h2>
            <p className="mt-3 text-sm text-muted">
              Your NPP Lite profile and trend snapshots will appear here after assessments ship.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-muted">
            Coming soon
          </span>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <TextLink href="/program" className="text-sm">
            Browse program days
          </TextLink>
          <TextLink href="/program" className="text-sm">
            Retake NPP
          </TextLink>
        </div>
      </AppCard>
    </main>
  );
}
