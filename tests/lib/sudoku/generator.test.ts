import { describe, expect, it } from "vitest";
import { DIFFICULTIES, DIFFICULTY_CLUES } from "@/lib/sudoku/constants";
import { generatePuzzle } from "@/lib/sudoku/generator";
import { countSolutions } from "@/lib/sudoku/solver";
import type { Board } from "@/lib/sudoku/types";

const countClues = (board: Board): number =>
  board.reduce((total, row) => total + row.filter((value) => value !== 0).length, 0);

describe("generatePuzzle", () => {
  it.each(DIFFICULTIES)("produces a %s puzzle with exactly one solution", (difficulty) => {
    const { puzzle, solution } = generatePuzzle(difficulty);

    expect(countSolutions(puzzle)).toBe(1);
    expect(countClues(puzzle)).toBeGreaterThanOrEqual(DIFFICULTY_CLUES[difficulty]);
    expect(countSolutions(solution)).toBe(1);
  });
});
