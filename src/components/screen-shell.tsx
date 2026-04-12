import { cx } from "@/lib/cx";
import type { ReactNode } from "react";

type ScreenShellProps = {
  children: ReactNode;
  className?: string;
  /** Optional top title (wireframe: short screen title). */
  title?: string;
  /** Optional left control, e.g. back affordance (layout only until M2+). */
  headerStart?: ReactNode;
};

export function ScreenShell({
  children,
  className,
  title,
  headerStart,
}: ScreenShellProps) {
  const showHeader = headerStart != null || title != null;

  return (
    <div
      className={cx(
        "flex min-h-full flex-1 flex-col bg-zinc-50 px-6 py-16",
        className,
      )}
    >
      {showHeader ? (
        <header className="mx-auto mb-8 flex w-full max-w-md items-center gap-3">
          {headerStart ? (
            <span className="shrink-0 text-sm text-zinc-600">{headerStart}</span>
          ) : null}
          {title ? (
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
              {title}
            </h1>
          ) : null}
        </header>
      ) : null}
      <div className="flex flex-1 flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
