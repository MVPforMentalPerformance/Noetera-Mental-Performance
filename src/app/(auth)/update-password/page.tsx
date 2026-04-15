import { AppCard } from "@/components/app-card";
import { UpdatePasswordForm } from "./update-password-form";

export default function UpdatePasswordPage() {
  return (
    <main className="flex w-full max-w-md flex-col gap-6">
      <AppCard>
        <UpdatePasswordForm />
      </AppCard>
    </main>
  );
}
