import { describe, expect, it } from "vitest";
import { createEmptyBoard, isSafePlacement } from "./board";
import { BOARD_SIZE, EMPTY_CELL } from "./constants";
import { fillBoard } from "./fillBoard";
import type { Board } from "./types";

const isValidSolvedBoard = (board: Board): boolean => {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const value = board[row][col];
      if (value === EMPTY_CELL) return false;

      board[row][col] = EMPTY_CELL;
      const safe = isSafePlacement(board, row, col, value);
      board[row][col] = value;
      if (!safe) return false;
    }
  }
  return true;
};

describe("fillBoard", () => {
  it("fills an empty board completely with a valid solution", () => {
    const board = createEmptyBoard();

    const result = fillBoard(board);

    expect(result).toBe(true);
    expect(isValidSolvedBoard(board)).toBe(true);
  });

  it("respects pre-existing values while filling", () => {
    const board = createEmptyBoard();
    board[0][0] = 5;

    const result = fillBoard(board);

    expect(result).toBe(true);
    expect(board[0][0]).toBe(5);
    expect(isValidSolvedBoard(board)).toBe(true);
  });

  it("returns false when the board cannot be solved", () => {
    const board = createEmptyBoard();
    // Fill box(0,0)'s other 8 cells with 2-9 and place 1 elsewhere in row 0,
    // so every candidate for the empty (0,0) cell is immediately rejected.
    board[0][1] = 2;
    board[0][2] = 3;
    board[1][0] = 4;
    board[1][1] = 5;
    board[1][2] = 6;
    board[2][0] = 7;
    board[2][1] = 8;
    board[2][2] = 9;
    board[0][3] = 1;

    expect(fillBoard(board)).toBe(false);
  });
});
