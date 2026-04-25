"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function saveDisplayNameAction(formData: FormData) {
  const name = String(formData.get("displayName") ?? "").trim();

  if (!name) redirect("/onboarding?error=required");
  if (name.length > 60) redirect("/onboarding?error=toolong");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { error } = await supabase
    .from("user_profiles")
    .update({ display_name: name })
    .eq("id", user.id);

  if (error) redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);

  redirect("/dashboard");
}
