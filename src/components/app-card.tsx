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
        "glass page-fade w-full rounded-card px-5 py-6 sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
