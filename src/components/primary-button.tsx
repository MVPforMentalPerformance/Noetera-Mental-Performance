import { cx } from "@/lib/cx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = {
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({
  children,
  className,
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "w-full cursor-pointer rounded-2xl border border-transparent bg-linear-to-r from-accent to-accent2 px-4 py-3.5 text-sm font-semibold text-accentInk shadow-[0_22px_55px_-38px_var(--color-shadow)] transition",
        "hover:-translate-y-0.5 hover:brightness-[1.03] active:translate-y-0 active:brightness-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
