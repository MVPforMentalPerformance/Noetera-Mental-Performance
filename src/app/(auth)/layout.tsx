import { ScreenShell } from "@/components/screen-shell";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <ScreenShell className="py-12 sm:py-16">{children}</ScreenShell>;
}
