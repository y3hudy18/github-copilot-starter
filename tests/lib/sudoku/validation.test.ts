import { describe, expect, it } from "vitest";
import { EMPTY_CELL } from "@/lib/sudoku/constants";
import {
  boardsMatch,
  cellKey,
  findConflictingCells,
  isBoardComplete,
} from "@/lib/sudoku/validation";
import type { Board } from "@/lib/sudoku/types";

const emptyBoard = (): Board =>
  Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => EMPTY_CELL));

describe("cellKey", () => {
  it("formats a cell position as row-col", () => {
    expect(cellKey({ row: 3, col: 7 })).toBe("3-7");
  });
});

describe("findConflictingCells", () => {
  it("returns no conflicts for an empty board", () => {
    expect(findConflictingCells(emptyBoard())).toEqual(new Set());
  });

  it("flags duplicate values within the same row", () => {
    const board = emptyBoard();
    board[0][0] = 5;
    board[0][1] = 5;

    const conflicts = findConflictingCells(board);

    expect(conflicts.has("0-0")).toBe(true);
    expect(conflicts.has("0-1")).toBe(true);
    expect(conflicts.size).toBe(2);
  });

  it("flags duplicate values within the same column", () => {
    const board = emptyBoard();
    board[0][0] = 5;
    board[3][0] = 5;

    const conflicts = findConflictingCells(board);

    expect(conflicts.has("0-0")).toBe(true);
    expect(conflicts.has("3-0")).toBe(true);
    expect(conflicts.size).toBe(2);
  });

  it("flags duplicate values within the same 3x3 box", () => {
    const board = emptyBoard();
    board[0][0] = 5;
    board[1][1] = 5;

    const conflicts = findConflictingCells(board);

    expect(conflicts.has("0-0")).toBe(true);
    expect(conflicts.has("1-1")).toBe(true);
    expect(conflicts.size).toBe(2);
  });

  it("does not flag non-duplicate values", () => {
    const board = emptyBoard();
    board[0][0] = 1;
    board[0][1] = 2;

    expect(findConflictingCells(board)).toEqual(new Set());
  });
});

describe("isBoardComplete", () => {
  it("returns false when any cell is empty", () => {
    const board = emptyBoard();
    board[0][0] = 1;

    expect(isBoardComplete(board)).toBe(false);
  });

  it("returns true when every cell has a value", () => {
    const board = emptyBoard().map((row) => row.map(() => 1));

    expect(isBoardComplete(board)).toBe(true);
  });
});

describe("boardsMatch", () => {
  it("returns true for two identical boards", () => {
    const a = emptyBoard();
    const b = emptyBoard();

    expect(boardsMatch(a, b)).toBe(true);
  });

  it("returns false when any cell differs", () => {
    const a = emptyBoard();
    const b = emptyBoard();
    b[4][4] = 9;

    expect(boardsMatch(a, b)).toBe(false);
  });
});
