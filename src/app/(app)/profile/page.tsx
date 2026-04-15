import { AppCard } from "@/components/app-card";
import { ListRow } from "@/components/list-row";
import { ThemeControls } from "@/components/theme-controls";

function BrainIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9.2 6.2c-1.8 0-3.2 1.4-3.2 3.1 0 .8.3 1.5.7 2.1-.6.6-1 1.5-1 2.5 0 1.8 1.4 3.2 3.2 3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M14.8 6.2c1.8 0 3.2 1.4 3.2 3.1 0 .8-.3 1.5-.7 2.1.6.6 1 1.5 1 2.5 0 1.8-1.4 3.2-3.2 3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M12 5.3v13.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 13.3c1.2-2.6 2.3-2.6 3.5 0s2.3 2.6 3.5 0 2.3-2.6 3.5 0 2.3 2.6 3.5 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.5 17.5V12.8M12 17.5V9.2M17.5 17.5V14.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5.3 19.2h13.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export default function ProfilePage() {
  return (
    <main className="flex flex-col gap-6">
      <header className="relative overflow-hidden rounded-card border border-border/80 bg-(--color-glass) px-5 py-5 backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_320px_at_20%_-30%,color-mix(in_srgb,var(--color-accent2)_16%,transparent),transparent_62%)]" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Settings</p>
          <h1 className="mt-2 text-4xl leading-[1.05] text-ink">Profile</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Appearance controls and coach modules live here. Account settings remain lightweight in the MVP.
          </p>
        </div>
      </header>

      <AppCard className="p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-(--color-glass2) text-xl font-semibold text-ink">
            M
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold text-ink">Mykhail Druz</p>
            <p className="mt-1 text-xs text-muted">Level 1 · 0 XP</p>
          </div>
          <span className="rounded-full border border-border bg-(--color-glass2) px-3 py-1 text-xs font-semibold text-muted">
            Edit
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-(--color-glass2) px-3 py-3">
            <p className="text-xs font-semibold text-ink">0 Day Streak</p>
            <p className="mt-1 text-[11px] text-muted">Consistency</p>
          </div>
          <div className="rounded-2xl bg-(--color-glass2) px-3 py-3">
            <p className="text-xs font-semibold text-ink">Achievements</p>
            <p className="mt-1 text-[11px] text-muted">Coming soon</p>
          </div>
        </div>
      </AppCard>

      <AppCard className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Coach intelligence</p>
        <div className="mt-4 flex flex-col gap-3">
          <ListRow icon={<BrainIcon />} title="Coach Intelligence" subtitle="Offline" />
          <ListRow icon={<WaveIcon />} title="Voice Coach" subtitle="Tap-to-talk prompts (M2+)" />
          <ListRow icon={<InsightsIcon />} title="Performance Insights" subtitle="Trends and snapshots (M2+)" />
        </div>
      </AppCard>

      <AppCard className="p-6">
        <ThemeControls />
      </AppCard>
    </main>
  );
}

