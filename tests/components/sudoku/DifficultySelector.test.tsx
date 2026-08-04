import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DIFFICULTY_LABELS } from "@/lib/sudoku/constants";
import { DifficultySelector } from "@/components/sudoku/DifficultySelector";

describe("DifficultySelector", () => {
  it("renders a button for each difficulty", () => {
    render(<DifficultySelector difficulty="easy" onChange={vi.fn()} />);

    Object.values(DIFFICULTY_LABELS).forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    });
  });

  it("marks the active difficulty as pressed", () => {
    render(<DifficultySelector difficulty="medium" onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: DIFFICULTY_LABELS.medium })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: DIFFICULTY_LABELS.easy })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onChange with the clicked difficulty", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<DifficultySelector difficulty="easy" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: DIFFICULTY_LABELS.hard }));

    expect(onChange).toHaveBeenCalledWith("hard");
  });
});
