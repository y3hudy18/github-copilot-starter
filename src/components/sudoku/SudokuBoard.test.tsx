import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createEmptyBoard } from "@/lib/sudoku/board";
import { SudokuBoard } from "./SudokuBoard";

const buildPrefilledMask = (rows: number, cols: number, prefilledValue = false) =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => prefilledValue));

describe("SudokuBoard", () => {
  it("renders 81 cells", () => {
    const board = createEmptyBoard();

    render(
      <SudokuBoard
        board={board}
        prefilled={buildPrefilledMask(9, 9)}
        conflictingCells={new Set()}
        incorrectCells={new Set()}
        onCellChange={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("textbox")).toHaveLength(81);
  });

  it("marks conflicting cells as invalid", () => {
    const board = createEmptyBoard();
    board[0][0] = 5;
    board[0][1] = 5;

    render(
      <SudokuBoard
        board={board}
        prefilled={buildPrefilledMask(9, 9)}
        conflictingCells={new Set(["0-0", "0-1"])}
        incorrectCells={new Set()}
        onCellChange={vi.fn()}
      />,
    );

    const invalidCells = screen
      .getAllByRole("textbox")
      .filter((input) => input.getAttribute("aria-invalid") === "true");
    expect(invalidCells).toHaveLength(2);
  });

  it("marks incorrect cells as invalid", () => {
    const board = createEmptyBoard();
    board[0][0] = 3;

    render(
      <SudokuBoard
        board={board}
        prefilled={buildPrefilledMask(9, 9)}
        conflictingCells={new Set()}
        incorrectCells={new Set(["0-0"])}
        onCellChange={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("textbox")[0]).toHaveAttribute("aria-invalid", "true");
  });

  it("applies the hint styling to cells listed in hintCells", () => {
    const board = createEmptyBoard();
    board[0][0] = 7;
    const prefilled = buildPrefilledMask(9, 9);
    prefilled[0][0] = true;

    render(
      <SudokuBoard
        board={board}
        prefilled={prefilled}
        conflictingCells={new Set()}
        incorrectCells={new Set()}
        hintCells={new Set(["0-0"])}
        onCellChange={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("textbox")[0]).toHaveClass("bg-purple-200");
  });

  it("disables prefilled cells", () => {
    const board = createEmptyBoard();
    board[0][0] = 9;
    const prefilled = buildPrefilledMask(9, 9);
    prefilled[0][0] = true;

    render(
      <SudokuBoard
        board={board}
        prefilled={prefilled}
        conflictingCells={new Set()}
        incorrectCells={new Set()}
        onCellChange={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("textbox")[0]).toBeDisabled();
  });

  it("calls onCellChange with the correct row and column when editing", async () => {
    const board = createEmptyBoard();
    const onCellChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SudokuBoard
        board={board}
        prefilled={buildPrefilledMask(9, 9)}
        conflictingCells={new Set()}
        incorrectCells={new Set()}
        onCellChange={onCellChange}
      />,
    );

    // Second cell in the first row corresponds to row 0, col 1.
    await user.type(screen.getAllByRole("textbox")[1], "4");

    expect(onCellChange).toHaveBeenCalledWith(0, 1, 4);
  });
});
