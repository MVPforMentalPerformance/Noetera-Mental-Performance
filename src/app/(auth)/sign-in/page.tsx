import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { TextLink } from "@/components/text-link";
import { signInAction } from "../_actions";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const { error } = (await searchParams) ?? {};

  return (
    <main className="flex w-full max-w-md flex-col gap-6">
      <AppCard className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_240px_at_16%_0,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_58%)]" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Welcome back
          </p>
          <h1 className="mt-2 text-4xl leading-[1.05] text-ink">Sign in</h1>
          <p className="mt-3 text-sm text-muted">
            Continue your Mental Clarity sessions and keep your streak alive.
          </p>

          {error ? (
            <p className="mt-4 rounded-2xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error === "invalid" ? "Please enter email and password." : error}
            </p>
          ) : null}

          <form action={signInAction} className="mt-6 flex flex-col gap-4">
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
            <label className="flex cursor-pointer flex-col gap-1.5">
              <span className="field-label">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="field-input"
              />
            </label>
            <div className="mt-2 flex flex-col gap-3">
              <PrimaryButton type="submit">Sign in</PrimaryButton>
              <div className="flex flex-col items-center gap-2 text-center">
                <TextLink href="/forgot-password" className="text-sm">
                  Forgot password?
                </TextLink>
                <p className="text-xs text-muted">
                  No account yet?{" "}
                  <TextLink href="/sign-up" className="text-xs">
                    Create one
                  </TextLink>
                </p>
              </div>
            </div>
          </form>
        </div>
      </AppCard>
    </main>
  );
}
