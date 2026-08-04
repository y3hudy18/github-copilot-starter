"use client";

import { useCallback, useState } from "react";
import type { Difficulty } from "@/lib/sudoku";
import { addEntryToLeaderboard, loadLeaderboard, saveLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard";

const createEntryId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

interface UseLeaderboardResult {
  entries: LeaderboardEntry[];
  addEntry: (name: string, elapsedSeconds: number, difficulty: Difficulty, hintsUsed: number) => void;
}

export const useLeaderboard = (): UseLeaderboardResult => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() => loadLeaderboard());

  const addEntry = useCallback(
    (name: string, elapsedSeconds: number, difficulty: Difficulty, hintsUsed: number) => {
      setEntries((previous) => {
        const nextEntries = addEntryToLeaderboard(previous, {
          id: createEntryId(),
          name,
          elapsedSeconds,
          difficulty,
          hintsUsed,
          completedAt: new Date().toISOString(),
        });
        saveLeaderboard(nextEntries);
        return nextEntries;
      });
    },
    [],
  );

  return { entries, addEntry };
};
