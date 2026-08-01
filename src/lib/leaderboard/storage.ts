import { LEADERBOARD_STORAGE_KEY, MAX_LEADERBOARD_ENTRIES } from "./constants";
import type { LeaderboardEntry } from "./types";

export const sortByFastestTime = (entries: LeaderboardEntry[]): LeaderboardEntry[] =>
  [...entries].sort((a, b) => a.elapsedSeconds - b.elapsedSeconds);

/** Inserts an entry, keeping only the fastest `MAX_LEADERBOARD_ENTRIES` times. */
export const addEntryToLeaderboard = (
  entries: LeaderboardEntry[],
  entry: LeaderboardEntry,
): LeaderboardEntry[] => sortByFastestTime([...entries, entry]).slice(0, MAX_LEADERBOARD_ENTRIES);

export const loadLeaderboard = (): LeaderboardEntry[] => {
  try {
    const raw = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
};

export const saveLeaderboard = (entries: LeaderboardEntry[]): void => {
  window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
};
