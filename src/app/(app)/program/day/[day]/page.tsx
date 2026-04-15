import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { TextLink } from "@/components/text-link";
import {
  ensureProgramProgressRows,
  getUserOrNull,
  getUserProfile,
} from "@/lib/program/server";
import { redirect } from "next/navigation";
import { completeDayAction } from "../../_actions";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const dayMeta: Record<number, { title: string; blurb: string; reflection: string[] }> = {
  1: {
    title: "Stabilize",
    blurb: "A short reset to settle attention and create a calmer baseline.",
    reflection: ["I feel calmer", "I feel steady", "I need more practice"],
  },
  2: {
    title: "Thought detachment",
    blurb: "Notice thoughts without getting pulled into them.",
    reflection: ["More space", "Less noise", "Still distracted"],
  },
  3: {
    title: "Emotional steadiness",
    blurb: "Reduce reactivity and return to center faster.",
    reflection: ["More stable", "Some progress", "Not there yet"],
  },
  4: {
    title: "Consistent action",
    blurb: "Small steps with clarity, even when motivation dips.",
    reflection: ["I took action", "I started", "I postponed"],
  },
  5: {
    title: "Calm performance",
    blurb: "Bring steadiness into pressure and execution.",
    reflection: ["Confident", "Focused", "Overwhelmed"],
  },
};

export default async function ProgramDayPage({
  params,
  searchParams,
}: {
  params: Promise<{ day: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { user, supabase } = await getUserOrNull();
  if (!user) redirect("/sign-in");

  const { day: dayStr } = await params;
  const { error } = await searchParams;
  const day = Number(dayStr);
  if (!Number.isInteger(day) || day < 1 || day > 5) redirect("/program");

  const [profile, progress] = await Promise.all([
    getUserProfile(user.id, supabase),
    ensureProgramProgressRows(user.id, supabase),
  ]);

  if (day > profile.program_max_unlocked_day) redirect("/program");

  const row = progress.find((d) => d.day_index === day);
  if (!row) redirect("/program");

  const meta = dayMeta[day];
  const isCompleted = row.completed_at != null;
  const completedCount = progress.filter((d) => d.completed_at != null).length;
  const progressPct = clamp(Math.round((completedCount / 5) * 100), 0, 100);

  return (
    <main className="flex flex-col gap-6">
      <AppCard className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_260px_at_10%_0,color-mix(in_srgb,var(--color-accent)_22%,transparent),transparent_58%)]" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Day {day} of 5
            </p>
            <TextLink href="/program" className="text-xs">
              Back to program
            </TextLink>
          </div>
          <h1 className="mt-2 text-4xl leading-[1.05] text-ink">{meta.title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">{meta.blurb}</p>
          <div className="mt-5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted">
              <span>Journey progress</span>
              <span>{progressPct}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-border/80 bg-(--color-ringTrack) shadow-[inset_0_1px_0_color-mix(in_srgb,white_12%,transparent)]">
              <div
                className="h-full rounded-full bg-linear-to-r from-accent to-accent2"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-3xl leading-tight text-ink">Session audio</h2>
            <p className="mt-3 text-sm text-muted">
              Audio links will be attached in M5. This screen already mirrors the final guided flow.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-muted">
            Coming soon
          </span>
        </div>
        <div className="mt-4 rounded-2xl border border-border bg-surface2/70 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Preview player</p>
          <p className="mt-2 text-sm text-muted">
            Playback controls will appear here as soon as the content library is connected.
          </p>
        </div>
      </AppCard>

      <AppCard className="p-6">
        <h2 className="text-3xl leading-tight text-ink">Reflection</h2>
        <p className="mt-3 text-sm text-muted">
          Choose the response that best matches your state after the session.
        </p>

        {error ? (
          <p className="mt-4 rounded-2xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error === "reflection"
              ? "Please choose one option before completing this day."
              : error}
          </p>
        ) : null}

        {isCompleted ? (
          <div className="mt-6 rounded-2xl border border-success/30 bg-success/10 px-4 py-4">
            <p className="text-sm font-semibold text-success">Completed</p>
            <p className="mt-1 text-sm text-success">
              Strong work. Your progress is saved and the next step is ready.
            </p>
            <div className="mt-4">
              <TextLink
                href={day < 5 ? `/program/day/${day + 1}` : "/program"}
                className="text-sm"
              >
                {day < 5 ? "Go to next day" : "Back to program"}
              </TextLink>
            </div>
          </div>
        ) : (
          <form action={completeDayAction} className="mt-6 flex flex-col gap-4">
            <input type="hidden" name="day" value={day} />
            <fieldset className="flex flex-col gap-2.5">
              {meta.reflection.map((opt) => (
                <label
                  key={opt}
                  className="group relative flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink shadow-[0_16px_44px_-36px_var(--color-shadow)] transition hover:-translate-y-0.5 hover:bg-surface2/75"
                >
                  <input
                    type="radio"
                    name="reflectionChoice"
                    value={opt}
                    className="peer h-4 w-4 accent-accent"
                  />
                  <span className="font-medium">{opt}</span>
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-transparent transition peer-checked:ring-accent/40" />
                </label>
              ))}
            </fieldset>
            <PrimaryButton type="submit">Complete day</PrimaryButton>
          </form>
        )}
      </AppCard>
    </main>
  );
}
