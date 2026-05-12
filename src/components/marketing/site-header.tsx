"use client";

import { cx } from "@/lib/cx";
import Link from "next/link";
import { useEffect, useState } from "react";

const marketingLinks = [
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#contact", label: "Contact" },
] as const;

type SiteHeaderProps = {
  isAuthenticated?: boolean;
};

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      {open ? (
        <path
          d="M6.8 6.8 17.2 17.2M17.2 6.8 6.8 17.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path d="M4.5 7.5h15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          <path d="M4.5 12h15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          <path d="M4.5 16.5h15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function SiteHeader({ isAuthenticated = false }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const secondaryAction = isAuthenticated
    ? { href: "/dashboard", label: "Dashboard" }
    : { href: "/sign-in", label: "Log in" };
  const primaryAction = isAuthenticated
    ? { href: "/program", compactLabel: "Continue", label: "Continue program" }
    : { href: "/sign-up", compactLabel: "Sign up", label: "Sign up free" };

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleMobileSectionClick(href: string) {
    const targetId = href.replace(/^#/, "");
    closeMenu();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const target = document.getElementById(targetId);
        if (!target) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });

        if (window.location.hash !== href) {
          window.history.pushState(null, "", href);
        }
      });
    });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-border/50 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 sm:py-4">
        <Link
          href="/#top"
          onClick={closeMenu}
          className="group flex shrink-0 flex-col gap-0.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted transition-colors group-hover:text-accent">
            Mental Performance
          </span>
          <span className="text-lg leading-none text-ink sm:text-xl">NOETERA</span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Main navigation">
          {marketingLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-muted transition-colors hover:bg-surface/85 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={secondaryAction.href}
            className="hidden text-sm font-semibold text-muted transition-colors hover:text-ink md:block"
          >
            {secondaryAction.label}
          </Link>
          <Link
            href={primaryAction.href}
            className="rounded-full bg-linear-to-r from-accent to-accent2 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_8px_24px_-12px_var(--color-shadow)] transition hover:-translate-y-px hover:brightness-105 active:translate-y-0 sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">{primaryAction.compactLabel}</span>
            <span className="hidden sm:inline">{primaryAction.label}</span>
          </Link>
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-site-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="glass grid h-11 w-11 place-items-center rounded-full text-ink transition hover:bg-(--color-glass2) lg:hidden"
          >
            <MenuIcon open={isMenuOpen} />
          </button>
        </div>
      </div>

      <div
        className={cx(
          "absolute inset-x-0 top-full border-b border-border/40 bg-canvas/92 backdrop-blur-xl transition duration-200 lg:hidden",
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="mx-auto max-w-6xl px-4 pb-5 pt-3 sm:px-6">
          <div
            id="mobile-site-menu"
            className={cx(
              "glass overflow-hidden rounded-[1.75rem] px-4 py-4 shadow-[0_28px_70px_-48px_var(--color-shadow)] transition duration-200",
              isMenuOpen ? "translate-y-0" : "-translate-y-2",
            )}
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {marketingLinks.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => handleMobileSectionClick(item.href)}
                  className="rounded-2xl px-3 py-3 text-left text-sm font-semibold text-ink transition hover:bg-surface/75"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-4 h-px w-full bg-border/60" />

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href={secondaryAction.href}
                onClick={closeMenu}
                className="rounded-2xl border border-border/80 bg-surface/85 px-4 py-3 text-center text-sm font-semibold text-ink transition hover:bg-surface2/85"
              >
                {secondaryAction.label}
              </Link>
              <Link
                href={primaryAction.href}
                onClick={closeMenu}
                className="rounded-2xl bg-linear-to-r from-accent to-accent2 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_18px_40px_-30px_var(--color-shadow)] transition hover:brightness-105"
              >
                {primaryAction.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
