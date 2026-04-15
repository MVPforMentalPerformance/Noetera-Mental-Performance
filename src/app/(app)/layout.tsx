import { BottomNav } from "@/components/bottom-nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { signOutAction } from "./_actions";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas">
      <header className="bg-canvas/70">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between px-2.5 pb-5 pt-8 sm:px-6 sm:pt-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Mental Clarity
            </p>
            <p className="mt-1 text-xl text-ink">NOETERA</p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="cursor-pointer rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-accent/30 hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center px-2.5 pb-24 sm:px-6">
        <div className="w-full max-w-lg pb-2">{children}</div>
      </div>

      <BottomNav />
    </div>
  );
}
