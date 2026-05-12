import type {
  NppLiteDerivedKey,
  NppLiteDomainKey,
  NppLiteProfileKey,
  NppLiteScoringResult,
} from "@/lib/scoring/npp-lite";
import { computeGlobalAverage, pickGlobalProfileKey, pickWeakestDomainKey } from "@/lib/scoring/npp-lite";
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export type NppAssessmentResultRow = {
  id: string;
  user_id: string;
  created_at: string;
  responses: unknown;
  domain_scores: Record<NppLiteDomainKey, { value: number; band: NppLiteScoringResult["domain_scores"][NppLiteDomainKey]["band"] }>;
  derived_map: Record<NppLiteDerivedKey, { value: number; band: NppLiteScoringResult["derived_map"][NppLiteDerivedKey]["band"] }>;
  /**
   * Stored profile key from when the row was created.
   * Legacy rows may contain older 4-profile keys, so treat as opaque.
   */
  profile_key: string;
  scoring_version: string;
  /** Coaching-style profile computed from global average (used for display). */
  display_profile_key: NppLiteProfileKey;
  /** Global average across the 5 domain values (1..5). */
  global_average: number;
  /** Weakest domain (stable tie-break) used for “next step” guidance. */
  weakest_domain_key: NppLiteDomainKey;
};

export type NppAssessmentTrend = "new_baseline" | "up" | "steady" | "down";

export type NppAssessmentDomainDelta = {
  key: NppLiteDomainKey;
  delta: number;
};

export type NppAssessmentComparison = {
  latest: NppAssessmentResultRow;
  previous: NppAssessmentResultRow | null;
  trend: NppAssessmentTrend;
  global_average_delta: number | null;
  strongest_gain_domain: NppAssessmentDomainDelta | null;
  strongest_drop_domain: NppAssessmentDomainDelta | null;
  priority_domain_key: NppLiteDomainKey;
};

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type RawNppAssessmentResultRow = Omit<
  NppAssessmentResultRow,
  "display_profile_key" | "global_average" | "weakest_domain_key"
>;

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function hydrateNppAssessmentResultRow(row: RawNppAssessmentResultRow): NppAssessmentResultRow {
  const global_average = computeGlobalAverage(row.domain_scores);
  const display_profile_key = pickGlobalProfileKey(global_average);
  const weakest_domain_key = pickWeakestDomainKey(row.domain_scores);

  return {
    ...row,
    global_average,
    display_profile_key,
    weakest_domain_key,
  } satisfies NppAssessmentResultRow;
}

function pickStrongestPositiveDomainDelta(
  latest: NppAssessmentResultRow,
  previous: NppAssessmentResultRow,
): NppAssessmentDomainDelta | null {
  const deltas = (Object.keys(latest.domain_scores) as NppLiteDomainKey[])
    .map((key) => ({
      key,
      delta: round1(latest.domain_scores[key].value - previous.domain_scores[key].value),
    }))
    .filter((entry) => entry.delta > 0)
    .sort((a, b) => b.delta - a.delta);

  return deltas[0] ?? null;
}

function pickStrongestNegativeDomainDelta(
  latest: NppAssessmentResultRow,
  previous: NppAssessmentResultRow,
): NppAssessmentDomainDelta | null {
  const deltas = (Object.keys(latest.domain_scores) as NppLiteDomainKey[])
    .map((key) => ({
      key,
      delta: round1(latest.domain_scores[key].value - previous.domain_scores[key].value),
    }))
    .filter((entry) => entry.delta < 0)
    .sort((a, b) => a.delta - b.delta);

  return deltas[0] ?? null;
}

export function buildNppAssessmentComparison(
  results: readonly NppAssessmentResultRow[],
): NppAssessmentComparison | null {
  const latest = results[0] ?? null;
  if (!latest) return null;

  const previous = results[1] ?? null;
  if (!previous) {
    return {
      latest,
      previous: null,
      trend: "new_baseline",
      global_average_delta: null,
      strongest_gain_domain: null,
      strongest_drop_domain: null,
      priority_domain_key: latest.weakest_domain_key,
    } satisfies NppAssessmentComparison;
  }

  const global_average_delta = round1(latest.global_average - previous.global_average);
  const trend: NppAssessmentTrend =
    global_average_delta >= 0.2 ? "up" : global_average_delta <= -0.2 ? "down" : "steady";

  return {
    latest,
    previous,
    trend,
    global_average_delta,
    strongest_gain_domain: pickStrongestPositiveDomainDelta(latest, previous),
    strongest_drop_domain: pickStrongestNegativeDomainDelta(latest, previous),
    priority_domain_key: latest.weakest_domain_key,
  } satisfies NppAssessmentComparison;
}

export async function listRecentNppAssessmentResultsForUser(
  userId: string,
  limit = 2,
  supabase?: SupabaseServerClient,
) {
  const client = supabase ?? (await createClient());
  const { data, error } = await client
    .from("npp_assessment_results")
    .select("id, user_id, created_at, responses, domain_scores, derived_map, profile_key, scoring_version")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  const rows = (data ?? []) as unknown as RawNppAssessmentResultRow[];
  return rows.map(hydrateNppAssessmentResultRow);
}

export async function getLatestNppAssessmentResultForUser(userId: string, supabase?: SupabaseServerClient) {
  const rows = await listRecentNppAssessmentResultsForUser(userId, 1, supabase);
  return rows[0] ?? null;
}

export async function getLatestNppAssessmentComparisonForUser(userId: string, supabase?: SupabaseServerClient) {
  const rows = await listRecentNppAssessmentResultsForUser(userId, 2, supabase);
  return buildNppAssessmentComparison(rows);
}

export const getLatestNppAssessmentResult = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, result: null };

  const result = await getLatestNppAssessmentResultForUser(user.id, supabase);
  return { user, result };
});

