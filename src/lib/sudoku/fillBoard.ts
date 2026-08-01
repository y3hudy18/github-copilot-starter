import { EMPTY_CELL } from "./constants";
import { findEmptyCell, isSafePlacement, shuffledDigits } from "./board";
import type { Board } from "./types";

/** Fills the board in place using randomized backtracking to produce a full solved grid. */
export const fillBoard = (board: Board): boolean => {
  const empty = findEmptyCell(board);
  if (!empty) return true;

  const { row, col } = empty;
  for (const candidate of shuffledDigits()) {
    if (isSafePlacement(board, row, col, candidate)) {
      board[row][col] = candidate;
      if (fillBoard(board)) return true;
      board[row][col] = EMPTY_CELL;
    }
  }

  return false;
};
