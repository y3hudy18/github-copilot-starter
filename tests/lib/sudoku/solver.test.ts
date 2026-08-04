import { describe, expect, it } from "vitest";
import { createEmptyBoard } from "@/lib/sudoku/board";
import { EMPTY_CELL } from "@/lib/sudoku/constants";
import { fillBoard } from "@/lib/sudoku/fillBoard";
import { countSolutions, hasUniqueSolution } from "@/lib/sudoku/solver";
import type { Board } from "@/lib/sudoku/types";

// Fills box(0,0)'s other 8 cells with 2-9 and places 1 elsewhere in row 0, so
// every candidate for the empty (0,0) cell is rejected immediately (no backtracking).
const buildDeadEndBoard = (): Board => {
  const board = createEmptyBoard();
  board[0][1] = 2;
  board[0][2] = 3;
  board[1][0] = 4;
  board[1][1] = 5;
  board[1][2] = 6;
  board[2][0] = 7;
  board[2][1] = 8;
  board[2][2] = 9;
  board[0][3] = 1;
  return board;
};

describe("countSolutions", () => {
  it("counts exactly one solution for a fully solved board", () => {
    const board = createEmptyBoard();
    fillBoard(board);

    expect(countSolutions(board)).toBe(1);
  });

  it("counts zero solutions for an unsolvable board", () => {
    expect(countSolutions(buildDeadEndBoard())).toBe(0);
  });

  it("stops counting once the limit is reached", () => {
    const board = createEmptyBoard();

    // A fully empty board has far more than 2 solutions; limit should cap the count.
    expect(countSolutions(board, 2)).toBe(2);
  });

  it("does not mutate the original board", () => {
    const board = createEmptyBoard();
    fillBoard(board);
    const snapshot = board.map((row) => [...row]);

    countSolutions(board);

    expect(board).toEqual(snapshot);
  });
});

describe("hasUniqueSolution", () => {
  it("returns true for a fully solved board", () => {
    const board = createEmptyBoard();
    fillBoard(board);

    expect(hasUniqueSolution(board)).toBe(true);
  });

  it("returns false for an empty board with many solutions", () => {
    const board = createEmptyBoard();

    expect(hasUniqueSolution(board)).toBe(false);
  });

  it("returns false for an unsolvable board", () => {
    expect(hasUniqueSolution(buildDeadEndBoard())).toBe(false);
  });

  it("returns true when a solved board has a single empty cell with one possible value", () => {
    const board = createEmptyBoard();
    fillBoard(board);
    const missingRow = 0;
    const missingCol = 0;
    board[missingRow][missingCol] = EMPTY_CELL;

    expect(hasUniqueSolution(board)).toBe(true);
  });
});
