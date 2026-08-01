import { describe, expect, it } from "vitest";
import { BOARD_SIZE, EMPTY_CELL } from "./constants";
import {
  createEmptyBoard,
  deepCopyBoard,
  findEmptyCell,
  isSafePlacement,
  shuffledDigits,
} from "./board";

describe("createEmptyBoard", () => {
  it("creates a 9x9 board filled with EMPTY_CELL", () => {
    const board = createEmptyBoard();

    expect(board).toHaveLength(BOARD_SIZE);
    board.forEach((row) => {
      expect(row).toHaveLength(BOARD_SIZE);
      row.forEach((value) => expect(value).toBe(EMPTY_CELL));
    });
  });

  it("creates independent row arrays", () => {
    const board = createEmptyBoard();
    board[0][0] = 5;

    expect(board[1][0]).toBe(EMPTY_CELL);
  });
});

describe("deepCopyBoard", () => {
  it("copies values without sharing row references", () => {
    const board = createEmptyBoard();
    board[0][0] = 7;

    const copy = deepCopyBoard(board);
    copy[0][0] = 9;
    copy[1][1] = 3;

    expect(board[0][0]).toBe(7);
    expect(board[1][1]).toBe(EMPTY_CELL);
    expect(copy[0][0]).toBe(9);
    expect(copy[1][1]).toBe(3);
  });
});

describe("findEmptyCell", () => {
  it("returns null when the board is full", () => {
    const board = createEmptyBoard().map((row) => row.map(() => 1));

    expect(findEmptyCell(board)).toBeNull();
  });

  it("returns the first empty cell in row-major order", () => {
    const board = createEmptyBoard().map((row) => row.map(() => 1));
    board[2][4] = EMPTY_CELL;
    board[5][6] = EMPTY_CELL;

    expect(findEmptyCell(board)).toEqual({ row: 2, col: 4 });
  });
});

describe("isSafePlacement", () => {
  it("allows a value with no conflicts", () => {
    const board = createEmptyBoard();

    expect(isSafePlacement(board, 0, 0, 5)).toBe(true);
  });

  it("rejects a value already present in the same row", () => {
    const board = createEmptyBoard();
    board[0][3] = 5;

    expect(isSafePlacement(board, 0, 0, 5)).toBe(false);
  });

  it("rejects a value already present in the same column", () => {
    const board = createEmptyBoard();
    board[3][0] = 5;

    expect(isSafePlacement(board, 0, 0, 5)).toBe(false);
  });

  it("rejects a value already present in the same 3x3 box", () => {
    const board = createEmptyBoard();
    board[1][1] = 5;

    expect(isSafePlacement(board, 0, 0, 5)).toBe(false);
  });

  it("ignores the target cell's own current value", () => {
    const board = createEmptyBoard();
    board[0][0] = 5;

    expect(isSafePlacement(board, 0, 0, 5)).toBe(true);
  });
});

describe("shuffledDigits", () => {
  it("returns each digit from 1 to 9 exactly once", () => {
    const digits = shuffledDigits();

    expect(digits).toHaveLength(9);
    expect([...digits].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
