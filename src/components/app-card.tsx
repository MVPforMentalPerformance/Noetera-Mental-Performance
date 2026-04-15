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
        "page-fade w-full rounded-card border border-border/90 bg-(--color-glass) px-[18px] py-6 shadow-[0_24px_64px_-48px_var(--color-shadow)] backdrop-blur-md sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
