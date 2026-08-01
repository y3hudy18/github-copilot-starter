"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type Board,
  type Difficulty,
  findConflictingCells,
  findEmptyCell,
  findIncorrectCells,
  generatePuzzle,
  isBoardComplete,
} from "@/lib/sudoku";

const DEFAULT_DIFFICULTY: Difficulty = "medium";

const buildPrefilledMask = (board: Board): boolean[][] =>
  board.map((row) => row.map((value) => value !== 0));

interface UseSudokuResult {
  board: Board;
  difficulty: Difficulty;
  prefilled: boolean[][];
  conflictingCells: Set<string>;
  incorrectCells: Set<string>;
  hintCells: Set<string>;
  hintUsed: boolean;
  isSolved: boolean;
  hasStarted: boolean;
  changeDifficulty: (difficulty: Difficulty) => void;
  newGame: () => void;
  updateCell: (row: number, col: number, value: number) => void;
  giveHint: () => void;
  checkBoard: () => void;
}

const startNewPuzzle = (difficulty: Difficulty) => {
  const { puzzle, solution } = generatePuzzle(difficulty);
  return {
    board: puzzle,
    prefilled: buildPrefilledMask(puzzle),
    solution,
    incorrectCells: new Set<string>(),
    hintCells: new Set<string>(),
    hasStarted: false,
  };
};

export const useSudoku = (initialDifficulty: Difficulty = DEFAULT_DIFFICULTY): UseSudokuResult => {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [{ board, prefilled, incorrectCells, hintCells, hasStarted }, setGameState] = useState(() =>
    startNewPuzzle(initialDifficulty),
  );

  const newGame = useCallback(() => {
    setGameState(startNewPuzzle(difficulty));
  }, [difficulty]);

  const changeDifficulty = useCallback((nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty);
    setGameState(startNewPuzzle(nextDifficulty));
  }, []);

  const updateCell = useCallback((row: number, col: number, value: number) => {
    setGameState((previous) => {
      if (previous.prefilled[row][col]) return previous;
      const nextBoard = previous.board.map((r) => [...r]);
      nextBoard[row][col] = value;
      return {
        ...previous,
        board: nextBoard,
        incorrectCells: new Set<string>(),
        hasStarted: previous.hasStarted || value !== 0,
      };
    });
  }, []);

  const giveHint = useCallback(() => {
    setGameState((previous) => {
      if (previous.hintCells.size > 0) return previous;

      const emptyCell = findEmptyCell(previous.board);
      if (!emptyCell) return previous;

      const { row, col } = emptyCell;
      const nextBoard = previous.board.map((r) => [...r]);
      nextBoard[row][col] = previous.solution[row][col];

      const nextPrefilled = previous.prefilled.map((r) => [...r]);
      nextPrefilled[row][col] = true;

      return {
        ...previous,
        board: nextBoard,
        prefilled: nextPrefilled,
        incorrectCells: new Set<string>(),
        hintCells: new Set([`${row}-${col}`]),
      };
    });
  }, []);

  const checkBoard = useCallback(() => {
    setGameState((previous) => ({
      ...previous,
      incorrectCells: findIncorrectCells(previous.board, previous.solution),
    }));
  }, []);

  const conflictingCells = useMemo(() => findConflictingCells(board), [board]);
  const isSolved = useMemo(
    () => isBoardComplete(board) && conflictingCells.size === 0,
    [board, conflictingCells],
  );

  return {
    board,
    difficulty,
    prefilled,
    conflictingCells,
    incorrectCells,
    hintCells,
    hintUsed: hintCells.size > 0,
    isSolved,
    hasStarted,
    changeDifficulty,
    newGame,
    updateCell,
    giveHint,
    checkBoard,
  };
};
