import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { isBoardComplete } from "@/lib/sudoku";
import { useSudoku } from "./useSudoku";

describe("useSudoku", () => {
  it("starts with a medium puzzle by default", () => {
    const { result } = renderHook(() => useSudoku());

    expect(result.current.difficulty).toBe("medium");
    expect(result.current.board).toHaveLength(9);
    expect(result.current.prefilled).toHaveLength(9);
  });

  it("accepts an initial difficulty", () => {
    const { result } = renderHook(() => useSudoku("medium"));

    expect(result.current.difficulty).toBe("medium");
  });

  it("marks prefilled cells to match the initial board values", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    result.current.board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        expect(result.current.prefilled[rowIndex][colIndex]).toBe(value !== 0);
      });
    });
  });

  it("updates a non-prefilled cell", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    const [row, col] = findEditableCell(result.current.prefilled);

    act(() => {
      result.current.updateCell(row, col, 7);
    });

    expect(result.current.board[row][col]).toBe(7);
  });

  it("has not started until the player enters a value", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    expect(result.current.hasStarted).toBe(false);

    const [row, col] = findEditableCell(result.current.prefilled);

    act(() => {
      result.current.updateCell(row, col, 7);
    });

    expect(result.current.hasStarted).toBe(true);
  });

  it("stays started after clearing the entered cell", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    const [row, col] = findEditableCell(result.current.prefilled);

    act(() => {
      result.current.updateCell(row, col, 7);
    });
    act(() => {
      result.current.updateCell(row, col, 0);
    });

    expect(result.current.hasStarted).toBe(true);
  });

  it("resets hasStarted on a new game", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    const [row, col] = findEditableCell(result.current.prefilled);
    act(() => {
      result.current.updateCell(row, col, 7);
    });
    expect(result.current.hasStarted).toBe(true);

    act(() => {
      result.current.newGame();
    });

    expect(result.current.hasStarted).toBe(false);
  });

  it("does not update a prefilled cell", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    const [row, col] = findPrefilledCell(result.current.prefilled);
    const originalValue = result.current.board[row][col];

    act(() => {
      result.current.updateCell(row, col, (originalValue % 9) + 1);
    });

    expect(result.current.board[row][col]).toBe(originalValue);
  });

  it("generates a new puzzle on newGame", () => {
    const { result } = renderHook(() => useSudoku("easy"));
    const originalBoard = result.current.board;

    act(() => {
      result.current.newGame();
    });

    expect(result.current.board).not.toBe(originalBoard);
    expect(result.current.difficulty).toBe("easy");
  });

  it("changes difficulty and regenerates the puzzle", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    act(() => {
      result.current.changeDifficulty("medium");
    });

    expect(result.current.difficulty).toBe("medium");
  });

  it("fills an empty cell with the correct value and locks it", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    const [row, col] = findEditableCell(result.current.prefilled);

    act(() => {
      result.current.giveHint();
    });

    expect(result.current.board[row][col]).not.toBe(0);
    expect(result.current.prefilled[row][col]).toBe(true);
    expect(result.current.conflictingCells.has(`${row}-${col}`)).toBe(false);
  });

  it("marks the hinted cell in hintCells and sets hintUsed", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    expect(result.current.hintUsed).toBe(false);

    act(() => {
      result.current.giveHint();
    });

    expect(result.current.hintUsed).toBe(true);
    expect(result.current.hintCells.size).toBe(1);
  });

  it("does not fill another cell when giveHint is called again", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    act(() => {
      result.current.giveHint();
    });
    const boardAfterFirstHint = result.current.board;
    const hintCellsAfterFirstHint = result.current.hintCells;

    act(() => {
      result.current.giveHint();
    });

    expect(result.current.board).toBe(boardAfterFirstHint);
    expect(result.current.hintCells).toBe(hintCellsAfterFirstHint);
  });

  it("resets hintUsed and hintCells on newGame", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    act(() => {
      result.current.giveHint();
    });
    expect(result.current.hintUsed).toBe(true);

    act(() => {
      result.current.newGame();
    });

    expect(result.current.hintUsed).toBe(false);
    expect(result.current.hintCells.size).toBe(0);
  });

  it("resets hintUsed and hintCells on changeDifficulty", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    act(() => {
      result.current.giveHint();
    });
    expect(result.current.hintUsed).toBe(true);

    act(() => {
      result.current.changeDifficulty("medium");
    });

    expect(result.current.hintUsed).toBe(false);
    expect(result.current.hintCells.size).toBe(0);
  });

  it("does nothing when the board has no empty cells", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    result.current.prefilled.forEach((rowValues, rowIndex) => {
      rowValues.forEach((isPrefilled, colIndex) => {
        if (!isPrefilled) {
          act(() => {
            result.current.updateCell(rowIndex, colIndex, 1);
          });
        }
      });
    });

    const boardBeforeHint = result.current.board;

    act(() => {
      result.current.giveHint();
    });

    expect(result.current.board).toBe(boardBeforeHint);
  });

  it("reports conflicting cells for duplicate values in the same row", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    const [row, colA, colB] = findTwoEditableCellsInSameRow(result.current.prefilled);

    act(() => {
      result.current.updateCell(row, colA, 5);
    });
    act(() => {
      result.current.updateCell(row, colB, 5);
    });

    expect(result.current.conflictingCells.has(`${row}-${colA}`)).toBe(true);
    expect(result.current.conflictingCells.has(`${row}-${colB}`)).toBe(true);
  });

  it("does not flag incorrect cells until checkBoard is called", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    const [row, colA, colB] = findTwoEditableCellsInSameRow(result.current.prefilled);

    act(() => {
      result.current.updateCell(row, colA, 1);
    });
    act(() => {
      result.current.updateCell(row, colB, 1);
    });

    expect(result.current.incorrectCells.size).toBe(0);
  });

  it("flags a wrong entry as incorrect once checkBoard is called", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    // A solution row has 9 distinct values, so duplicating 1 across two cells
    // guarantees at least one of them is wrong.
    const [row, colA, colB] = findTwoEditableCellsInSameRow(result.current.prefilled);

    act(() => {
      result.current.updateCell(row, colA, 1);
    });
    act(() => {
      result.current.updateCell(row, colB, 1);
    });
    act(() => {
      result.current.checkBoard();
    });

    const flagged =
      result.current.incorrectCells.has(`${row}-${colA}`) ||
      result.current.incorrectCells.has(`${row}-${colB}`);
    expect(flagged).toBe(true);
  });

  it("clears incorrectCells after editing a cell", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    const [row, colA, colB] = findTwoEditableCellsInSameRow(result.current.prefilled);

    act(() => {
      result.current.updateCell(row, colA, 1);
    });
    act(() => {
      result.current.updateCell(row, colB, 1);
    });
    act(() => {
      result.current.checkBoard();
    });
    expect(result.current.incorrectCells.size).toBeGreaterThan(0);

    act(() => {
      result.current.updateCell(row, colA, 0);
    });

    expect(result.current.incorrectCells.size).toBe(0);
  });

  it("isSolved is false while the board has empty cells", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    expect(isBoardComplete(result.current.board)).toBe(false);
    expect(result.current.isSolved).toBe(false);
  });

  it("isSolved is false once complete when filled values create conflicts", () => {
    const { result } = renderHook(() => useSudoku("easy"));

    result.current.prefilled.forEach((row, rowIndex) => {
      row.forEach((isPrefilled, colIndex) => {
        if (!isPrefilled) {
          act(() => {
            result.current.updateCell(rowIndex, colIndex, 1);
          });
        }
      });
    });

    expect(isBoardComplete(result.current.board)).toBe(true);
    expect(result.current.isSolved).toBe(false);
  });
});

const findEditableCell = (prefilled: boolean[][]): [number, number] => {
  for (let row = 0; row < prefilled.length; row += 1) {
    for (let col = 0; col < prefilled[row].length; col += 1) {
      if (!prefilled[row][col]) return [row, col];
    }
  }
  throw new Error("No editable cell found");
};

const findPrefilledCell = (prefilled: boolean[][]): [number, number] => {
  for (let row = 0; row < prefilled.length; row += 1) {
    for (let col = 0; col < prefilled[row].length; col += 1) {
      if (prefilled[row][col]) return [row, col];
    }
  }
  throw new Error("No prefilled cell found");
};

const findTwoEditableCellsInSameRow = (prefilled: boolean[][]): [number, number, number] => {
  for (let row = 0; row < prefilled.length; row += 1) {
    const editableCols = prefilled[row]
      .map((isPrefilled, col) => (isPrefilled ? -1 : col))
      .filter((col) => col !== -1);
    if (editableCols.length >= 2) return [row, editableCols[0], editableCols[1]];
  }
  throw new Error("No row with two editable cells found");
};
