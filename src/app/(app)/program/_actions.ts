"use server";

import { createClient } from "@/lib/supabase/server";
import { clampDayIndex, getUserProfile } from "@/lib/program/server";
import { redirect } from "next/navigation";

export async function completeDayAction(formData: FormData) {
  const day = clampDayIndex(Number(formData.get("day")));
  const reflectionChoice = String(formData.get("reflectionChoice") ?? "").trim();

  if (!reflectionChoice) redirect(`/program/day/${day}?error=reflection`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const profile = await getUserProfile(user.id);
  if (day > profile.program_max_unlocked_day) redirect("/program");

  const now = new Date().toISOString();

  const { error: progressError } = await supabase
    .from("program_day_progress")
    .update({
      completed_at: now,
      reflection_payload: { choice: reflectionChoice },
    })
    .eq("user_id", user.id)
    .eq("day_index", day);

  if (progressError) redirect(`/program/day/${day}?error=${progressError.message}`);

  const nextMax = Math.min(5, day + 1);
  if (profile.program_max_unlocked_day < nextMax) {
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({ program_max_unlocked_day: nextMax })
      .eq("id", user.id);

    if (profileError) redirect(`/program/day/${day}?error=${profileError.message}`);
  }

  if (day < 5) redirect(`/program/day/${day + 1}`);
  redirect("/program");
}

