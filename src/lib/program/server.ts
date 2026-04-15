import { createClient } from "@/lib/supabase/server";

export type UserProfile = {
  id: string;
  program_max_unlocked_day: number;
};

export type ProgramDayProgressRow = {
  id: string;
  user_id: string;
  day_index: number;
  unlocked_at: string | null;
  completed_at: string | null;
  reflection_payload: unknown | null;
};

export function clampDayIndex(day: number) {
  return Math.max(1, Math.min(5, day));
}

export async function getUserOrNull() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, program_max_unlocked_day")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function listProgramProgress(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("program_day_progress")
    .select("id, user_id, day_index, unlocked_at, completed_at, reflection_payload")
    .eq("user_id", userId)
    .order("day_index", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ProgramDayProgressRow[];
}

export async function ensureProgramProgressRows(userId: string) {
  const supabase = await createClient();

  const existing = await listProgramProgress(userId);
  const existingSet = new Set(existing.map((r) => r.day_index));

  const toUpsert: Array<Partial<ProgramDayProgressRow>> = [];
  const now = new Date().toISOString();

  for (let day = 1; day <= 5; day += 1) {
    if (existingSet.has(day)) continue;
    toUpsert.push({
      user_id: userId,
      day_index: day,
      unlocked_at: day === 1 ? now : null,
      completed_at: null,
      reflection_payload: null,
    });
  }

  if (toUpsert.length > 0) {
    const { error } = await supabase
      .from("program_day_progress")
      .upsert(toUpsert, { onConflict: "user_id,day_index" });
    if (error) throw error;
  }

  return await listProgramProgress(userId);
}

