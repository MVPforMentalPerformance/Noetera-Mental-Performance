import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { getUserOrNull } from "@/lib/program/server";
import { redirect } from "next/navigation";
import { saveDisplayNameAction } from "./_actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const { user } = await getUserOrNull();
  if (!user) redirect("/sign-in");

  const { error } = (await searchParams) ?? {};

  return (
    <main className="flex flex-col gap-6">
      <AppCard className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_260px_at_10%_0,color-mix(in_srgb,var(--color-accent)_22%,transparent),transparent_58%)]" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            One quick thing
          </p>
          <h1 className="mt-2 text-4xl leading-[1.05] text-ink">What should we call you?</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Your name will appear on your profile. You can change it any time.
          </p>

          {error ? (
            <p className="mt-4 rounded-2xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error === "required"
                ? "Please enter your name to continue."
                : error === "toolong"
                  ? "Name must be 60 characters or fewer."
                  : error}
            </p>
          ) : null}

          <form action={saveDisplayNameAction} className="mt-6 flex flex-col gap-4">
            <label className="flex cursor-pointer flex-col gap-1.5">
              <span className="field-label">Your name</span>
              <input
                name="displayName"
                type="text"
                autoComplete="given-name"
                autoFocus
                maxLength={60}
                required
                className="field-input"
                placeholder="e.g. Alex"
              />
            </label>
            <div className="mt-2">
              <PrimaryButton type="submit">Continue</PrimaryButton>
            </div>
          </form>
        </div>
      </AppCard>
    </main>
  );
}
