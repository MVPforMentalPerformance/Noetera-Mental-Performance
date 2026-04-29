import { SecondaryButton } from "@/components/secondary-button";
import { AssessmentFlow } from "./assessment-flow";
import Link from "next/link";

export default function AssessmentPage() {
  return (
    <main className="flex flex-col gap-6">
      <header className="relative overflow-hidden rounded-card border border-border/80 bg-(--color-glass) px-5 py-5 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_320px_at_20%_-30%,color-mix(in_srgb,var(--color-accent2)_16%,transparent),transparent_62%)]" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Assessment</p>
          <h1 className="mt-2 text-4xl leading-[1.05] text-ink">NPP Lite</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            A fast 10-item performance profile across five mental training domains. Take it after the 5-day sequence (or
            anytime) to see what is strongest right now and where to focus next. Your score history is never overwritten.
          </p>
        </div>
      </header>

      <AssessmentFlow />

      <div className="flex justify-center">
        <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-ink transition-colors">
          Home
        </Link>
      </div>
    </main>
  );
}

