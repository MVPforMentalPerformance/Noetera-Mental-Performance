"use client";

import { useEffect, useTransition } from "react";
import { markDayStartedAction } from "../../_actions";

export function MarkDayStarted({
  day,
  shouldMark,
}: {
  day: number;
  shouldMark: boolean;
}) {
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!shouldMark) return;

    startTransition(async () => {
      await markDayStartedAction({ day });
    });
  }, [day, shouldMark, startTransition]);

  return null;
}
