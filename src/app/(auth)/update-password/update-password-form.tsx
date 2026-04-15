"use client";

import { PrimaryButton } from "@/components/primary-button";
import { TextLink } from "@/components/text-link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const supabase = createClient();

    (async () => {
      const search = new URLSearchParams(window.location.search);
      const code = search.get("code");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!alive) return;
        if (exchangeError) {
          setError(exchangeError.message);
          setLoading(false);
          return;
        }
        window.history.replaceState({}, "", "/update-password");
        setReady(true);
        setLoading(false);
        return;
      }

      const { data: first } = await supabase.auth.getSession();
      if (!alive) return;
      if (first.session) {
        setReady(true);
        setLoading(false);
        return;
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!alive) return;
        if (session) {
          setReady(true);
          setLoading(false);
        }
      });

      await new Promise((r) => setTimeout(r, 150));
      const { data: second } = await supabase.auth.getSession();
      if (!alive) return;
      if (second.session) {
        setReady(true);
        setLoading(false);
        subscription.unsubscribe();
        return;
      }

      await new Promise((r) => setTimeout(r, 900));
      const { data: third } = await supabase.auth.getSession();
      if (!alive) return;
      if (third.session) {
        setReady(true);
        setLoading(false);
        subscription.unsubscribe();
        return;
      }

      setError(
        "This reset link is invalid or expired. Request a new one from Forgot password.",
      );
      setLoading(false);
      subscription.unsubscribe();
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const password = String(new FormData(form).get("password") ?? "");
    const confirmPassword = String(new FormData(form).get("confirmPassword") ?? "");

    if (!password || password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <h1 className="text-4xl leading-[1.05] text-ink">Set new password</h1>
        <p className="text-sm text-muted">Verifying your reset link…</p>
      </div>
    );
  }

  if (!ready && error) {
    return (
      <div className="space-y-4">
        <h1 className="text-4xl leading-[1.05] text-ink">Set new password</h1>
        <p className="rounded-2xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
        <TextLink href="/forgot-password" className="text-sm">
          Request a new link
        </TextLink>
        <TextLink href="/sign-in" className="block text-center text-sm">
          Back to sign in
        </TextLink>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-4xl leading-[1.05] text-ink">Set new password</h1>
      <p className="text-sm text-muted">
        Create a new password to continue your training plan.
      </p>

      {error ? (
        <p className="rounded-2xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex cursor-pointer flex-col gap-1.5">
          <span className="field-label">New password</span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="field-input"
          />
        </label>
        <label className="flex cursor-pointer flex-col gap-1.5">
          <span className="field-label">Confirm password</span>
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="field-input"
          />
        </label>
        <div className="mt-2 flex flex-col gap-3">
          <PrimaryButton type="submit">Update password</PrimaryButton>
          <TextLink href="/sign-in" className="text-center text-sm">
            Back to sign in
          </TextLink>
        </div>
      </form>
    </div>
  );
}
