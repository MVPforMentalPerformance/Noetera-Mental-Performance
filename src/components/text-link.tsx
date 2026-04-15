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
  "cursor-pointer text-sm font-semibold text-accent underline-offset-4 transition hover:text-accent2 hover:underline";

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
