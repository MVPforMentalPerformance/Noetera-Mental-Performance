"use client";

import { cx } from "@/lib/cx";
import { useId, useState } from "react";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3.2 4.2l17.6 15.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M2.5 12s3.5-7 9.5-7c2.2 0 4.1.9 5.7 2.2M21.5 12s-3.5 7-9.5 7c-2.6 0-4.8-1.2-6.4-2.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.6 9.5a3.2 3.2 0 0 0 4.8 4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PasswordField({
  name,
  label,
  autoComplete,
  required,
  className,
}: {
  name: string;
  label: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}) {
  const id = useId();
  const [show, setShow] = useState(false);

  return (
    <label className={cx("flex cursor-pointer flex-col gap-1.5", className)}>
      <span className="field-label">{label}</span>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          className={cx("field-input w-full pr-11")}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl border border-transparent text-muted transition hover:bg-surface2/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </label>
  );
}

