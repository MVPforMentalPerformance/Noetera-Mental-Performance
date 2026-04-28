"use client";

import { cx } from "@/lib/cx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: (props: { active: boolean }) => ReactNode;
  activeWhenStartsWith?: string;
};

const items: NavItem[] = [
  {
    href: "/dashboard",
    label: "Home",
    activeWhenStartsWith: "/dashboard",
    icon: ({ active }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3.2l8.2 7.1v10.6c0 .9-.7 1.6-1.6 1.6h-4.4v-6.9H9.8v6.9H5.4c-.9 0-1.6-.7-1.6-1.6V10.3L12 3.2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          opacity={active ? 1 : 0.78}
        />
      </svg>
    ),
  },
  {
    href: "/assessment",
    label: "Assess",
    activeWhenStartsWith: "/assessment",
    icon: ({ active }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 5.5h10c1 0 1.8.8 1.8 1.8v11.4c0 1-.8 1.8-1.8 1.8H7c-1 0-1.8-.8-1.8-1.8V7.3c0-1 .8-1.8 1.8-1.8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          opacity={active ? 1 : 0.78}
        />
        <path
          d="M8.3 9.2h7.4M8.3 12h7.4M8.3 14.8h4.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity={active ? 1 : 0.78}
        />
      </svg>
    ),
  },
  {
    href: "/program",
    label: "Plan",
    activeWhenStartsWith: "/program",
    icon: ({ active }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 5.5h10c1 0 1.8.8 1.8 1.8v11.4c0 1-.8 1.8-1.8 1.8H7c-1 0-1.8-.8-1.8-1.8V7.3c0-1 .8-1.8 1.8-1.8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          opacity={active ? 1 : 0.78}
        />
        <path
          d="M8.2 9h7.6M8.2 12h7.6M8.2 15h5.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity={active ? 1 : 0.78}
        />
      </svg>
    ),
  },
  {
    href: "/insights",
    label: "Insights",
    activeWhenStartsWith: "/insights",
    icon: ({ active }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6.5 17.5V12.8M12 17.5V9.2M17.5 17.5V14.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity={active ? 1 : 0.78}
        />
        <path
          d="M5.3 19.2h13.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity={active ? 1 : 0.78}
        />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    activeWhenStartsWith: "/profile",
    icon: ({ active }) => (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 12.2c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          opacity={active ? 1 : 0.78}
        />
        <path
          d="M5.5 20.4c1.6-3 4-4.4 6.5-4.4s4.9 1.4 6.5 4.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity={active ? 1 : 0.78}
        />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto w-full max-w-lg px-2.5 pb-[calc(env(safe-area-inset-bottom)+0.7rem)] sm:px-6">
        <div className="grid grid-cols-5 gap-1.5 rounded-[1.65rem] border border-border/90 bg-(--color-glass) p-1.5 shadow-[0_-18px_55px_-42px_var(--color-shadow)] backdrop-blur-md">
          {items.map((item) => {
            const active = item.activeWhenStartsWith
              ? pathname.startsWith(item.activeWhenStartsWith)
              : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "group relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[1.25rem] px-2 py-2.5 text-[11px] font-semibold no-underline transition",
                  active
                    ? "text-accentInk"
                    : "text-muted hover:text-ink",
                )}
              >
                <span
                  className={cx(
                    "pointer-events-none absolute inset-0 rounded-[1.25rem] transition",
                    active
                      ? "bg-linear-to-r from-accent to-accent2 shadow-[0_16px_44px_-34px_var(--color-shadow),0_0_28px_-16px_color-mix(in_srgb,var(--color-accent2)_55%,transparent)]"
                      : "bg-transparent",
                  )}
                />
                <span className="relative grid place-items-center">{item.icon({ active })}</span>
                <span className="relative leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
