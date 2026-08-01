import type { Difficulty } from "@/lib/sudoku";

export interface LeaderboardEntry {
  id: string;
  name: string;
  elapsedSeconds: number;
  difficulty: Difficulty;
  completedAt: string;
}
