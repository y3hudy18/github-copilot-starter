"use client";

import { DIFFICULTY_LABELS } from "@/lib/sudoku";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { formatElapsedTime } from "@/lib/utils/time";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export const Leaderboard = ({ entries }: LeaderboardProps) => {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No scores yet — solve a puzzle to make the Top 10!
      </p>
    );
  }

  return (
    <ol className="w-full max-w-sm divide-y divide-slate-200 text-sm dark:divide-slate-700">
      {entries.map((entry, index) => (
        <li key={entry.id} className="flex items-center justify-between gap-3 py-1.5">
          <span className="w-5 text-right font-semibold text-slate-500 dark:text-slate-400">
            {index + 1}.
          </span>
          <span className="flex-1 truncate text-slate-800 dark:text-slate-100">{entry.name}</span>
          <span className="text-slate-500 dark:text-slate-400">{DIFFICULTY_LABELS[entry.difficulty]}</span>
          <span className="font-mono tabular-nums text-slate-800 dark:text-slate-100">
            {formatElapsedTime(entry.elapsedSeconds)}
          </span>
        </li>
      ))}
    </ol>
  );
};
