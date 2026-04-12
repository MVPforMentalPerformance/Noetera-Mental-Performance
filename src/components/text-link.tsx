import { cx } from "@/lib/cx";
import Link from "next/link";
import type { ReactNode } from "react";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Use for external URLs; renders a plain anchor with rel security attrs. */
  external?: boolean;
};

const baseClass =
  "text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline";

export function TextLink({
  href,
  children,
  className,
  external,
}: TextLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        className={cx(baseClass, className)}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cx(baseClass, className)}>
      {children}
    </Link>
  );
}
