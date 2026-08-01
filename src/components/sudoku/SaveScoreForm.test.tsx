import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SaveScoreForm } from "./SaveScoreForm";

describe("SaveScoreForm", () => {
  it("renders a name input and a disabled Save Score button", () => {
    render(<SaveScoreForm onSave={vi.fn()} />);

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Score" })).toBeDisabled();
  });

  it("enables the button once a name is entered", async () => {
    const user = userEvent.setup();
    render(<SaveScoreForm onSave={vi.fn()} />);

    await user.type(screen.getByLabelText(/your name/i), "Ada");

    expect(screen.getByRole("button", { name: "Save Score" })).toBeEnabled();
  });

  it("calls onSave with the trimmed name on submit", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<SaveScoreForm onSave={onSave} />);

    await user.type(screen.getByLabelText(/your name/i), "  Ada  ");
    await user.click(screen.getByRole("button", { name: "Save Score" }));

    expect(onSave).toHaveBeenCalledWith("Ada");
  });

  it("does not call onSave when the name is blank", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<SaveScoreForm onSave={onSave} />);

    await user.type(screen.getByLabelText(/your name/i), "   ");
    await user.click(screen.getByRole("button", { name: "Save Score" }));

    expect(onSave).not.toHaveBeenCalled();
  });
});
