"use client";

import { cx } from "@/lib/cx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function IconButton({
  children,
  className,
  variant = "glass",
  size = "lg",
  ...props
}: {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "accent";
  size?: "md" | "lg";
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizes =
    size === "md" ? "h-11 w-11 rounded-full" : "h-14 w-14 rounded-full";

  return (
    <button
      type="button"
      className={cx(
        "grid cursor-pointer place-items-center transition hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-45",
        sizes,
        variant === "accent"
          ? "bg-linear-to-r from-accent to-accent2 text-accentInk shadow-[0_22px_48px_-34px_var(--color-shadow)]"
          : "glass text-ink shadow-[0_18px_42px_-38px_var(--color-shadow)] hover:bg-(--color-glass2)",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

