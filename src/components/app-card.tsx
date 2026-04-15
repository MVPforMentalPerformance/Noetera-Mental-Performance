import { cx } from "@/lib/cx";
import type { ReactNode } from "react";

type AppCardProps = {
  children: ReactNode;
  className?: string;
};

export function AppCard({ children, className }: AppCardProps) {
  return (
    <div
      className={cx(
        "page-fade w-full rounded-3xl border border-border/90 bg-surface/95 px-[18px] py-6 shadow-[0_24px_64px_-48px_var(--color-shadow)] backdrop-blur-[1.5px] sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
