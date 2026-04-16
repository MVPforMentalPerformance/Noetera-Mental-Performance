"use server";

import { scoreNppLite } from "@/lib/scoring/npp-lite";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitNppLiteAction(input: { responses: number[] }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { responses, domain_scores, derived_map, profile_key, scoring_version } = scoreNppLite({
    responses: input.responses,
  });

  const { error } = await supabase.from("npp_assessment_results").insert({
    user_id: user.id,
    responses,
    domain_scores,
    derived_map,
    profile_key,
    scoring_version,
  });

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const };
}

