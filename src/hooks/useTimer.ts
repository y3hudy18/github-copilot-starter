"use client";

import { useCallback, useEffect, useState } from "react";

const TICK_INTERVAL_MS = 1000;

interface UseTimerResult {
  elapsedSeconds: number;
  reset: () => void;
}

/** Counts elapsed whole seconds while `isRunning` is true, pausing without losing progress otherwise. */
export const useTimer = (isRunning: boolean): UseTimerResult => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, TICK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const reset = useCallback(() => setElapsedSeconds(0), []);

  return { elapsedSeconds, reset };
};
