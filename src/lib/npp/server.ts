import type { NppLiteDerivedKey, NppLiteDomainKey, NppLiteScoringResult } from "@/lib/scoring/npp-lite";
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export type NppAssessmentResultRow = {
  id: string;
  user_id: string;
  created_at: string;
  responses: unknown;
  domain_scores: Record<NppLiteDomainKey, { value: number; band: NppLiteScoringResult["domain_scores"][NppLiteDomainKey]["band"] }>;
  derived_map: Record<NppLiteDerivedKey, { value: number; band: NppLiteScoringResult["derived_map"][NppLiteDerivedKey]["band"] }>;
  profile_key: NppLiteScoringResult["profile_key"];
  scoring_version: NppLiteScoringResult["scoring_version"];
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
  return (data?.[0] ?? null) as unknown as NppAssessmentResultRow | null;
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

