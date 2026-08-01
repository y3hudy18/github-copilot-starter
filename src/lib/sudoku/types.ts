export type CellValue = number;
export type Board = CellValue[][];

export type Difficulty = "easy" | "medium" | "hard";

export interface CellPosition {
  row: number;
  col: number;
}

export interface Puzzle {
  puzzle: Board;
  solution: Board;
}
