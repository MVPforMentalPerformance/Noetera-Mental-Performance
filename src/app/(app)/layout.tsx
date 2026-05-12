import { BottomNav } from "@/components/bottom-nav";
import { getUserOrNull } from "@/lib/program/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { signOutAction } from "./_actions";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { user } = await getUserOrNull();

  if (!user) redirect("/sign-in");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-canvas">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 pb-4 pt-6 sm:px-6 sm:pt-8">
          <Link
            href="/#top"
            aria-label="Go to landing page"
            className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <div className="cursor-pointer">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
                Mental Performance
              </p>
              <p className="mt-1 text-lg text-ink sm:text-xl">NOETERA</p>
            </div>
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="cursor-pointer rounded-full border border-border/90 bg-surface/90 px-3.5 py-2 text-xs font-semibold text-muted transition hover:border-accent/30 hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center px-4 pb-(--app-bottom-nav-gutter) pt-5 sm:px-6 sm:pt-6">
        <div className="w-full max-w-lg pb-2">{children}</div>
      </div>

      <BottomNav />
    </div>
  );
}
