import { FeatureGrid } from "@/components/marketing/feature-grid";
import { LandingHero } from "@/components/marketing/hero";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1">
        <LandingHero />
        <FeatureGrid />
      </main>
      <SiteFooter />
    </div>
  );
}
