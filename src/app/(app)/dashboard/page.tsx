import { AppCard } from "@/components/app-card";
import { IconButton } from "@/components/icon-button";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { RingProgress } from "@/components/ring-progress";
import { TextLink } from "@/components/text-link";
import { DOMAIN_COPY, PROFILE_COPY } from "@/lib/npp/copy";
import { getLatestNppAssessmentComparisonForUser } from "@/lib/npp/server";
import { getPrimaryProgramCta } from "@/lib/program/cta";
import { ensureProgramProgressRows, getUserOrNull, getUserProfile } from "@/lib/program/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function BoltIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M13.4 2.8L6.8 13.2h5l-1.2 8 6.6-10.4h-5l1.2-8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <main id="top" className="flex flex-col gap-5 scroll-mt-24 sm:gap-6 sm:scroll-mt-28">
      <header className="glass relative rounded-card px-5 py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(980px_320px_at_22%_-30%,color-mix(in_srgb,var(--color-accent2)_14%,transparent),transparent_58%)] opacity-60" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="h-3 w-28 animate-pulse rounded-xl bg-surface2/80" />
            <div className="mt-4 h-10 w-[min(420px,90%)] animate-pulse rounded-xl bg-surface2/80" />
            <div className="mt-4 h-4 w-[min(520px,95%)] animate-pulse rounded-xl bg-surface2/80" />
            <div className="mt-2 h-4 w-[min(480px,92%)] animate-pulse rounded-xl bg-surface2/80" />
          </div>
          <div className="h-28 w-28 animate-pulse rounded-full bg-surface2/80" />
        </div>
      </header>
      <AppCard className="p-6">
        <div className="h-4 w-44 animate-pulse rounded-xl bg-surface2/80" />
        <div className="mt-3 h-3 w-56 animate-pulse rounded-xl bg-surface2/80" />
        <div className="mt-6 h-11 w-full animate-pulse rounded-2xl bg-surface2/80" />
      </AppCard>
      <div className="grid grid-cols-2 gap-3">
        <AppCard className="p-5 sm:p-5">
          <div className="h-3 w-24 animate-pulse rounded-xl bg-surface2/80" />
          <div className="mt-3 h-9 w-16 animate-pulse rounded-xl bg-surface2/80" />
          <div className="mt-2 h-3 w-28 animate-pulse rounded-xl bg-surface2/80" />
        </AppCard>
        <AppCard className="p-5 sm:p-5">
          <div className="h-3 w-24 animate-pulse rounded-xl bg-surface2/80" />
          <div className="mt-3 h-9 w-16 animate-pulse rounded-xl bg-surface2/80" />
          <div className="mt-2 h-3 w-28 animate-pulse rounded-xl bg-surface2/80" />
        </AppCard>
      </div>
    </main>
  );
}

