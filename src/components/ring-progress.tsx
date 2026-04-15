import { cx } from "@/lib/cx";
import { useId, type CSSProperties, type ReactNode } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function RingProgress({
  value,
  size = 120,
  stroke = 12,
  trackColor,
  showShadow = true,
  className,
  style,
  children,
}: {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  trackColor?: string;
  showShadow?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const pct = clamp(value, 0, 100);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;
  const gradientId = useId();

  return (
    <div
      className={cx(
        "relative grid place-items-center rounded-full",
        className,
      )}
      style={{ width: size, height: size, ...style }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="var(--color-accent2)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor ?? "var(--color-ringTrack)"}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            filter: showShadow ? "drop-shadow(0 10px 22px var(--color-ringShadow))" : "none",
            transition: "stroke-dasharray 420ms ease",
          }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        {children}
      </div>
    </div>
  );
}

