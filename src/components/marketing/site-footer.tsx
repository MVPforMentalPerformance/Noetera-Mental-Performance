import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="border-t border-border/30 px-4 py-12 sm:px-6 sm:py-14"
    >
      <div className="mx-auto max-w-6xl">
        {/* Final CTA banner */}
        <div className="glass relative mb-12 rounded-card px-5 py-10 text-center sm:mb-14 sm:px-8 sm:py-12">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-accent2) 12%, transparent), transparent 58%)",
            }}
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-3xl leading-tight text-ink sm:text-4xl">
              Ready to perform with clarity?
            </h2>
            <p className="mx-auto mt-3 max-w-[40ch] text-sm leading-relaxed text-muted">
              Five days. One session a day. A different relationship with pressure.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                href="/sign-up"
                className="rounded-2xl bg-linear-to-r from-accent to-accent2 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_45px_-30px_var(--color-shadow)] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
              >
                Start for free
              </Link>
              <Link
                href="/sign-in"
                className="rounded-2xl border border-border/90 bg-surface/90 px-8 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-surface2/90 active:translate-y-0"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>

        {/* Footer bottom row */}
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
          <Link href="/" className="flex flex-col gap-px">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
              Mental Clarity
            </span>
            <span className="text-lg text-ink">NOETERA</span>
          </Link>

          <nav
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:gap-x-7"
            aria-label="Footer navigation"
          >
            <a href="#about" className="text-sm text-muted transition-colors hover:text-ink">
              About
            </a>
            <a href="#how-it-works" className="text-sm text-muted transition-colors hover:text-ink">
              How it works
            </a>
            <a
              href="mailto:hello@noetera.com"
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              hello@noetera.com
            </a>
            <Link href="/sign-in" className="text-sm text-muted transition-colors hover:text-ink">
              Log in
            </Link>
            <Link href="/sign-up" className="text-sm text-muted transition-colors hover:text-ink">
              Sign up
            </Link>
          </nav>

          <p className="text-xs text-muted/50">© {year} NOETERA</p>
        </div>
      </div>
    </footer>
  );
}
