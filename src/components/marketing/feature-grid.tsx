const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <path
          d="M12 4v2M12 18v2M4 12h2M18 12h2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "5-Day Mental Clarity",
    description:
      "A structured program built for consistency. Short daily sessions that compound into lasting focus, resilience, and calm under pressure.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M9 3H5a2 2 0 0 0-2 2v4M9 3h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "NPP Assessment",
    description:
      "A 2-minute snapshot of your current mental performance state. Understand where you stand so every session targets what matters most.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <polyline
          points="22 12 18 12 15 21 9 3 6 12 2 12"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Adaptive Insights",
    description:
      "Track your progress across every session. See patterns emerge, measure your clarity score, and watch resilience grow in real time.",
  },
];

const steps = [
  {
    num: "01",
    title: "Take the assessment",
    desc: "A quick 2-minute mental performance snapshot to understand your starting point and personalise your journey.",
  },
  {
    num: "02",
    title: "Follow the program",
    desc: "Five focused daily sessions — tap-only reflection, no friction, under 10 minutes each. Unlocks in order.",
  },
  {
    num: "03",
    title: "Build lasting clarity",
    desc: "Develop sustainable mental performance habits that hold under real pressure, day after day.",
  },
];

export function FeatureGrid() {
  return (
    <>
      {/* ── Features ──────────────────────────────────────────────── */}
      {/* scroll-mt-20 (80px) offsets the sticky header on anchor navigation */}
      <section
        id="about"
        className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              What you get
            </p>
            <h2 className="mt-3 text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
              Built for performance,
              <br className="hidden sm:block" /> not habit tracking
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass flex h-full flex-col gap-4 rounded-card p-5 sm:p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-surface/80 text-accent">
                  {f.icon}
                </span>
                <div>
                  <h3 className="text-xl text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="scroll-mt-20 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      >
        {/* Subtle tint to visually separate from features section */}
        <div className="mx-auto max-w-6xl">
          <div className="glass relative rounded-4xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-accent2) 10%, transparent), transparent 70%)",
              }}
              aria-hidden
            />

            <div className="relative">
              <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                  The process
                </p>
                <h2 className="mt-3 text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
                  Three steps to
                  <br className="hidden sm:block" /> mental clarity
                </h2>
              </div>

              <div className="grid gap-8 md:grid-cols-3 md:gap-10">
                {steps.map((s) => (
                  <div key={s.num} className="flex flex-col gap-3">
                    <span className="font-display text-5xl leading-none text-accent sm:text-6xl">
                      {s.num}
                    </span>
                    <div>
                      <h3 className="text-xl text-ink">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────── */}
      <section className="px-4 pb-14 pt-0 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="glass relative rounded-card px-6 py-10 sm:px-8 sm:py-12">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-accent2) 16%, transparent), transparent 60%)",
              }}
              aria-hidden
            />
            <div className="relative grid gap-6 text-center md:grid-cols-3 md:gap-0">
              <div className="md:pr-8">
                <p className="font-display text-5xl leading-none text-ink sm:text-6xl">
                  5
                </p>
                <p className="mt-3 text-sm text-muted">Days to a clarity shift</p>
              </div>
              <div className="border-y border-border/40 py-6 md:border-x md:border-y-0 md:px-8 md:py-0">
                <p className="font-display text-5xl leading-none text-ink sm:text-6xl">
                  10
                </p>
                <p className="mt-3 text-sm text-muted">Minutes per session, max</p>
              </div>
              <div className="md:pl-8">
                <p className="font-display text-5xl leading-none text-ink sm:text-6xl">
                  ∞
                </p>
                <p className="mt-3 text-sm text-muted">Return on focused attention</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
