import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

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

const DEBUG_PERF = process.env.DEBUG_PERF === "1";

function perfNowMs() {
  // Server-only timing helper
  return typeof performance !== "undefined" && "now" in performance ? performance.now() : Date.now();
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

const getSupabaseAndUserCached = cache(async () => {
  const t0 = DEBUG_PERF ? perfNowMs() : 0;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (DEBUG_PERF) {
    const dt = perfNowMs() - t0;
    console.log(`[perf] auth.getUser() ${Math.round(dt)}ms (cached request-scope)`);
  }
  return { supabase, user };
});

export async function getUserOrNull() {
  return await getSupabaseAndUserCached();
}

export async function getUserProfile(userId: string, supabase?: SupabaseServerClient) {
  const client = supabase ?? (await createClient());
  const { data, error } = await client
    .from("user_profiles")
    .select("id, program_max_unlocked_day")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function listProgramProgress(userId: string, supabase?: SupabaseServerClient) {
  const client = supabase ?? (await createClient());
  const { data, error } = await client
    .from("program_day_progress")
    .select("id, user_id, day_index, unlocked_at, completed_at, reflection_payload")
    .eq("user_id", userId)
    .order("day_index", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ProgramDayProgressRow[];
}

export async function ensureProgramProgressRows(userId: string, supabase?: SupabaseServerClient) {
  const client = supabase ?? (await createClient());
  const t0 = DEBUG_PERF ? perfNowMs() : 0;

  // Idempotent: attempt to insert all 5 rows, but do not overwrite existing rows.
  // This replaces the hot-path pattern SELECT → UPSERT → SELECT with UPSERT → SELECT.
  const now = new Date().toISOString();
  const rows: Array<Partial<ProgramDayProgressRow>> = Array.from({ length: 5 }, (_, i) => {
    const day = i + 1;
    return {
      user_id: userId,
      day_index: day,
      unlocked_at: day === 1 ? now : null,
      completed_at: null,
      reflection_payload: null,
    };
  });

  const { error: upsertError } = await client
    .from("program_day_progress")
    .upsert(rows, { onConflict: "user_id,day_index", ignoreDuplicates: true });
  if (upsertError) throw upsertError;

  const progress = await listProgramProgress(userId, client);

  if (DEBUG_PERF) {
    const dt = perfNowMs() - t0;
    console.log(
      `[perf] ensureProgramProgressRows() ${Math.round(dt)}ms (upsert+select, rows=${progress.length})`,
    );
  }

  return progress;
}

