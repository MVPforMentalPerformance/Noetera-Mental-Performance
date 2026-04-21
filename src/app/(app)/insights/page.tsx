import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { getLatestNppAssessmentResult } from "@/lib/npp/server";
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
  const { user, result } = await getLatestNppAssessmentResult();

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

  if (!result) {
    return (
      <AppCard className="p-6">
        <p className="text-sm font-semibold text-ink">No results yet</p>
        <p className="mt-2 text-sm text-muted">
          Take NPP Lite to generate your profile, domain breakdown, and strengths snapshot.
        </p>
        <div className="mt-5">
          <Link href="/assessment" className="block cursor-pointer">
            <PrimaryButton type="button">Take NPP Lite</PrimaryButton>
          </Link>
        </div>
      </AppCard>
    );
  }

  return <ResultsWizard result={result} />;
}

