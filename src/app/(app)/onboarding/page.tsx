import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { TextLink } from "@/components/text-link";
import { PROFILE_COPY } from "@/lib/npp/copy";
import { getLatestNppAssessmentResultForUser } from "@/lib/npp/server";
import { getUserOrNull } from "@/lib/program/server";
import { getUserProfile } from "@/lib/program/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { saveDisplayNameAction } from "./_actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const { user, supabase } = await getUserOrNull();
  if (!user) redirect("/sign-in");

  const { error } = (await searchParams) ?? {};

  const profile = await getUserProfile(user.id, supabase);
  const latestNpp = await getLatestNppAssessmentResultForUser(user.id, supabase);

  return (
    <main className="flex flex-col gap-6">
      {!profile.display_name ? (
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
      ) : (
        <AppCard className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_260px_at_12%_0,color-mix(in_srgb,var(--color-accent2)_18%,transparent),transparent_60%)]" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Personal profile
            </p>

            {latestNpp ? (
              <>
                <h1 className="mt-2 text-4xl leading-[1.05] text-ink">
                  Understand your mental strengths before you begin
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  NPP Lite takes about 2 minutes and gives you a snapshot across five domains. You can retake it any
                  time.
                </p>
                <p className="mt-5 text-sm font-semibold text-ink">
                  {PROFILE_COPY[latestNpp.display_profile_key].title}
                </p>
                <p className="mt-2 text-sm text-muted">
                  Your latest snapshot is ready. Review your results, then begin Day 1.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link href="/insights" className="block cursor-pointer">
                    <SecondaryButton type="button">View results</SecondaryButton>
                  </Link>
                  <Link href="/program/day/1" className="block cursor-pointer">
                    <PrimaryButton type="button">Begin Day 1</PrimaryButton>
                  </Link>
                </div>
                <div className="mt-4 text-center">
                  <TextLink href="/assessment" className="text-sm">
                    Retake NPP
                  </TextLink>
                </div>
              </>
            ) : (
              <>
                <h1 className="mt-2 text-4xl leading-[1.05] text-ink">
                  Start your mental clarity journey
                </h1>
                <p className="mt-3 max-w-prose text-lg leading-snug text-muted">
                  Build awareness first. Measure your progress after.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Start with the 5-day Mental Clarity sequence. One short session per day builds steady attention under
                  pressure.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link href="/program/day/1" className="block cursor-pointer">
                    <PrimaryButton type="button">Begin Day 1</PrimaryButton>
                  </Link>
                  <div className="flex flex-col items-center gap-1">
                    <Link href="/assessment" className="block w-full cursor-pointer">
                      <SecondaryButton type="button">Take NPP Lite (optional)</SecondaryButton>
                    </Link>
                    <p className="text-center text-[11px] text-muted">
                      Optional: Take a quick 2-minute snapshot of your current state
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </AppCard>
      )}
    </main>
  );
}
