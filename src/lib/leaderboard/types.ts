import type { Difficulty } from "@/lib/sudoku";

export interface LeaderboardEntry {
  id: string;
  name: string;
  elapsedSeconds: number;
  difficulty: Difficulty;
  hintsUsed: number;
  completedAt: string;
}
