import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// A valid, fully solved Sudoku board used to make the puzzle deterministically
// completable with a single hint, without depending on the real generator.
const SOLVED_BOARD = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

vi.mock("@/lib/sudoku", async () => {
  const actual = await vi.importActual<typeof import("@/lib/sudoku")>("@/lib/sudoku");
  return {
    ...actual,
    generatePuzzle: () => {
      const puzzle = SOLVED_BOARD.map((row) => [...row]);
      puzzle[0][0] = 0;
      return { puzzle, solution: SOLVED_BOARD.map((row) => [...row]) };
    },
  };
});

const { SudokuGame } = await import("@/components/sudoku/SudokuGame");

describe("SudokuGame leaderboard integration", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("shows the save form once solved via a single hint, then adds the score to the leaderboard", () => {
    render(<SudokuGame />);

    fireEvent.click(screen.getByRole("button", { name: "Hint" }));

    expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hint Used" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Ada" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Score" }));

    expect(screen.getByRole("list")).toHaveTextContent("Ada");
    expect(screen.queryByLabelText(/your name/i)).not.toBeInTheDocument();
  });
});
