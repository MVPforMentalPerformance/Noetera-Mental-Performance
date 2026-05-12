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
        "relative flex min-h-full flex-1 flex-col bg-canvas px-4 py-8 sm:px-6 sm:py-10",
        className,
      )}
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] lg:gap-14">
          <section className="page-fade order-2 hidden flex-col justify-center lg:order-1 lg:flex">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                Mental Performance Platform
              </p>
              <h2 className="mt-5 max-w-[12ch] text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.92] text-ink">
                Clean focus for calm performance.
              </h2>
              <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-muted">
                A quieter, more premium space to assess your mental state, build consistency,
                and return to pressure with clarity.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="glass rounded-3xl px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Program
                  </p>
                  <p className="mt-2 text-2xl text-ink">5 days</p>
                </div>
                <div className="glass rounded-3xl px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Session
                  </p>
                  <p className="mt-2 text-2xl text-ink">10 min</p>
                </div>
                <div className="glass rounded-3xl px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Outcome
                  </p>
                  <p className="mt-2 text-2xl text-ink">Clarity</p>
                </div>
              </div>
            </div>
          </section>

          <div className="order-1 flex flex-col lg:order-2">
            {showHeader ? (
              <header className="page-fade mx-auto mb-5 flex w-full max-w-md items-center gap-3 sm:mb-6">
                {headerStart ? (
                  <span className="shrink-0 text-sm text-muted">{headerStart}</span>
                ) : null}
                {title ? (
                  <h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>
                ) : null}
              </header>
            ) : null}
            <div className="relative flex flex-1 flex-col items-center justify-center">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
