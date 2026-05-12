import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { DOMAIN_COPY, PROFILE_COPY } from "@/lib/npp/copy";
import {
  type NppAssessmentComparison,
  getLatestNppAssessmentComparisonForUser,
} from "@/lib/npp/server";
import { getPrimaryProgramCta } from "@/lib/program/cta";
import { ensureProgramProgressRows, getUserOrNull } from "@/lib/program/server";
import Link from "next/link";
import { ResultsWizard } from "./results-wizard";

export default function InsightsPage() {
  return (
    <main className="flex flex-col gap-6">
      <header className="relative overflow-hidden rounded-card border border-border/80 bg-(--color-glass) px-5 py-5 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(920px_320px_at_18%_-30%,color-mix(in_srgb,var(--color-accent2)_16%,transparent),transparent_62%)]" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Insights</p>
          <h1 className="mt-2 text-4xl leading-[1.05] text-ink">Your results</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Results are generated from your latest NPP Lite retake and shown as three screens (profile, domains, strengths).
          </p>
        </div>
      </header>

      <InsightsBody />
    </main>
  );
}

async function InsightsBody() {
  const { user, supabase } = await getUserOrNull();

  if (!user) {
    return (
      <AppCard className="p-6">
        <p className="text-sm font-semibold text-ink">Sign in required</p>
        <p className="mt-2 text-sm text-muted">Please sign in to view results.</p>
        <div className="mt-5">
          <Link href="/sign-in" className="block cursor-pointer">
            <PrimaryButton type="button">Sign in</PrimaryButton>
          </Link>
        </div>
      </AppCard>
    );
  }

  const comparison = await getLatestNppAssessmentComparisonForUser(user.id, supabase);
  const progress = await ensureProgramProgressRows(user.id, supabase);
  const primaryCta = getPrimaryProgramCta(progress);

  if (!comparison) {
    return (
      <AppCard className="p-6">
        <p className="text-sm font-semibold text-ink">No results yet</p>
        <p className="mt-2 text-sm text-muted">
          Start the 5-day program first. NPP Lite stays available as an optional snapshot whenever you want it.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Link href={primaryCta.href} className="block cursor-pointer">
            <PrimaryButton type="button">{primaryCta.label}</PrimaryButton>
          </Link>
          <div className="flex flex-col items-center gap-1">
            <Link href="/assessment" className="block w-full cursor-pointer">
              <SecondaryButton type="button">
                Take NPP Lite
              </SecondaryButton>
            </Link>
            <p className="text-center text-[11px] text-muted">
              Optional: Take a quick 2-minute snapshot of your current state
            </p>
          </div>
        </div>
      </AppCard>
    );
  }

  return (
    <>
      <InsightsProgressBlock comparison={comparison} />
      <ResultsWizard result={comparison.latest} primaryCta={primaryCta} />
    </>
  );
}

function formatDelta(delta: number) {
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`;
}

function getTrendTitle(comparison: NppAssessmentComparison) {
  switch (comparison.trend) {
    case "new_baseline":
      return "New baseline";
    case "up":
      return "Moving up";
    case "down":
      return "Check-in dip";
    default:
      return "Holding steady";
  }
}

function getTrendBody(comparison: NppAssessmentComparison) {
  if (comparison.trend === "new_baseline") {
    return "This is your first saved NPP Lite snapshot, so future retakes can now show direction.";
  }

  const delta = comparison.global_average_delta ?? 0;
  if (comparison.trend === "up") {
    return `Global average ${formatDelta(delta)} since your previous check-in.`;
  }
  if (comparison.trend === "down") {
    return `Global average ${formatDelta(delta)} since your previous check-in. A useful signal for what to train next.`;
  }
  return "Your baseline is staying consistent across recent check-ins.";
}

function getShiftTitle(comparison: NppAssessmentComparison) {
  if (comparison.strongest_gain_domain) return "Biggest gain";
  if (comparison.strongest_drop_domain) return "Watch area";
  return "Snapshot pattern";
}

function getShiftBody(comparison: NppAssessmentComparison) {
  if (comparison.strongest_gain_domain) {
    const domain = DOMAIN_COPY[comparison.strongest_gain_domain.key];
    return `${domain.label} ${formatDelta(comparison.strongest_gain_domain.delta)} from the previous snapshot.`;
  }
  if (comparison.strongest_drop_domain) {
    const domain = DOMAIN_COPY[comparison.strongest_drop_domain.key];
    return `${domain.label} ${formatDelta(comparison.strongest_drop_domain.delta)} from the previous snapshot.`;
  }
  return "No major shifts yet; this is a clean starting point to compare against later.";
}

function InsightsProgressBlock({ comparison }: { comparison: NppAssessmentComparison }) {
  const profile = PROFILE_COPY[comparison.latest.display_profile_key];
  const focusDomain = DOMAIN_COPY[comparison.priority_domain_key];

  return (
    <AppCard className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Progress snapshot</p>
          <h2 className="mt-3 text-3xl leading-tight text-ink">{getTrendTitle(comparison)}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{getTrendBody(comparison)}</p>
        </div>
        <span className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-muted">
          {comparison.latest.global_average.toFixed(1)} avg
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/80 bg-(--color-glass2) px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Current profile</p>
          <p className="mt-2 text-sm font-semibold text-ink">{profile.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Captured {new Date(comparison.latest.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-(--color-glass2) px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{getShiftTitle(comparison)}</p>
          <p className="mt-2 text-sm font-semibold text-ink">
            {comparison.strongest_gain_domain
              ? DOMAIN_COPY[comparison.strongest_gain_domain.key].label
              : comparison.strongest_drop_domain
                ? DOMAIN_COPY[comparison.strongest_drop_domain.key].label
                : "Starting point"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{getShiftBody(comparison)}</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-(--color-glass2) px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Focus now</p>
          <p className="mt-2 text-sm font-semibold text-ink">{focusDomain.label}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{focusDomain.insight}</p>
        </div>
      </div>
    </AppCard>
  );
}

