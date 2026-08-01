import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusMessage } from "./StatusMessage";

describe("StatusMessage", () => {
  it("shows a success message when solved", () => {
    render(<StatusMessage isSolved hasConflicts={false} />);

    expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
  });

  it("shows a conflict message when there are conflicts and it is not solved", () => {
    render(<StatusMessage isSolved={false} hasConflicts />);

    expect(screen.getByText(/some cells conflict/i)).toBeInTheDocument();
  });

  it("prioritizes the solved message over conflicts", () => {
    render(<StatusMessage isSolved hasConflicts />);

    expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
    expect(screen.queryByText(/some cells conflict/i)).not.toBeInTheDocument();
  });

  it("renders nothing when not solved and there are no conflicts", () => {
    const { container } = render(<StatusMessage isSolved={false} hasConflicts={false} />);

    expect(container).toBeEmptyDOMElement();
  });
});
