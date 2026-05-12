"use client";

import { applyThemeToRoot } from "@/components/theme-init-script";
import { SegmentedControl } from "@/components/segmented-control";
import { cx } from "@/lib/cx";
import {
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  DEFAULT_THEME_MODE,
  THEME_STORAGE_KEY,
  type AccentPalette,
  type ThemeMode,
  isAccentPalette,
  isThemeMode,
} from "@/lib/theme";
import { useEffect, useMemo, useState } from "react";

const themeOptions = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

const accentOptions: { value: AccentPalette; label: string; swatch: string }[] = [
  { value: "earth", label: "Earth", swatch: "from-[#b16b3d] to-[#e7c29e]" },
  { value: "premium", label: "Premium", swatch: "from-[#6f7b97] to-[#dbe4f2]" },
  { value: "ocean", label: "Ocean", swatch: "from-[#4bb0ff] to-[#27e3d0]" },
  { value: "forest", label: "Forest", swatch: "from-[#62d67d] to-[#b7f07a]" },
  { value: "custom", label: "Custom", swatch: "from-[#ff6b9a] to-[#ffb86b]" },
];

function readStoredMode(): ThemeMode {
  const raw = typeof window !== "undefined" ? localStorage.getItem(THEME_STORAGE_KEY) : null;
  return isThemeMode(raw) ? raw : DEFAULT_THEME_MODE;
}

function readStoredAccent(): AccentPalette {
  const raw = typeof window !== "undefined" ? localStorage.getItem(ACCENT_STORAGE_KEY) : null;
  return isAccentPalette(raw) ? raw : DEFAULT_ACCENT;
}

export function ThemeControls({ className }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredMode());
  const [accent, setAccent] = useState<AccentPalette>(() => readStoredAccent());

  useEffect(() => {
    applyThemeToRoot({ mode, accent });

    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeToRoot({ mode, accent });
    media?.addEventListener?.("change", onChange);
    return () => media?.removeEventListener?.("change", onChange);
  }, [mode, accent]);

  const segmented = useMemo(
    () => themeOptions.map((o) => ({ value: o.value as ThemeMode, label: o.label })),
    [],
  );

  function persist(nextMode: ThemeMode, nextAccent: AccentPalette) {
    localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    localStorage.setItem(ACCENT_STORAGE_KEY, nextAccent);
    applyThemeToRoot({ mode: nextMode, accent: nextAccent });
  }

  return (
    <div className={cx("flex flex-col gap-4", className)}>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Appearance</p>
        <div className="mt-3">
          <SegmentedControl
            value={mode}
            onChange={(next) => {
              setMode(next);
              persist(next, accent);
            }}
            options={segmented}
          />
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Accent</p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {accentOptions.map((opt) => {
            const active = opt.value === accent;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setAccent(opt.value);
                  persist(mode, opt.value);
                }}
                className={cx(
                  "glass grid cursor-pointer place-items-center gap-1 rounded-2xl px-2 py-2.5 text-[10px] font-semibold text-muted transition hover:-translate-y-0.5 hover:text-ink",
                  active ? "ring-2 ring-accent/40" : "ring-2 ring-transparent",
                )}
                aria-pressed={active}
              >
                <span className={cx("h-6 w-6 rounded-full bg-linear-to-br", opt.swatch)} />
                <span className={cx("leading-none", active ? "text-ink" : "text-muted")}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

