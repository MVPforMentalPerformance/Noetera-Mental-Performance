import { NPP_LITE_REVERSE_SCORED_IDS } from "@/lib/npp/npp-lite-questions";

export type NppLiteResponseMap = Record<string, number>;

export type NppLiteDomainKey =
  | "focus_attention"
  | "thought_control"
  | "emotional_regulation"
  | "action_consistency"
  | "performance_state";

export type NppLiteDerivedKey = "mental_toughness" | "flow" | "self_concept" | "life_effectiveness";

export type NppLiteBand = "strong" | "developing" | "needs_training";

export type NppLiteScoreSnapshot = {
  value: number;
  band: NppLiteBand;
};

export type NppLiteProfileKey =
  | "under_pressure"
  | "grounded_performer"
  | "capable_performer"
  | "high_performance_state"
  | "elite_performance_state";

export type NppLiteScoringResult = {
  responses: NppLiteResponseMap;
  domain_scores: Record<NppLiteDomainKey, NppLiteScoreSnapshot>;
  derived_map: Record<NppLiteDerivedKey, NppLiteScoreSnapshot>;
  profile_key: NppLiteProfileKey;
  scoring_version: "3";
};

const DOMAIN_TIEBREAK_ORDER: Record<NppLiteDomainKey, number> = {
  performance_state: 0,
  focus_attention: 1,
  action_consistency: 2,
  thought_control: 3,
  emotional_regulation: 4,
};

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function bandFor(value: number): NppLiteBand {
  if (value >= 4.2) return "strong";
  if (value >= 3.2) return "developing";
  return "needs_training";
}

function snapshot(value: number): NppLiteScoreSnapshot {
  const v = round1(value);
  return { value: v, band: bandFor(v) };
}

function reverseScore(v: number) {
  return 6 - v;
}

export function pickWeakestDomainKey(
  domains: Record<NppLiteDomainKey, { value: number }>,
): NppLiteDomainKey {
  const entries: Array<[NppLiteDomainKey, number]> = Object.entries(domains).map(([k, s]) => [
    k as NppLiteDomainKey,
    s.value,
  ]);

  entries.sort((a, b) => a[1] - b[1] || DOMAIN_TIEBREAK_ORDER[a[0]] - DOMAIN_TIEBREAK_ORDER[b[0]]);
  return entries[0]![0];
}

export function computeGlobalAverage(domains: Record<NppLiteDomainKey, { value: number }>) {
  const sum = Object.values(domains).reduce((acc, s) => acc + s.value, 0);
  return sum / 5;
}

export function pickGlobalProfileKey(globalAverage: number): NppLiteProfileKey {
  // Range-based “global state” tiers (coaching-oriented).
  if (globalAverage <= 2.7) return "under_pressure";
  if (globalAverage <= 3.6) return "grounded_performer";
  if (globalAverage <= 4.3) return "capable_performer";
  if (globalAverage <= 4.7) return "high_performance_state";
  return "elite_performance_state";
}

export function scoreNppLite(input: { responses: Array<number> | NppLiteResponseMap }): NppLiteScoringResult {
  const raw = input.responses;
  const arr = Array.isArray(raw)
    ? raw
    : Array.from({ length: 10 }, (_, i) => (raw as NppLiteResponseMap)[String(i + 1)]);

  if (arr.length !== 10) throw new Error("NPP Lite requires 10 responses.");

  const normalized: number[] = arr.map((v, i) => {
    const q = i + 1;
    if (!Number.isFinite(v) || v < 1 || v > 5) throw new Error(`Invalid response for Q${q}.`);
    return NPP_LITE_REVERSE_SCORED_IDS.has(q) ? reverseScore(v) : v;
  });

  const responses: NppLiteResponseMap = Object.fromEntries(arr.map((v, i) => [String(i + 1), v]));

  const focus = (normalized[0] + normalized[1]) / 2;
  const thought = (normalized[2] + normalized[3]) / 2;
  const emotion = (normalized[4] + normalized[5]) / 2;
  const action = (normalized[6] + normalized[7]) / 2;
  const performance = (normalized[8] + normalized[9]) / 2;

  const domain_scores: Record<NppLiteDomainKey, NppLiteScoreSnapshot> = {
    focus_attention: snapshot(focus),
    thought_control: snapshot(thought),
    emotional_regulation: snapshot(emotion),
    action_consistency: snapshot(action),
    performance_state: snapshot(performance),
  };

  const derived_map: Record<NppLiteDerivedKey, NppLiteScoreSnapshot> = {
    mental_toughness: snapshot((thought + emotion) / 2),
    flow: snapshot((focus + performance) / 2),
    self_concept: snapshot((performance + action) / 2),
    life_effectiveness: snapshot((action + emotion) / 2),
  };

  const globalAverage = (focus + thought + emotion + action + performance) / 5;

  return {
    responses,
    domain_scores,
    derived_map,
    profile_key: pickGlobalProfileKey(globalAverage),
    scoring_version: "3",
  };
}

