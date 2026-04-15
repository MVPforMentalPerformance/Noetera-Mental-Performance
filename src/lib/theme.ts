export type ThemeMode = "system" | "light" | "dark";
export type AccentPalette = "earth" | "premium" | "ocean" | "forest" | "custom";

export const THEME_STORAGE_KEY = "noetera.theme.mode";
export const ACCENT_STORAGE_KEY = "noetera.theme.accent";

export const DEFAULT_THEME_MODE: ThemeMode = "system";
export const DEFAULT_ACCENT: AccentPalette = "earth";

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export function isAccentPalette(value: unknown): value is AccentPalette {
  return (
    value === "earth" ||
    value === "premium" ||
    value === "ocean" ||
    value === "forest" ||
    value === "custom"
  );
}

