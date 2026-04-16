import { cx } from "@/lib/cx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type SecondaryButtonProps = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function SecondaryButton({ children, className, type = "button", ...props }: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "w-full cursor-pointer rounded-2xl border border-border/90 bg-surface2/70 px-4 py-3.5 text-sm font-semibold text-ink shadow-[0_18px_44px_-44px_var(--color-shadow)] transition",
        "hover:-translate-y-0.5 hover:bg-surface2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

