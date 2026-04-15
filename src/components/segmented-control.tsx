"use client";

import { cx } from "@/lib/cx";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Segmented control"
      className={cx(
        "glass grid gap-1 rounded-[1.2rem] p-1 shadow-[0_20px_60px_-52px_var(--color-shadow)]",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${Math.max(options.length, 1)}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "cursor-pointer rounded-2xl px-3 py-2 text-xs font-semibold tracking-tight transition",
              active
                ? "bg-(--color-glass2) text-ink shadow-[0_16px_44px_-40px_var(--color-shadow)]"
                : "bg-transparent text-muted hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

