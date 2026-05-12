"use client";

import { cx } from "@/lib/cx";
import Link from "next/link";
import type { ReactNode } from "react";

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 6.8l6 5.2-6 5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function ListRow({
  icon,
  title,
  subtitle,
  subtitleWrap,
  right,
  href,
  onClick,
  className,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  subtitleWrap?: boolean;
  right?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const content = (
    <div
      className={cx(
        "glass flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-[0_18px_55px_-52px_var(--color-shadow)] transition hover:bg-(--color-glass2)",
        className,
      )}
    >
      {icon ? <span className="grid h-10 w-10 place-items-center rounded-2xl bg-(--color-glass2)">{icon}</span> : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{title}</p>
        {subtitle ? (
          <p
            className={cx(
              "mt-0.5 text-xs text-muted",
              subtitleWrap ? "whitespace-normal wrap-break-word leading-relaxed" : "truncate",
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
      {href || onClick ? (
        <span className="shrink-0 text-muted">
          <ChevronRight />
        </span>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block cursor-pointer no-underline">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" className="block w-full cursor-pointer bg-transparent text-left" onClick={onClick}>
        {content}
      </button>
    );
  }

  return content;
}

