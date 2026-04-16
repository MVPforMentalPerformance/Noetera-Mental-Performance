"use client";

import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { TextLink } from "@/components/text-link";
import { submitNppLiteAction } from "./_actions";
import { useMemo, useState, useTransition } from "react";

type NppQuestion = {
  id: number;
  domain:
    | "Focus & Attention"
    | "Thought Control"
    | "Emotional Regulation"
    | "Action & Consistency"
    | "Performance State";
  text: string;
};

const QUESTIONS: NppQuestion[] = [
  { id: 1, domain: "Focus & Attention", text: "I can keep my attention on what matters, even when things feel noisy." },
  { id: 2, domain: "Focus & Attention", text: "My focus is easily pulled away by distractions." },
  { id: 3, domain: "Thought Control", text: "I can notice unhelpful thoughts and return to the task." },
  { id: 4, domain: "Thought Control", text: "My thoughts tend to spiral and take over my performance." },
  { id: 5, domain: "Emotional Regulation", text: "I can stay steady when pressure rises." },
  { id: 6, domain: "Emotional Regulation", text: "My emotions make it hard to respond the way I want." },
  { id: 7, domain: "Action & Consistency", text: "I follow through on the habits I set for myself." },
  { id: 8, domain: "Action & Consistency", text: "I struggle to stay consistent once my routine is disrupted." },
  { id: 9, domain: "Performance State", text: "I can access a calm, confident performance state when it counts." },
  { id: 10, domain: "Performance State", text: "I doubt myself in key moments." },
];

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
        <p className="text-sm font-semibold text-ink">Assessment saved</p>
        <p className="mt-2 text-sm text-muted">
          Your NPP Lite result has been added to your history. Results screens are coming in the next milestone.
        </p>
        <div className="mt-5">
          <TextLink href="/dashboard" className="text-sm">
            Back to home
          </TextLink>
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
        <PrimaryButton
          type="button"
          onClick={goBack}
          disabled={idx === 0 || isPending}
          className="bg-surface2/70 text-white shadow-none ring-1 ring-border/90 hover:bg-surface2 hover:text-white hover:brightness-100"
        >
          Back
        </PrimaryButton>

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

