import { RingProgress } from "@/components/ring-progress";
import Link from "next/link";

type LandingHeroProps = {
  isAuthenticated?: boolean;
};

export function LandingHero({ isAuthenticated = false }: LandingHeroProps) {
  const primaryAction = isAuthenticated
    ? { href: "/program", label: "Continue program" }
    : { href: "/sign-up", label: "Start for free" };
  const secondaryAction = isAuthenticated
    ? { href: "/dashboard", label: "Open dashboard" }
    : { href: "/sign-in", label: "Log in" };

  return (
    <section
      id="top"
      className="relative overflow-hidden scroll-mt-20 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-accent2)_16%,transparent)_0%,transparent_72%)]" />
        <div className="absolute right-0 top-8 h-80 w-80 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-canvasGlow)_85%,transparent)_0%,transparent_72%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,420px)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_440px]">

          {/* ── Copy ─────────────────────────────────────────────── */}
          <div className="page-fade max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              Mental Performance Platform
            </p>

            <h1 className="mt-5 max-w-[11ch] text-[clamp(2.85rem,8vw,5.2rem)] leading-[0.92] text-ink sm:max-w-[12ch]">
              Clearer mind.
              <br />
              Calmer performance.
            </h1>

            <p className="mt-5 max-w-[46ch] text-[clamp(0.98rem,2.5vw,1.08rem)] leading-relaxed text-muted">
              NOETERA is a premium 5-day reset for focus, resilience, and calm under
              pressure. A quiet, structured routine that helps high-performers build
              mental clarity one deliberate session at a time.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={primaryAction.href}
                className="rounded-2xl bg-linear-to-r from-accent to-accent2 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_42px_-26px_var(--color-shadow)] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:px-7 sm:py-3.5"
              >
                {primaryAction.label}
              </Link>
              <Link
                href={secondaryAction.href}
                className="rounded-2xl border border-border/90 bg-surface/90 px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-surface2/90 active:translate-y-0 sm:px-7 sm:py-3.5"
              >
                {secondaryAction.label}
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="glass rounded-3xl px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Program
                </p>
                <p className="mt-2 text-2xl text-ink">5 days</p>
              </div>
              <div className="glass rounded-3xl px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Sessions
                </p>
                <p className="mt-2 text-2xl text-ink">10 min</p>
              </div>
              <div className="glass rounded-3xl px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Outcome
                </p>
                <p className="mt-2 text-2xl text-ink">Clarity</p>
              </div>
            </div>

            <div className="glass mt-6 rounded-3xl px-4 py-4 sm:hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                    Today&apos;s preview
                  </p>
                  <p className="mt-2 text-lg text-ink">Your next calm move starts now</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    A compact, premium routine designed to keep attention steady under pressure.
                  </p>
                </div>
                <div className="rounded-2xl bg-surface2/80 px-3 py-2 text-right">
                  <p className="text-xl font-semibold text-ink">60%</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Clarity
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Dashboard preview ────────────────────────────────── */}
          <div
            className="page-fade hidden sm:block lg:justify-self-end"
            style={{ animationDelay: "120ms" }}
          >
            <HeroDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroDashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -inset-2 rounded-4xl opacity-40 sm:-inset-3"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--color-accent2) 24%, transparent), transparent 68%)",
        }}
        aria-hidden
      />

      {/* Card */}
      <div className="glass relative rounded-card p-5 sm:p-6">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 260px at 18% -24%, color-mix(in srgb, var(--color-accent2) 14%, transparent), transparent 58%)",
          }}
          aria-hidden
        />

        <div className="relative">
          {/* Header row */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                Day 3 · In progress
              </p>
              <h2 className="mt-2 text-xl leading-snug text-ink sm:text-2xl">
                Your next calm
                <br />
                move starts now
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                One short session per day builds steady attention under pressure.
              </p>
            </div>

            <RingProgress
              value={60}
              size={84}
              stroke={9}
              trackColor="transparent"
              showShadow={false}
            >
              <div className="text-center">
                <p className="text-xl font-semibold text-ink tabular-nums">60%</p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Clarity
                </p>
              </div>
            </RingProgress>
          </div>

          {/* CTA row (static preview) */}
          <div className="mt-5 rounded-2xl bg-linear-to-r from-accent to-accent2 py-2.5 text-center text-sm font-semibold text-white">
            Continue Day 3 →
          </div>

          {/* Stats */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-border/70 bg-surface/70 px-3 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
                Completed
              </p>
              <p className="mt-1 text-xl font-semibold text-ink">3</p>
              <p className="text-[10px] text-muted">Sessions</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-surface/70 px-3 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
                Remaining
              </p>
              <p className="mt-1 text-xl font-semibold text-ink">2</p>
              <p className="text-[10px] text-muted">Days left</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badge */}
      <div className="absolute right-3 top-3 z-10 rounded-full border border-border/80 bg-surface px-2.5 py-1 text-[10px] font-semibold text-muted shadow-sm backdrop-blur-sm sm:-right-2 sm:-top-2">
        Preview
      </div>
    </div>
  );
}
