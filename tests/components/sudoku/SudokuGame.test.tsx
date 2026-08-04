import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DIFFICULTY_LABELS } from "@/lib/sudoku/constants";
import { SudokuGame } from "@/components/sudoku/SudokuGame";

describe("SudokuGame", () => {
  it("renders the title, difficulty selector, board, and controls", () => {
    render(<SudokuGame />);

    expect(screen.getByRole("heading", { name: "Sudoku" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Difficulty" })).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(81);
    expect(screen.getByRole("button", { name: "New Game" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hint" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Check" })).toBeInTheDocument();
    expect(screen.getByRole("timer")).toBeInTheDocument();
  });

  it("starts with the medium difficulty selected", () => {
    render(<SudokuGame />);

    expect(screen.getByRole("button", { name: DIFFICULTY_LABELS.medium })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("switches difficulty when a different level is selected", async () => {
    const user = userEvent.setup();
    render(<SudokuGame />);

    await user.click(screen.getByRole("button", { name: DIFFICULTY_LABELS.easy }));

    expect(screen.getByRole("button", { name: DIFFICULTY_LABELS.easy })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("generates a new board when New Game is clicked", async () => {
    const user = userEvent.setup();
    render(<SudokuGame />);

    const before = screen.getAllByRole("textbox").map((input) => (input as HTMLInputElement).value);

    await user.click(screen.getByRole("button", { name: "New Game" }));

    const after = screen.getAllByRole("textbox").map((input) => (input as HTMLInputElement).value);
    expect(after).not.toEqual(before);
  });

  it("does not show the status message initially", () => {
    render(<SudokuGame />);

    expect(screen.queryByText(/congratulations/i)).not.toBeInTheDocument();
  });

  it("fills and locks a cell when Hint is clicked, then blocks further hints", async () => {
    const user = userEvent.setup();
    render(<SudokuGame />);

    const inputsBefore = screen.getAllByRole("textbox") as HTMLInputElement[];
    const emptyIndex = inputsBefore.findIndex((input) => input.value === "");

    await user.click(screen.getByRole("button", { name: "Hint" }));

    const inputsAfter = screen.getAllByRole("textbox") as HTMLInputElement[];
    expect(inputsAfter[emptyIndex].value).not.toBe("");
    expect(inputsAfter[emptyIndex]).toBeDisabled();

    const hintButton = screen.getByRole("button", { name: "Hint Used" });
    expect(hintButton).toBeDisabled();
  });

  it("highlights an incorrect entry when Check is clicked", async () => {
    const user = userEvent.setup();
    render(<SudokuGame />);

    // Find two empty cells in the same row and give them a duplicate value;
    // a solution row has 9 distinct values, so at least one must be wrong.
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const boardSize = 9;
    let colA = -1;
    let colB = -1;
    let targetRow = -1;
    for (let row = 0; row < boardSize && colA === -1; row += 1) {
      const emptyCols = [];
      for (let col = 0; col < boardSize; col += 1) {
        if (inputs[row * boardSize + col].value === "") emptyCols.push(col);
      }
      if (emptyCols.length >= 2) {
        [colA, colB] = emptyCols;
        targetRow = row;
      }
    }

    await user.type(inputs[targetRow * boardSize + colA], "1");
    await user.type(inputs[targetRow * boardSize + colB], "1");
    await user.click(screen.getByRole("button", { name: "Check" }));

    const refreshedInputs = screen.getAllByRole("textbox");
    const flagged =
      refreshedInputs[targetRow * boardSize + colA].getAttribute("aria-invalid") === "true" ||
      refreshedInputs[targetRow * boardSize + colB].getAttribute("aria-invalid") === "true";
    expect(flagged).toBe(true);
  });
});

describe("SudokuGame timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows a 0:00 timer initially", () => {
    render(<SudokuGame />);

    expect(screen.getByRole("timer")).toHaveTextContent("0:00");
  });

  it("does not count before the player enters a number", () => {
    render(<SudokuGame />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByRole("timer")).toHaveTextContent("0:00");
  });

  it("starts counting once the player enters a number", () => {
    render(<SudokuGame />);

    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const emptyInput = inputs.find((input) => input.value === "");

    act(() => {
      fireEvent.change(emptyInput as HTMLInputElement, { target: { value: "5" } });
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByRole("timer")).toHaveTextContent("0:03");
  });

  it("resets the timer when New Game is clicked", () => {
    render(<SudokuGame />);

    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const emptyInput = inputs.find((input) => input.value === "");
    act(() => {
      fireEvent.change(emptyInput as HTMLInputElement, { target: { value: "5" } });
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByRole("timer")).toHaveTextContent("0:05");

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "New Game" }));
    });

    expect(screen.getByRole("timer")).toHaveTextContent("0:00");
  });

  it("resets the timer when the difficulty changes", () => {
    render(<SudokuGame />);

    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const emptyInput = inputs.find((input) => input.value === "");
    act(() => {
      fireEvent.change(emptyInput as HTMLInputElement, { target: { value: "5" } });
    });
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByRole("timer")).toHaveTextContent("0:04");

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: DIFFICULTY_LABELS.hard }));
    });

    expect(screen.getByRole("timer")).toHaveTextContent("0:00");
  });
});

describe("SudokuGame leaderboard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("shows the Top 10 heading with an empty state and no save form", () => {
    render(<SudokuGame />);

    expect(screen.getByRole("heading", { name: "Top 10" })).toBeInTheDocument();
    expect(screen.getByText(/no scores yet/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/your name/i)).not.toBeInTheDocument();
  });
});
