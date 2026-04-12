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
        "w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
