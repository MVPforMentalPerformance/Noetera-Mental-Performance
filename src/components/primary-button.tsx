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
        "w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors",
        "hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900",
        "disabled:pointer-events-none disabled:opacity-45",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
