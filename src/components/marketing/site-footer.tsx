import Link from "next/link";

type SiteFooterProps = {
  isAuthenticated?: boolean;
};

export function SiteFooter({ isAuthenticated = false }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const primaryAction = isAuthenticated
    ? { href: "/program", label: "Continue program" }
    : { href: "/sign-up", label: "Start for free" };
  const secondaryAction = isAuthenticated
    ? { href: "/dashboard", label: "Open dashboard" }
    : { href: "/sign-in", label: "Log in" };
  const footerLinks = isAuthenticated
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/program", label: "Program" },
      ]
    : [
        { href: "/sign-in", label: "Log in" },
        { href: "/sign-up", label: "Sign up" },
      ];

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
              {isAuthenticated ? "Ready to return to your next session?" : "Ready to perform with clarity?"}
            </h2>
            <p className="mx-auto mt-3 max-w-[40ch] text-sm leading-relaxed text-muted">
              {isAuthenticated
                ? "Pick up your routine, review your dashboard, and keep your cadence gentle."
                : "Five days. One session a day. A different relationship with pressure."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                href={primaryAction.href}
                className="rounded-2xl bg-linear-to-r from-accent to-accent2 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_18px_45px_-30px_var(--color-shadow)] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
              >
                {primaryAction.label}
              </Link>
              <Link
                href={secondaryAction.href}
                className="rounded-2xl border border-border/90 bg-surface/90 px-8 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-surface2/90 active:translate-y-0"
              >
                {secondaryAction.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer bottom row */}
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
          <Link href="/#top" className="flex flex-col gap-px">
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
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-muted/50">© {year} NOETERA</p>
        </div>
      </div>
    </footer>
  );
}
