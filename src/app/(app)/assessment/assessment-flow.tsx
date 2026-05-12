"use client";

import { AppCard } from "@/components/app-card";
import { DOMAIN_COPY, PROFILE_COPY } from "@/lib/npp/copy";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { pickWeakestDomainKey, scoreNppLite } from "@/lib/scoring/npp-lite";
import { submitNppLiteAction } from "./_actions";
import Link from "next/link";
import { NPP_LITE_QUESTIONS } from "@/lib/npp/npp-lite-questions";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

const QUESTIONS = NPP_LITE_QUESTIONS;
const AUTO_ADVANCE_DELAY_MS = 140;

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

type AssessmentTeaser = {
  profileTitle: string;
  profileParagraph: string;
  focusLabel: string;
  focusInsight: string;
  globalAverage: number;
};

function buildAssessmentTeaser(responses: number[]): AssessmentTeaser {
  const scored = scoreNppLite({ responses });
  const weakestDomainKey = pickWeakestDomainKey(scored.domain_scores);
  const profile = PROFILE_COPY[scored.profile_key];
  const focusDomain = DOMAIN_COPY[weakestDomainKey];
  const globalAverage =
    Object.values(scored.domain_scores).reduce((sum, item) => sum + item.value, 0) / Object.values(scored.domain_scores).length;

  return {
    profileTitle: profile.title,
    profileParagraph: profile.paragraph,
    focusLabel: focusDomain.label,
    focusInsight: focusDomain.insight,
    globalAverage,
  };
}

export function AssessmentFlow() {
  const total = QUESTIONS.length;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [teaser, setTeaser] = useState<AssessmentTeaser | null>(null);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = QUESTIONS[idx]!;
  const currentValue = answers[q.id] ?? null;

  const pct = useMemo(() => Math.round(((idx + 1) / total) * 100), [idx, total]);

  function clearAutoAdvanceTimer() {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }

  useEffect(() => {
    return () => clearAutoAdvanceTimer();
  }, []);

  function setAnswer(v: number) {
    clearAutoAdvanceTimer();
    setAnswers((prev) => ({ ...prev, [q.id]: v }));
    setSubmitError(null);

    if (!isLast) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        setIdx((i) => Math.min(total - 1, i + 1));
        autoAdvanceTimerRef.current = null;
      }, AUTO_ADVANCE_DELAY_MS);
    }
  }

  const canGoNext = currentValue != null;
  const isLast = idx === total - 1;

  function goNext() {
    clearAutoAdvanceTimer();
    if (!canGoNext) return;
    if (isLast) return;
    setIdx((i) => Math.min(total - 1, i + 1));
  }

  function goBack() {
    clearAutoAdvanceTimer();
    setIdx((i) => Math.max(0, i - 1));
    setSubmitError(null);
  }

  async function submit() {
    clearAutoAdvanceTimer();
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
      setTeaser(buildAssessmentTeaser(arr as number[]));
      setIsDone(true);
    });
  }

  if (isDone) {
    return (
      <AppCard className="relative overflow-hidden p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(840px_260px_at_8%_-10%,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_58%)]" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Snapshot captured</p>
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-muted">
              10 / 10 complete
            </span>
          </div>

          <div className="mt-3">
            <ProgressBar value={100} />
          </div>

          <h2 className="mt-6 text-3xl leading-tight text-ink">{teaser?.profileTitle ?? "Your results are ready"}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {teaser?.profileParagraph ??
              "Your NPP Lite results are ready. Review your profile, domains, and strengths, then choose what to train next."}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-(--color-glass2) px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Global average</p>
              <p className="mt-2 text-2xl font-semibold text-ink tabular-nums">
                {teaser ? teaser.globalAverage.toFixed(1) : "--"}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">A clean baseline for comparing future retakes.</p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-(--color-glass2) px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Focus next</p>
              <p className="mt-2 text-sm font-semibold text-ink">{teaser?.focusLabel ?? "Review insights"}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {teaser?.focusInsight ?? "Open the full results to see where to focus your next sessions."}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/insights" className="block cursor-pointer">
              <PrimaryButton type="button">View full results</PrimaryButton>
            </Link>
          </div>
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
      {!isLast ? (
        <p className="mt-3 text-xs text-muted">Tap once to answer and continue to the next question.</p>
      ) : null}

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

