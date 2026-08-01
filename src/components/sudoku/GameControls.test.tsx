import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GameControls } from "./GameControls";

describe("GameControls", () => {
  it("renders a New Game button", () => {
    render(<GameControls onNewGame={vi.fn()} onHint={vi.fn()} onCheck={vi.fn()} />);

    expect(screen.getByRole("button", { name: "New Game" })).toBeInTheDocument();
  });

  it("calls onNewGame when clicked", async () => {
    const onNewGame = vi.fn();
    const user = userEvent.setup();
    render(<GameControls onNewGame={onNewGame} onHint={vi.fn()} onCheck={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "New Game" }));

    expect(onNewGame).toHaveBeenCalledOnce();
  });

  it("renders a Hint button", () => {
    render(<GameControls onNewGame={vi.fn()} onHint={vi.fn()} onCheck={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Hint" })).toBeInTheDocument();
  });

  it("calls onHint when the Hint button is clicked", async () => {
    const onHint = vi.fn();
    const user = userEvent.setup();
    render(<GameControls onNewGame={vi.fn()} onHint={onHint} onCheck={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Hint" }));

    expect(onHint).toHaveBeenCalledOnce();
  });

  it("disables the Hint button when hintDisabled is true", () => {
    render(<GameControls onNewGame={vi.fn()} onHint={vi.fn()} onCheck={vi.fn()} hintDisabled />);

    expect(screen.getByRole("button", { name: "Hint" })).toBeDisabled();
  });

  it("disables and marks the Hint button once hintUsed is true", () => {
    render(<GameControls onNewGame={vi.fn()} onHint={vi.fn()} onCheck={vi.fn()} hintUsed />);

    const hintButton = screen.getByRole("button", { name: "Hint Used" });
    expect(hintButton).toBeDisabled();
    expect(hintButton).toHaveClass("bg-purple-700");
  });

  it("does not call onHint when the Hint button is already used", async () => {
    const onHint = vi.fn();
    const user = userEvent.setup();
    render(<GameControls onNewGame={vi.fn()} onHint={onHint} onCheck={vi.fn()} hintUsed />);

    await user.click(screen.getByRole("button", { name: "Hint Used" }));

    expect(onHint).not.toHaveBeenCalled();
  });

  it("renders a Check button", () => {
    render(<GameControls onNewGame={vi.fn()} onHint={vi.fn()} onCheck={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Check" })).toBeInTheDocument();
  });

  it("calls onCheck when the Check button is clicked", async () => {
    const onCheck = vi.fn();
    const user = userEvent.setup();
    render(<GameControls onNewGame={vi.fn()} onHint={vi.fn()} onCheck={onCheck} />);

    await user.click(screen.getByRole("button", { name: "Check" }));

    expect(onCheck).toHaveBeenCalledOnce();
  });
});
