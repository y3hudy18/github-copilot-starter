import { BOARD_SIZE, DIFFICULTY_CLUES, EMPTY_CELL } from "./constants";
import { createEmptyBoard, deepCopyBoard } from "./board";
import { fillBoard } from "./fillBoard";
import { hasUniqueSolution } from "./solver";
import type { Board, Difficulty, Puzzle } from "./types";

const allCellPositions = (): Array<[number, number]> => {
  const positions: Array<[number, number]> = [];
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      positions.push([row, col]);
    }
  }
  return positions;
};

const shuffle = <T,>(items: T[]): T[] => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Removes cells one at a time, keeping each removal only if the puzzle
 * still has exactly one solution, until the target clue count is reached.
 */
const removeCellsPreservingUniqueness = (solved: Board, clues: number): Board => {
  const puzzle = deepCopyBoard(solved);
  const cellsToTry = shuffle(allCellPositions());
  let remainingClues = BOARD_SIZE * BOARD_SIZE;

  for (const [row, col] of cellsToTry) {
    if (remainingClues <= clues) break;

    const previousValue = puzzle[row][col];
    puzzle[row][col] = EMPTY_CELL;

    if (hasUniqueSolution(puzzle)) {
      remainingClues -= 1;
    } else {
      puzzle[row][col] = previousValue;
    }
  }

  return puzzle;
};

export const generatePuzzle = (difficulty: Difficulty): Puzzle => {
  const solution = createEmptyBoard();
  fillBoard(solution);
  const puzzle = removeCellsPreservingUniqueness(solution, DIFFICULTY_CLUES[difficulty]);
  return { puzzle, solution };
};
