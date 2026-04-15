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
        "relative flex min-h-full flex-1 flex-col overflow-hidden bg-canvas px-2.5 py-10 sm:px-6 sm:py-14",
        className,
      )}
    >
      <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-accent2)_30%,transparent)_0%,transparent_72%)]" />
      <div className="pointer-events-none absolute -right-28 bottom-8 h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-canvasGlow)_85%,transparent)_0%,transparent_72%)]" />
      {showHeader ? (
        <header className="page-fade relative mx-auto mb-6 flex w-full max-w-lg items-center gap-3 sm:mb-8">
          {headerStart ? (
            <span className="shrink-0 text-sm text-muted">{headerStart}</span>
          ) : null}
          {title ? (
            <h1 className="text-xl font-semibold tracking-tight text-ink">
              {title}
            </h1>
          ) : null}
        </header>
      ) : null}
      <div className="relative flex flex-1 flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
