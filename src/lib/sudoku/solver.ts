import { BOARD_SIZE } from "./constants";
import { deepCopyBoard, findEmptyCell, isSafePlacement } from "./board";
import type { Board } from "./types";

/**
 * Counts solutions for a board, stopping early once `limit` is reached.
 * Used to confirm a puzzle has exactly one unique solution.
 */
export const countSolutions = (board: Board, limit = 2): number => {
  let solutionCount = 0;

  const solve = (current: Board): boolean => {
    const empty = findEmptyCell(current);
    if (!empty) {
      solutionCount += 1;
      return solutionCount >= limit;
    }

    const { row, col } = empty;
    for (let candidate = 1; candidate <= BOARD_SIZE; candidate += 1) {
      if (isSafePlacement(current, row, col, candidate)) {
        current[row][col] = candidate;
        if (solve(current)) return true;
        current[row][col] = 0;
      }
    }

    return false;
  };

  solve(deepCopyBoard(board));
  return solutionCount;
};

export const hasUniqueSolution = (board: Board): boolean => countSolutions(board, 2) === 1;
