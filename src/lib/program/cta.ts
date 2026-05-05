import type { ensureProgramProgressRows } from "@/lib/program/server";

export type ProgramCta = {
  label: string;
  href: string;
};

export function getPrimaryProgramCta(
  progress: Awaited<ReturnType<typeof ensureProgramProgressRows>>,
): ProgramCta {
  const nextIncomplete = progress.find((d) => d.completed_at == null);
  if (!nextIncomplete) return { label: "Continue your training", href: "/program/complete" };

  const started = progress.some((d) => d.completed_at != null);
  return {
    label: started ? `Continue Day ${nextIncomplete.day_index}` : "Begin Day 1",
    href: `/program/day/${nextIncomplete.day_index}`,
  };
}

