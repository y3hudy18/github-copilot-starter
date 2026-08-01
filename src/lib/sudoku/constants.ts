import type { Difficulty } from "./types";

export const BOARD_SIZE = 9;
export const BOX_SIZE = 3;
export const EMPTY_CELL = 0;

// Number of prefilled clues shown for each difficulty level.
export const DIFFICULTY_CLUES: Record<Difficulty, number> = {
  easy: 45,
  medium: 35,
  hard: 26,
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
