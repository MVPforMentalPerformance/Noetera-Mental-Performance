import {
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  DEFAULT_THEME_MODE,
  THEME_STORAGE_KEY,
  type AccentPalette,
  type ThemeMode,
} from "@/lib/theme";

function getInitScript() {
  // Keep this as a string so it runs before React hydration.
  // It sets <html data-theme="light|dark" data-accent="..."> to avoid flashes.
  return `(function(){try{
var THEME_KEY=${JSON.stringify(THEME_STORAGE_KEY)};
var ACCENT_KEY=${JSON.stringify(ACCENT_STORAGE_KEY)};
var defaultMode=${JSON.stringify(DEFAULT_THEME_MODE)};
var defaultAccent=${JSON.stringify(DEFAULT_ACCENT)};
var mode=localStorage.getItem(THEME_KEY)||defaultMode;
var accent=localStorage.getItem(ACCENT_KEY)||defaultAccent;
var prefersDark=false;
try{prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;}catch(e){}
var resolved=(mode==='dark')?'dark':(mode==='light')?'light':(prefersDark?'dark':'light');
var root=document.documentElement;
root.dataset.theme=resolved;
root.dataset.accent=accent;
}catch(e){}})();`;
}

export function ThemeInitScript() {
  return <script dangerouslySetInnerHTML={{ __html: getInitScript() }} />;
}

export function applyThemeToRoot({
  mode,
  accent,
}: {
  mode: ThemeMode;
  accent: AccentPalette;
}) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  const resolved = mode === "system" ? (prefersDark ? "dark" : "light") : mode;
  root.dataset.theme = resolved;
  root.dataset.accent = accent;
}