async function DashboardContent() {
  const { user, supabase } = await getUserOrNull();
  if (!user) redirect("/sign-in");

  const [profile, progress, nppComparison] = await Promise.all([
    getUserProfile(user.id, supabase),
    ensureProgramProgressRows(user.id, supabase),
    getLatestNppAssessmentComparisonForUser(user.id, supabase),
  ]);

  if (!profile.display_name) redirect("/onboarding");

  const cta = getPrimaryProgramCta(progress);
  const completedCount = progress.filter((d) => d.completed_at != null).length;
  const daysLeft = Math.max(5 - completedCount, 0);
  const progressPct = clamp(Math.round((completedCount / 5) * 100), 0, 100);
  const focusDomain = nppComparison ? DOMAIN_COPY[nppComparison.priority_domain_key] : null;
  const currentProfile = nppComparison ? PROFILE_COPY[nppComparison.latest.display_profile_key] : null;
  const dashboardTitle = focusDomain
    ? `Today's focus: ${focusDomain.label}`
    : "Your next calm move starts now";
  const dashboardBody = focusDomain
    ? `${currentProfile?.title ?? "Current snapshot"}: ${focusDomain.insight}`
    : "Start with the 5-day Mental Clarity sequence. One short session per day builds steady attention under pressure.";
  const focusTrend =
    nppComparison?.trend === "new_baseline"
      ? "First snapshot"
      : nppComparison?.trend === "up"
        ? "Up since last check-in"
        : nppComparison?.trend === "down"
          ? "Needs attention"
          : nppComparison
            ? "Holding steady"
            : null;

  return (
    <main id="top" className="flex flex-col gap-5 scroll-mt-24 sm:gap-6 sm:scroll-mt-28">
      <header className="glass relative rounded-card px-5 py-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(980px_320px_at_22%_-30%,color-mix(in_srgb,var(--color-accent2)_14%,transparent),transparent_58%)]" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Welcome back{profile.display_name ? `, ${profile.display_name}` : ""}
            </p>
            <h1 className="mt-3 text-[2.8rem] leading-[0.95] text-ink">{dashboardTitle}</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{dashboardBody}</p>
            {currentProfile ? (
              <div className="mt-4 inline-flex rounded-full border border-border/80 bg-surface/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Current profile: {currentProfile.title}
              </div>
            ) : null}
          </div>
          <div className="shrink-0 self-start sm:self-auto">
            <RingProgress
              value={progressPct}
              size={116}
              stroke={12}
              trackColor="transparent"
              showShadow={false}
            >
              <div className="text-center">
                <p className="text-[2rem] font-semibold text-ink tabular-nums">{progressPct}%</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Clarity
                </p>
              </div>
            </RingProgress>
          </div>
        </div>
      </header>

      <AppCard className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Primary flow
            </p>
            <p className="mt-2 text-xl text-ink">5-day Mental Clarity</p>
            <p className="mt-1 text-xs text-muted">
              Primary path · Tap-only reflection · Unlocks in order
            </p>
            <p className="mt-3 text-sm text-muted">Pick up where you left off and keep the cadence gentle.</p>
          </div>
          <IconButton variant="accent" aria-label="Start" className="shrink-0">
            <BoltIcon />
          </IconButton>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <Link href={cta.href} className="block cursor-pointer">
            <PrimaryButton type="button">{cta.label}</PrimaryButton>
          </Link>
          {nppComparison ? (
            <div className="text-center">
              <TextLink href="/assessment" className="text-sm">
                Retake NPP
              </TextLink>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Link href="/assessment" className="block w-full cursor-pointer">
                <SecondaryButton type="button">Take NPP Lite</SecondaryButton>
              </Link>
              <p className="text-center text-[11px] text-muted">
                Optional: Take a quick 2-minute snapshot of your current state
              </p>
            </div>
          )}
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Insight
            </p>
            <h2 className="mt-2 text-3xl leading-tight text-ink">Focus for today</h2>
            <p className="mt-3 text-sm text-muted">
              {focusDomain
                ? `${focusDomain.label} is the clearest next lever from your latest NPP Lite snapshot.`
                : "Take NPP Lite once to unlock a more personal focus area here."}
            </p>
          </div>
          {focusTrend ? (
            <span className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-muted">
              {focusTrend}
            </span>
          ) : null}
        </div>
        {focusDomain && currentProfile ? (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-surface/70 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Priority domain</p>
              <p className="mt-2 text-sm font-semibold text-ink">{focusDomain.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">{focusDomain.insight}</p>
            </div>
            <div className="rounded-3xl border border-border/80 bg-surface/70 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Coach note</p>
              <p className="mt-2 text-sm font-semibold text-ink">{currentProfile.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Keep the next step simple: reinforce this area, then retake NPP Lite after a few sessions.
              </p>
            </div>
          </div>
        ) : null}
        <div className="mt-5">
          <TextLink href={focusDomain ? "/insights" : "/assessment"} className="text-sm">
            {focusDomain ? "Review full insights" : "Take NPP Lite"}
          </TextLink>
        </div>
      </AppCard>
    </main>
  );
}
