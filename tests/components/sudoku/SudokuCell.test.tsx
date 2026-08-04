import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SudokuCell } from "@/components/sudoku/SudokuCell";

describe("SudokuCell", () => {
  it("renders an empty input when value is 0", () => {
    render(<SudokuCell value={0} isPrefilled={false} isInvalid={false} onChange={vi.fn()} />);

    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("renders the numeric value", () => {
    render(<SudokuCell value={7} isPrefilled={false} isInvalid={false} onChange={vi.fn()} />);

    expect(screen.getByRole("textbox")).toHaveValue("7");
  });

  it("disables the input when prefilled", () => {
    render(<SudokuCell value={3} isPrefilled onChange={vi.fn()} isInvalid={false} />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("sets aria-invalid when isInvalid is true", () => {
    render(<SudokuCell value={3} isPrefilled={false} isInvalid onChange={vi.fn()} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("applies the hint styling when isHint is true", () => {
    render(<SudokuCell value={4} isPrefilled isInvalid={false} isHint onChange={vi.fn()} />);

    expect(screen.getByRole("textbox")).toHaveClass("bg-purple-200");
  });

  it("calls onChange with the numeric digit typed", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SudokuCell value={0} isPrefilled={false} isInvalid={false} onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "5");

    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("calls onChange with 0 when non-digit characters are entered", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SudokuCell value={0} isPrefilled={false} isInvalid={false} onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "a");

    expect(onChange).toHaveBeenCalledWith(0);
  });
});
