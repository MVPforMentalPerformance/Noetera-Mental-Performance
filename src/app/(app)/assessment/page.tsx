import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { TextLink } from "@/components/text-link";

export default function AssessmentPage() {
  return (
    <main className="flex flex-col gap-6">
      <header className="relative overflow-hidden rounded-card border border-border/80 bg-(--color-glass) px-5 py-5 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_320px_at_20%_-30%,color-mix(in_srgb,var(--color-accent2)_16%,transparent),transparent_62%)]" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Assessment</p>
          <h1 className="mt-2 text-4xl leading-[1.05] text-ink">NPP Lite</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            A short 10-item check-in across five mental performance domains. Your score history is never overwritten.
          </p>
        </div>
      </header>

      <AppCard className="p-6">
        <p className="text-sm font-semibold text-ink">Coming in M3</p>
        <p className="mt-2 text-sm text-muted">
          This screen is a placeholder until the question flow and scoring engine ship.
        </p>
        <div className="mt-5">
          <PrimaryButton type="button" disabled>
            Start assessment
          </PrimaryButton>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <TextLink href="/dashboard" className="text-xs">
            Back to home
          </TextLink>
          <TextLink href="/program" className="text-xs">
            Continue program instead
          </TextLink>
        </div>
      </AppCard>
    </main>
  );
}

