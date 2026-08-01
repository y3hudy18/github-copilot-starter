"use client";

import { formatElapsedTime } from "@/lib/utils/time";

interface TimerProps {
  elapsedSeconds: number;
}

export const Timer = ({ elapsedSeconds }: TimerProps) => (
  <div
    role="timer"
    aria-label="Elapsed time"
    className="font-mono text-lg font-medium tabular-nums text-slate-700 dark:text-slate-200"
  >
    {formatElapsedTime(elapsedSeconds)}
  </div>
);
