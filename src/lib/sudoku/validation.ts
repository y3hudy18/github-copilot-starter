import { BOARD_SIZE, BOX_SIZE, EMPTY_CELL } from "./constants";
import type { Board, CellPosition } from "./types";

export const cellKey = ({ row, col }: CellPosition): string => `${row}-${col}`;

const markDuplicates = (cells: CellPosition[], board: Board, conflicts: Set<string>): void => {
  const cellsByValue = new Map<number, CellPosition[]>();

  cells.forEach((cell) => {
    const value = board[cell.row][cell.col];
    if (value === EMPTY_CELL) return;
    const group = cellsByValue.get(value) ?? [];
    group.push(cell);
    cellsByValue.set(value, group);
  });

  cellsByValue.forEach((group) => {
    if (group.length > 1) {
      group.forEach((cell) => conflicts.add(cellKey(cell)));
    }
  });
};

/** Returns the set of "row-col" keys for cells that duplicate a value within their row, column, or box. */
export const findConflictingCells = (board: Board): Set<string> => {
  const conflicts = new Set<string>();

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    const rowCells = Array.from({ length: BOARD_SIZE }, (_, col) => ({ row, col }));
    markDuplicates(rowCells, board, conflicts);
  }

  for (let col = 0; col < BOARD_SIZE; col += 1) {
    const colCells = Array.from({ length: BOARD_SIZE }, (_, row) => ({ row, col }));
    markDuplicates(colCells, board, conflicts);
  }

  for (let boxRow = 0; boxRow < BOARD_SIZE; boxRow += BOX_SIZE) {
    for (let boxCol = 0; boxCol < BOARD_SIZE; boxCol += BOX_SIZE) {
      const boxCells: CellPosition[] = [];
      for (let i = 0; i < BOX_SIZE; i += 1) {
        for (let j = 0; j < BOX_SIZE; j += 1) {
          boxCells.push({ row: boxRow + i, col: boxCol + j });
        }
      }
      markDuplicates(boxCells, board, conflicts);
    }
  }

  return conflicts;
};

export const isBoardComplete = (board: Board): boolean =>
  board.every((row) => row.every((value) => value !== EMPTY_CELL));

export const boardsMatch = (a: Board, b: Board): boolean =>
  a.every((row, r) => row.every((value, c) => value === b[r][c]));

/** Returns the set of "row-col" keys for filled cells that don't match the solved board. */
export const findIncorrectCells = (board: Board, solution: Board): Set<string> => {
  const incorrect = new Set<string>();

  board.forEach((rowValues, row) => {
    rowValues.forEach((value, col) => {
      if (value !== EMPTY_CELL && value !== solution[row][col]) {
        incorrect.add(cellKey({ row, col }));
      }
    });
  });

  return incorrect;
};
