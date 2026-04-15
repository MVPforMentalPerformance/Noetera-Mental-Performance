import { AppCard } from "@/components/app-card";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-surface2/80 ${className}`} />;
}

export default function AppLoading() {
  return (
    <main className="flex flex-col gap-6">
      <AppCard className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(980px_320px_at_22%_-30%,color-mix(in_srgb,var(--color-accent2)_20%,transparent),transparent_58%)] opacity-60" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="mt-4 h-10 w-[min(420px,90%)]" />
            <SkeletonBlock className="mt-4 h-4 w-[min(520px,95%)]" />
            <SkeletonBlock className="mt-2 h-4 w-[min(480px,92%)]" />
          </div>
          <SkeletonBlock className="h-28 w-28 rounded-full" />
        </div>
      </AppCard>

      <AppCard className="p-6">
        <SkeletonBlock className="h-4 w-44" />
        <SkeletonBlock className="mt-3 h-3 w-56" />
        <SkeletonBlock className="mt-6 h-11 w-full rounded-2xl" />
      </AppCard>

      <div className="grid grid-cols-2 gap-3">
        <AppCard className="p-5 sm:p-5">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="mt-3 h-9 w-16" />
          <SkeletonBlock className="mt-2 h-3 w-28" />
        </AppCard>
        <AppCard className="p-5 sm:p-5">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="mt-3 h-9 w-16" />
          <SkeletonBlock className="mt-2 h-3 w-28" />
        </AppCard>
      </div>
    </main>
  );
}

