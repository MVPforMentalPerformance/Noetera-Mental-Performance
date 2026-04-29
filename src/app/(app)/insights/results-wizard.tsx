"use client";

import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { SecondaryButton } from "@/components/secondary-button";
import { cx } from "@/lib/cx";
import { bandLabel, DERIVED_COPY, DOMAIN_COPY, PROFILE_COPY } from "@/lib/npp/copy";
import type { NppAssessmentResultRow } from "@/lib/npp/server";
import Link from "next/link";
import { useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pctFromScore(v: number) {
  // Score scale is 1..5
  return clamp(Math.round(((v - 1) / 4) * 100), 0, 100);
}

function MiniProgress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface2/70">
      <div
        className="h-full rounded-full bg-linear-to-r from-accent to-accent2 transition-[width]"
        style={{ width: `${clamp(value, 0, 100)}%` }}
      />
    </div>
  );
}

function DomainRow({
  label,
  value,
  band,
  insight,
}: {
  label: string;
  value: number;
  band: string;
  insight: string;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-(--color-glass2) px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="mt-1 text-xs text-muted">{insight}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-ink tabular-nums">{value.toFixed(1)}</p>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{band}</p>
        </div>
      </div>
      <div className="mt-3">
        <MiniProgress value={pctFromScore(value)} />
      </div>
    </div>
  );
}

export function ResultsWizard({ result }: { result: NppAssessmentResultRow }) {
  const steps = 3;
  const [step, setStep] = useState(0);

  const profile = PROFILE_COPY[result.display_profile_key];
  const weakestDomain = DOMAIN_COPY[result.weakest_domain_key];

  const sortedDomains = useMemo(() => {
    const entries = Object.entries(result.domain_scores).map(([k, s]) => ({
      key: k as keyof typeof result.domain_scores,
      value: s.value,
      band: s.band,
    }));
    entries.sort((a, b) => b.value - a.value);
    return entries;
  }, [result]);

  const derivedSorted = useMemo(() => {
    const entries = Object.entries(result.derived_map).map(([k, s]) => ({
      key: k as keyof typeof result.derived_map,
      value: s.value,
      band: s.band,
    }));
    entries.sort((a, b) => b.value - a.value);
    return entries;
  }, [result]);

  const topStrengths = derivedSorted.slice(0, 2);
  const topGrowth = derivedSorted.slice(-2).reverse();

  return (
    <AppCard className="p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          {step + 1} / {steps}
        </p>
        <p className="text-xs font-semibold text-muted">
          {step === 0 ? "Profile" : step === 1 ? "Domains" : "Strengths"}
        </p>
      </div>
      <div className="mt-3">
        <MiniProgress value={Math.round(((step + 1) / steps) * 100)} />
      </div>

      {step === 0 ? (
        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Your profile</p>
          <h2 className="mt-3 text-3xl leading-tight text-ink">{profile.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">{profile.paragraph}</p>

          <div className="mt-6 rounded-2xl border border-border/80 bg-(--color-glass2) px-4 py-4">
            <p className="text-xs font-semibold text-ink">Based on your global average</p>
            <p className="mt-1 text-xs text-muted">
              Global average {result.global_average.toFixed(1)} · Completed {new Date(result.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-3 rounded-2xl border border-border/80 bg-(--color-glass2) px-4 py-4">
            <p className="text-xs font-semibold text-ink">Next step focus</p>
            <p className="mt-1 text-xs text-muted">
              Priority domain: {weakestDomain.label} · {weakestDomain.insight}
            </p>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Domain breakdown</p>
          <h2 className="mt-3 text-3xl leading-tight text-ink">Where you are strongest right now</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            These five domains show what to keep reinforcing — and what to train next.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {sortedDomains.map((d) => (
              <DomainRow
                key={d.key}
                label={DOMAIN_COPY[d.key].label}
                value={d.value}
                band={bandLabel(d.band)}
                insight={DOMAIN_COPY[d.key].insight}
              />
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Strengths & focus</p>
          <h2 className="mt-3 text-3xl leading-tight text-ink">A simple training direction</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Keep building your strengths — and choose one or two focus areas for your next week.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <div className="rounded-2xl border border-border/80 bg-(--color-glass2) px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Top strengths</p>
              <div className="mt-3 flex flex-col gap-2">
                {topStrengths.map((s) => (
                  <div key={s.key} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{DERIVED_COPY[s.key].label}</p>
                      <p className="mt-1 text-xs text-muted">{DERIVED_COPY[s.key].insight}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-ink tabular-nums">{s.value.toFixed(1)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-(--color-glass2) px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Focus areas</p>
              <div className="mt-3 flex flex-col gap-2">
                {topGrowth.map((s) => (
                  <div key={s.key} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{DERIVED_COPY[s.key].label}</p>
                      <p className="mt-1 text-xs text-muted">{DERIVED_COPY[s.key].insight}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-ink tabular-nums">{s.value.toFixed(1)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-(--color-glass2) px-4 py-4">
              <p className="text-xs font-semibold text-ink">Next step</p>
              <p className="mt-2 text-sm text-muted">
                Start by lifting your lowest domain first: <span className="font-semibold text-ink">{weakestDomain.label}</span>.
              </p>
              <p className="mt-2 text-sm text-muted">
                If you want a fresh snapshot after a few sessions, you can retake NPP Lite at any time.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-7 grid grid-cols-2 gap-3">
        {step === 0 ? (
          <SecondaryButton type="button" disabled className="opacity-40">
            Back
          </SecondaryButton>
        ) : (
          <SecondaryButton type="button" onClick={() => setStep((s) => clamp(s - 1, 0, steps - 1))}>
            Back
          </SecondaryButton>
        )}

        {step === steps - 1 ? (
          <Link href="/dashboard" className={cx("block cursor-pointer")}>
            <PrimaryButton type="button">Home</PrimaryButton>
          </Link>
        ) : (
          <PrimaryButton type="button" onClick={() => setStep((s) => clamp(s + 1, 0, steps - 1))}>
            Next
          </PrimaryButton>
        )}
      </div>
    </AppCard>
  );
}

