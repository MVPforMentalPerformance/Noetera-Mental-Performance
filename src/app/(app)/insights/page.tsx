import { AppCard } from "@/components/app-card";
import { ListRow } from "@/components/list-row";
import { TextLink } from "@/components/text-link";

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

      <AppCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Screens</p>
        <div className="mt-4 flex flex-col gap-3">
          <ListRow title="Performance profile" subtitle="Your dominant pattern + short guidance (M4)" />
          <ListRow title="Domain breakdown" subtitle="Five domains with banding + one-line insight (M4)" />
          <ListRow title="Strengths & focus" subtitle="Top strengths + growth areas (M4)" />
        </div>
        <div className="mt-6 text-center">
          <TextLink href="/assessment" className="text-sm">
            Take NPP Lite first
          </TextLink>
        </div>
      </AppCard>
    </main>
  );
}

