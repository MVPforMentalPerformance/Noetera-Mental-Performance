import { AppCard } from "@/components/app-card";
import { TextLink } from "@/components/text-link";

export default function CheckEmailPage() {
  return (
    <main className="flex w-full max-w-md flex-col gap-6">
      <AppCard>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          Almost there
        </p>
        <h1 className="mt-2 text-4xl leading-[1.05] text-ink">Check your email</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We sent a confirmation link. Open it to continue into your Mental Clarity dashboard.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <TextLink href="/sign-in" className="text-center text-sm">
            Back to sign in
          </TextLink>
        </div>
      </AppCard>
    </main>
  );
}
