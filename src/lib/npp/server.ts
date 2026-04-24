import type { NppLiteDerivedKey, NppLiteDomainKey, NppLiteProfileKey, NppLiteScoringResult } from "@/lib/scoring/npp-lite";
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

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function getLatestNppAssessmentResultForUser(userId: string, supabase?: SupabaseServerClient) {
  const client = supabase ?? (await createClient());
  const { data, error } = await client
    .from("npp_assessment_results")
    .select("id, user_id, created_at, responses, domain_scores, derived_map, profile_key, scoring_version")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  const row = (data?.[0] ?? null) as unknown as Omit<
    NppAssessmentResultRow,
    "display_profile_key" | "global_average" | "weakest_domain_key"
  > | null;

  if (!row) return null;

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

export const getLatestNppAssessmentResult = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, result: null };

  const result = await getLatestNppAssessmentResultForUser(user.id, supabase);
  return { user, result };
});

