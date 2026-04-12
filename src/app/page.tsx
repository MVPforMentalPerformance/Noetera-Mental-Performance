import { AppCard } from "@/components/app-card";
import { PrimaryButton } from "@/components/primary-button";
import { ScreenShell } from "@/components/screen-shell";
import { TextLink } from "@/components/text-link";

export default function Home() {
  return (
    <ScreenShell>
      <main className="flex w-full max-w-md flex-col gap-6">
        <AppCard>
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            NOETERA
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            Milestone 1 complete
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            App layout, Supabase stubs, and shared UI primitives are in place.
            Documentation:{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-800">
              docs/MASTER_PLAN.md
            </code>
            . Configure Supabase using{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-800">
              .env.example
            </code>
            .
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Sign-in and the program shell ship in Milestone 2.
          </p>
          <div className="mt-8 flex flex-col gap-4">
            <PrimaryButton type="button" disabled>
              Continue to app
            </PrimaryButton>
            <p className="text-center text-xs text-zinc-500">
              Disabled until authentication is implemented.
            </p>
          </div>
        </AppCard>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-zinc-500">
            Local run and deploy: see{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-700">
              README.md
            </code>{" "}
            at the repo root.
          </p>
          <TextLink
            href="https://nextjs.org/docs"
            external
            className="text-xs font-normal"
          >
            Next.js docs
          </TextLink>
        </div>
      </main>
    </ScreenShell>
  );
}
