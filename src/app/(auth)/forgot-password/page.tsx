import { AppCard } from "@/components/app-card";
import { TextLink } from "@/components/text-link";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex w-full max-w-md flex-col gap-6">
      <AppCard>
        <h1 className="text-4xl leading-[1.05] text-ink">Reset password</h1>
        <p className="mt-3 text-sm text-muted">
          Enter your email and we will send a secure reset link.
        </p>

        <ForgotPasswordForm />

        <div className="mt-5 text-center">
          <TextLink href="/sign-in" className="text-center text-sm">
            Back to sign in
          </TextLink>
        </div>
      </AppCard>
    </main>
  );
}
