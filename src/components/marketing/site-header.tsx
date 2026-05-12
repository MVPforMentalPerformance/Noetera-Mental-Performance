import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 sm:py-4">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 flex-col gap-0.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted transition-colors group-hover:text-accent">
            Mental Performance
          </span>
          <span className="text-lg leading-none text-ink sm:text-xl">NOETERA</span>
        </Link>

        {/* Nav links – hidden on mobile */}
        <nav className="hidden items-center gap-2 lg:flex" aria-label="Main navigation">
          <a
            href="#about"
            className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-surface/85 hover:text-ink"
          >
            About
          </a>
          <a
            href="#how-it-works"
            className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-surface/85 hover:text-ink"
          >
            How it works
          </a>
          <a
            href="#contact"
            className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-surface/85 hover:text-ink"
          >
            Contact
          </a>
        </nav>

        {/* Auth buttons */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-sm font-semibold text-muted transition-colors hover:text-ink md:block"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-linear-to-r from-accent to-accent2 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_8px_24px_-12px_var(--color-shadow)] transition hover:-translate-y-px hover:brightness-105 active:translate-y-0 sm:px-4 sm:text-sm"
          >
            Sign up free
          </Link>
        </div>
      </div>
    </header>
  );
}
