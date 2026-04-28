import { AppCard } from "@/components/app-card";
import { PasswordField } from "@/components/password-field";
import { PrimaryButton } from "@/components/primary-button";
import { TextLink } from "@/components/text-link";
import { signUpAction } from "../_actions";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const { error } = (await searchParams) ?? {};

  return (
    <main className="flex w-full max-w-md flex-col gap-6">
      <AppCard className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_240px_at_14%_0,color-mix(in_srgb,var(--color-accent2)_20%,transparent),transparent_60%)]" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Mental Clarity
          </p>
          <h1 className="mt-2 text-4xl leading-[1.05] text-ink">Create account</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Start your 5-day focus reset and build a steadier mental baseline.
          </p>

          {error ? (
            <p className="mt-4 rounded-2xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error === "invalid"
                ? "Please enter a valid email and matching passwords."
                : error}
            </p>
          ) : null}

          <form action={signUpAction} className="mt-6 flex flex-col gap-4">
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
            <PasswordField
              name="password"
              label="Password"
              autoComplete="new-password"
              required
            />
            <PasswordField
              name="confirmPassword"
              label="Confirm password"
              autoComplete="new-password"
              required
            />

            <div className="mt-2 flex flex-col gap-3">
              <PrimaryButton type="submit">Sign up</PrimaryButton>
              <p className="text-center text-xs text-muted">
                Already with us?{" "}
                <TextLink href="/sign-in" className="text-xs">
                  Sign in
                </TextLink>
              </p>
            </div>
          </form>
        </div>
      </AppCard>
    </main>
  );
}
