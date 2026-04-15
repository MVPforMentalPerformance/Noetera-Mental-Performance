import type { Metadata } from "next";
import "./globals.css";
import { ThemeInitScript } from "@/components/theme-init-script";

export const metadata: Metadata = {
  title: "Mental Clarity | NOETERA",
  description: "Warm, focused mental performance workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-theme="light"
      data-accent="earth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeInitScript />
        {children}
      </body>
    </html>
  );
}
