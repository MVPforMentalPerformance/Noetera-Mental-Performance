import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { ensureProgramProgressRows, getUserOrNull } from "@/lib/program/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

function isProgramComplete(progress: Awaited<ReturnType<typeof ensureProgramProgressRows>>) {
  return progress.every((d) => d.completed_at != null);
}

export default function ProgramCompletePage() {
  return (
    <Suspense fallback={<ProgramCompleteSkeleton />}>
      <ProgramCompleteContent />
    </Suspense>
  );
}

function ProgramCompleteSkeleton() {
  return (
    <main className="flex flex-col gap-6">
      <AppCard className="p-6">
        <div className="h-4 w-44 animate-pulse rounded-xl bg-surface2/80" />
        <div className="mt-3 h-3 w-64 animate-pulse rounded-xl bg-surface2/80" />
        <div className="mt-2 h-3 w-56 animate-pulse rounded-xl bg-surface2/80" />
        <div className="mt-6 h-11 w-full animate-pulse rounded-2xl bg-surface2/80" />
      </AppCard>
    </main>
  );
}

async function ProgramCompleteContent() {
  const { user, supabase } = await getUserOrNull();
  if (!user) redirect("/sign-in");

  const progress = await ensureProgramProgressRows(user.id, supabase);
  if (!isProgramComplete(progress)) redirect("/program");

  return (
    <main className="flex flex-col gap-6">
      <header className="relative overflow-hidden rounded-card border border-border/80 bg-(--color-glass) px-5 py-5 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(920px_320px_at_20%_-30%,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent_62%)]" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Program</p>
          <h1 className="mt-2 text-4xl leading-[1.05] text-ink">You finished the 5-day sequence</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Take a quick NPP Lite check-in to understand where your mental performance is strongest right now, and what to
            train next.
          </p>
        </div>
      </header>

      <AppCard className="p-6">
        <p className="text-sm font-semibold text-ink">Next step</p>
        <p className="mt-2 text-sm text-muted">
          NPP Lite is a fast 10-item assessment across five performance domains. Your results are saved to your history.
        </p>
        <div className="mt-5">
          <Link href="/assessment" className="block cursor-pointer">
            <PrimaryButton type="button">Continue to NPP Lite</PrimaryButton>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link href="/dashboard" className="block cursor-pointer">
            <SecondaryButton type="button">Back to home</SecondaryButton>
          </Link>
          <Link href="/program" className="block cursor-pointer">
            <SecondaryButton type="button">Browse program days</SecondaryButton>
          </Link>
        </div>
      </AppCard>
    </main>
  );
}

