import { AppCard } from "@/components/app-card";
import { PasswordField } from "@/components/password-field";
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
      <AppCard className="relative overflow-hidden rounded-4xl">
        <div className="relative">
          <div className="inline-flex rounded-full border border-border/80 bg-surface/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Member access
          </div>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Welcome back
          </p>
          <h1 className="mt-2 text-[2.9rem] leading-[0.95] text-ink">Sign in</h1>
          <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-muted">
            Continue your Mental Clarity practice and return to your dashboard with a
            calmer, cleaner workspace.
          </p>

          {error ? (
            <p className="mt-4 rounded-2xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error === "invalid" ? "Please enter email and password." : error}
            </p>
          ) : null}

          <form action={signInAction} className="mt-7 flex flex-col gap-4">
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
              autoComplete="current-password"
              required
            />
            <div className="mt-2 flex flex-col gap-3">
              <PrimaryButton type="submit" className="text-white">
                Sign in
              </PrimaryButton>
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="rounded-2xl border border-border/80 bg-surface/70 px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Access
                  </p>
                  <p className="mt-1 text-sm text-ink">Dashboard</p>
                </div>
                <div className="rounded-2xl border border-border/80 bg-surface/70 px-3 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Flow
                  </p>
                  <p className="mt-1 text-sm text-ink">Assessment + Program</p>
                </div>
              </div>
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
