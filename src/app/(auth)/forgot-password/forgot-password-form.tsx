"use client";

import { PrimaryButton } from "@/components/primary-button";
import { TextLink } from "@/components/text-link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
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

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${origin}/update-password` },
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    router.push("/check-email");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      {error ? (
        <p className="rounded-2xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
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
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send link"}
        </PrimaryButton>
        <TextLink href="/sign-in" className="text-center text-sm">
          Back to sign in
        </TextLink>
      </div>
    </form>
  );
}

