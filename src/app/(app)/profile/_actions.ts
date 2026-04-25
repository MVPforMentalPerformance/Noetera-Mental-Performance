"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updateDisplayNameAction(formData: FormData) {
  const name = String(formData.get("displayName") ?? "").trim();

  if (!name) redirect("/profile?error=required");
  if (name.length > 60) redirect("/profile?error=toolong");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { error } = await supabase
    .from("user_profiles")
    .update({ display_name: name })
    .eq("id", user.id);

  if (error) redirect(`/profile?error=${encodeURIComponent(error.message)}`);

  redirect("/profile?saved=1");
}
