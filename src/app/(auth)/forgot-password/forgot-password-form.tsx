"use client";

import { PrimaryButton } from "@/components/primary-button";
import { TextLink } from "@/components/text-link";
import { cx } from "@/lib/cx";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

const COOLDOWN_SEC = 45;

function looksLikeRateLimitMessage(message: string) {
  const m = message.toLowerCase();
  return (
    m.includes("rate limit") ||
    m.includes("too many") ||
    m.includes("429") ||
    /after \d+ seconds?/i.test(message) ||
    m.includes("email rate limit")
  );
}

function formatPasswordResetError(message: string): { text: string; soft: boolean } {
  if (looksLikeRateLimitMessage(message)) {
    return {
      text: "Too many reset attempts. Please wait about a minute before requesting another link.",
      soft: true,
    };
  }
  return { text: message, soft: false };
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [errorSoft, setErrorSoft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);

  useEffect(() => {
    if (cooldownSec <= 0) return;
    const id = window.setInterval(() => {
      setCooldownSec((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldownSec]);

  function startCooldown() {
    setCooldownSec(COOLDOWN_SEC);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || cooldownSec > 0) return;

    setError(null);
    setErrorSoft(false);
    setLoading(true);

    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!email) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const origin = window.location.origin;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/update-password`,
    });

    setLoading(false);
    startCooldown();

    if (resetError) {
      const { text, soft } = formatPasswordResetError(resetError.message);
      setError(text);
      setErrorSoft(soft);
      return;
    }

    router.push("/check-email");
  }

  const blocked = loading || cooldownSec > 0;

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      {error ? (
        <p
          className={cx(
            "rounded-2xl border px-4 py-3 text-sm",
            errorSoft
              ? "border-accent/25 bg-(--bg-accent-wash) text-ink"
              : "border-danger/25 bg-danger/10 text-danger",
          )}
        >
          {error}
        </p>
      ) : null}

      <label className="flex cursor-pointer flex-col gap-1.5">
        <span className="field-label">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="field-input"
        />
      </label>

      <div className="mt-2 flex flex-col gap-3">
        <PrimaryButton type="submit" disabled={blocked}>
          {loading ? "Sending…" : cooldownSec > 0 ? `Wait ${cooldownSec}s…` : "Send link"}
        </PrimaryButton>
        {cooldownSec > 0 && !loading ? (
          <p className="text-center text-sm text-muted">Please wait before trying again.</p>
        ) : null}
        <TextLink href="/sign-in" className="text-center text-sm">
          Back to sign in
        </TextLink>
      </div>
    </form>
  );
}
