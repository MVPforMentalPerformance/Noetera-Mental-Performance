"use client";

import { cx } from "@/lib/cx";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  activeWhenStartsWith?: string;
};

const items: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", activeWhenStartsWith: "/dashboard" },
  { href: "/program", label: "Program", activeWhenStartsWith: "/program" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto w-full max-w-lg px-2.5 pb-[calc(env(safe-area-inset-bottom)+0.7rem)] sm:px-6">
        <div className="grid grid-cols-2 gap-2 rounded-[1.45rem] border border-border/90 bg-surface/95 p-2 shadow-[0_-18px_55px_-42px_var(--color-shadow)] backdrop-blur-sm">
          {items.map((item) => {
            const active = item.activeWhenStartsWith
              ? pathname.startsWith(item.activeWhenStartsWith)
              : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold no-underline transition",
                  active
                    ? "border-transparent bg-linear-to-r from-accent to-accent2 text-accentInk shadow-[0_16px_44px_-34px_var(--color-shadow)]"
                    : "border-border bg-surface text-muted hover:border-border/80 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
