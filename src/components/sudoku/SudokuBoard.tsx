"use client";

import type { Board } from "@/lib/sudoku";
import { cn } from "@/lib/utils/cn";
import { SudokuCell } from "./SudokuCell";

interface SudokuBoardProps {
  board: Board;
  prefilled: boolean[][];
  conflictingCells: Set<string>;
  incorrectCells: Set<string>;
  hintCells?: Set<string>;
  onCellChange: (row: number, col: number, value: number) => void;
}

export const SudokuBoard = ({
  board,
  prefilled,
  conflictingCells,
  incorrectCells,
  hintCells = new Set<string>(),
  onCellChange,
}: SudokuBoardProps) => (
  <div className="inline-block border-4 border-slate-800 bg-white shadow-md dark:border-slate-100 dark:bg-slate-800">
    {board.map((rowValues, row) => (
      <div key={row} className="flex">
        {rowValues.map((value, col) => (
          <div
            key={col}
            className={cn(
              col % 3 === 2 && col !== board.length - 1 && "border-r-2 border-r-slate-800 dark:border-r-slate-300",
              row % 3 === 2 && row !== board.length - 1 && "border-b-2 border-b-slate-800 dark:border-b-slate-300",
            )}
          >
            <SudokuCell
              value={value}
              isPrefilled={prefilled[row][col]}
              isInvalid={conflictingCells.has(`${row}-${col}`) || incorrectCells.has(`${row}-${col}`)}
              isHint={hintCells.has(`${row}-${col}`)}
              isAlternateBox={(Math.floor(row / 3) + Math.floor(col / 3)) % 2 === 1}
              onChange={(nextValue) => onCellChange(row, col, nextValue)}
            />
          </div>
        ))}
      </div>
    ))}
  </div>
);
