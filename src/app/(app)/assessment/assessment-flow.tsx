"use client";

import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { submitNppLiteAction } from "./_actions";
import Link from "next/link";
import { NPP_LITE_QUESTIONS } from "@/lib/npp/npp-lite-questions";
import { useMemo, useState, useTransition } from "react";

const QUESTIONS = NPP_LITE_QUESTIONS;

const SCALE = [
  { value: 1, label: "Almost never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Almost always" },
] as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface2/70">
      <div
        className="h-full rounded-full bg-linear-to-r from-accent to-accent2 transition-[width]"
        style={{ width: `${clamp(value, 0, 100)}%` }}
      />
    </div>
  );
}

export function AssessmentFlow() {
  const total = QUESTIONS.length;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const q = QUESTIONS[idx]!;
  const currentValue = answers[q.id] ?? null;

  const pct = useMemo(() => Math.round(((idx + 1) / total) * 100), [idx, total]);

  function setAnswer(v: number) {
    setAnswers((prev) => ({ ...prev, [q.id]: v }));
    setSubmitError(null);
  }

  const canGoNext = currentValue != null;
  const isLast = idx === total - 1;

  function goNext() {
    if (!canGoNext) return;
    if (isLast) return;
    setIdx((i) => Math.min(total - 1, i + 1));
  }

  function goBack() {
    setIdx((i) => Math.max(0, i - 1));
    setSubmitError(null);
  }

  async function submit() {
    setSubmitError(null);
    const arr = Array.from({ length: 10 }, (_, i) => answers[i + 1]);
    if (arr.some((v) => v == null)) {
      setSubmitError("Please answer all 10 questions to continue.");
      return;
    }

    startTransition(async () => {
      const result = await submitNppLiteAction({ responses: arr as number[] });
      if (!result.ok) {
        setSubmitError(result.message ?? "Something went wrong. Please try again.");
        return;
      }
      setIsDone(true);
    });
  }

  if (isDone) {
    return (
      <AppCard className="p-6">
        <p className="text-sm font-semibold text-ink">Snapshot captured</p>
        <p className="mt-2 text-sm text-muted">
          Your NPP Lite results are ready. Take a minute to review your profile, domains, and strengths — then choose what
          to train next.
        </p>
        <div className="mt-6">
          <Link href="/insights" className="block cursor-pointer">
            <PrimaryButton type="button">View results</PrimaryButton>
          </Link>
        </div>
      </AppCard>
    );
  }

  return (
    <AppCard className="p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          {idx + 1} / {total}
        </p>
        <p className="text-xs font-semibold text-muted">{q.domain}</p>
      </div>
      <div className="mt-3">
        <ProgressBar value={pct} />
      </div>

      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Quick check-in</p>
      <h2 className="mt-5 text-2xl leading-tight text-ink">{q.text}</h2>

      <div className="mt-6" role="radiogroup" aria-label={`Question ${q.id}`}>
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          <span>{SCALE[0].label}</span>
          <span>{SCALE[4].label}</span>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-2">
          {SCALE.map((opt) => {
            const selected = opt.value === currentValue;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setAnswer(opt.value)}
                className={[
                  "grid h-11 w-full place-items-center rounded-2xl border text-sm font-semibold tabular-nums transition",
                  selected
                    ? "border-transparent bg-linear-to-r from-accent to-accent2 text-accentInk shadow-[0_18px_44px_-34px_var(--color-shadow)]"
                    : "border-border/90 bg-surface text-ink hover:-translate-y-0.5 hover:bg-surface2/75",
                ].join(" ")}
              >
                {opt.value}
              </button>
            );
          })}
        </div>
      </div>

      {submitError ? <p className="mt-4 text-sm font-semibold text-danger">{submitError}</p> : null}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <SecondaryButton
          type="button"
          onClick={goBack}
          disabled={idx === 0 || isPending}
        >
          Back
        </SecondaryButton>

        {isLast ? (
          <PrimaryButton type="button" onClick={submit} disabled={!canGoNext || isPending}>
            {isPending ? "Saving…" : "Finish"}
          </PrimaryButton>
        ) : (
          <PrimaryButton type="button" onClick={goNext} disabled={!canGoNext || isPending}>
            Next
          </PrimaryButton>
        )}
      </div>
    </AppCard>
  );
}

