import { BOARD_SIZE, BOX_SIZE, EMPTY_CELL } from "./constants";
import type { Board, CellPosition } from "./types";

export const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY_CELL));

export const deepCopyBoard = (board: Board): Board => board.map((row) => [...row]);

export const findEmptyCell = (board: Board): CellPosition | null => {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col] === EMPTY_CELL) return { row, col };
    }
  }
  return null;
};

const getBoxStart = (index: number): number => index - (index % BOX_SIZE);

/** Checks row, column, and 3x3 box constraints, ignoring the cell being tested. */
export const isSafePlacement = (
  board: Board,
  row: number,
  col: number,
  value: number,
): boolean => {
  for (let i = 0; i < BOARD_SIZE; i += 1) {
    if (i !== col && board[row][i] === value) return false;
    if (i !== row && board[i][col] === value) return false;
  }

  const startRow = getBoxStart(row);
  const startCol = getBoxStart(col);
  for (let i = 0; i < BOX_SIZE; i += 1) {
    for (let j = 0; j < BOX_SIZE; j += 1) {
      const boxRow = startRow + i;
      const boxCol = startCol + j;
      if ((boxRow !== row || boxCol !== col) && board[boxRow][boxCol] === value) {
        return false;
      }
    }
  }

  return true;
};

const shuffle = <T,>(items: T[]): T[] => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const shuffledDigits = (): number[] =>
  shuffle(Array.from({ length: BOARD_SIZE }, (_, i) => i + 1));
