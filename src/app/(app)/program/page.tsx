import { AppCard } from "@/components/app-card";
import { SecondaryButton } from "@/components/secondary-button";
import { DAY_META } from "@/lib/program/meta";
import { ensureProgramProgressRows, getUserProfile, getUserOrNull } from "@/lib/program/server";
import Link from "next/link";
import { redirect } from "next/navigation";

function getStatusLabel(status: "completed" | "current" | "locked") {
  if (status === "completed") return "Completed";
  if (status === "current") return "Current";
  return "Locked";
}

function getStatusClass(status: "completed" | "current" | "locked") {
  if (status === "completed") {
    return "border-success/30 bg-success/10 text-success";
  }
  if (status === "current") {
    return "border-transparent bg-linear-to-r from-accent to-accent2 text-accentInk";
  }
  return "border-border bg-surface text-muted";
}

function DayAvatar({
  dayIndex,
  status,
}: {
  dayIndex: number;
  status: "completed" | "current" | "locked";
}) {
  const base =
    "grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg font-semibold tabular-nums leading-none sm:h-14 sm:w-14 sm:text-xl";

  if (status === "completed") {
    return (
      <span
        className={`${base} border border-success/35 bg-success/12 text-success`}
        title="Completed"
      >
        {dayIndex}
      </span>
    );
  }
  if (status === "current") {
    return (
      <span
        className={`${base} border border-transparent bg-linear-to-br from-accent to-accent2 text-accentInk shadow-[0_12px_28px_-16px_var(--color-shadow)]`}
        title="Current — open this day next"
      >
        {dayIndex}
      </span>
    );
  }
  return (
    <span
      className={`${base} border border-border/90 bg-surface2/80 text-muted`}
      title="Locked until the previous day is completed"
    >
      {dayIndex}
    </span>
  );
}

export default async function ProgramPage() {
  const { user, supabase } = await getUserOrNull();
  if (!user) redirect("/sign-in");

  const [profile, progress] = await Promise.all([
    getUserProfile(user.id, supabase),
    ensureProgramProgressRows(user.id, supabase),
  ]);

  return (
    <main className="flex flex-col gap-6">
      <AppCard className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_240px_at_12%_0,color-mix(in_srgb,var(--color-accent)_20%,transparent),transparent_60%)]" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Program Flow
          </p>
          <h1 className="mt-2 text-4xl leading-[1.05] text-ink">5-day Mental Clarity</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Keep momentum by finishing each day in order. A new day opens right after completion.
          </p>
        </div>
      </AppCard>

      <AppCard className="p-6">
        <div className="flex flex-col gap-3">
          {progress.map((day) => {
            const locked = day.day_index > profile.program_max_unlocked_day;
            const status: "completed" | "current" | "locked" = day.completed_at
              ? "completed"
              : locked
                ? "locked"
                : "current";

            const row = (
              <div className="group flex items-center justify-between gap-4 rounded-2xl border border-border/90 bg-surface px-4 py-4 shadow-[0_16px_44px_-36px_var(--color-shadow)] transition hover:-translate-y-0.5 hover:bg-surface2/75">
                <div className="flex min-w-0 items-center gap-3.5">
                  <DayAvatar dayIndex={day.day_index} status={status} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">
                      Day {day.day_index}
                      <span className="ml-2 font-normal text-muted">
                        {DAY_META[day.day_index as 1 | 2 | 3 | 4 | 5].title}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {status === "locked"
                        ? "Unlocks when you finish the day before"
                        : day.completed_at
                          ? "You finished this session"
                          : "Tap to start or continue"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold",
                      getStatusClass(status),
                    ].join(" ")}
                  >
                    {getStatusLabel(status)}
                  </span>
                  {status !== "locked" ? (
                    <span className="text-xs font-semibold text-muted transition group-hover:text-ink">
                      Open
                    </span>
                  ) : null}
                </div>
              </div>
            );

            return locked ? (
              <div key={day.day_index} className="opacity-70">
                {row}
              </div>
            ) : (
              <Link
                key={day.day_index}
                href={`/program/day/${day.day_index}`}
                className="block cursor-pointer"
              >
                {row}
              </Link>
            );
          })}
        </div>

        <div className="mt-6">
          <Link href="/dashboard" className="block cursor-pointer">
            <SecondaryButton type="button">Return to dashboard</SecondaryButton>
          </Link>
        </div>
      </AppCard>
    </main>
  );
}
