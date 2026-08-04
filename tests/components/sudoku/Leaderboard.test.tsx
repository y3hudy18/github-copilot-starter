import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LeaderboardEntry } from "@/lib/leaderboard";
import { Leaderboard } from "@/components/sudoku/Leaderboard";

const buildEntry = (overrides: Partial<LeaderboardEntry> = {}): LeaderboardEntry => ({
  id: "id-1",
  name: "Ada",
  elapsedSeconds: 65,
  difficulty: "easy",
  hintsUsed: 0,
  completedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("Leaderboard", () => {
  it("shows an empty state message when there are no entries", () => {
    render(<Leaderboard entries={[]} />);

    expect(screen.getByText(/no scores yet/i)).toBeInTheDocument();
  });

  it("renders each entry's name, difficulty, and formatted time", () => {
    render(<Leaderboard entries={[buildEntry({ name: "Ada", elapsedSeconds: 65, difficulty: "hard" })]} />);

    const item = screen.getByRole("listitem");
    expect(item).toHaveTextContent("Ada");
    expect(item).toHaveTextContent("Hard");
    expect(item).toHaveTextContent("1:05");
  });

  it("renders the number of hints used, singular and plural", () => {
    render(
      <Leaderboard
        entries={[
          buildEntry({ id: "none", hintsUsed: 0 }),
          buildEntry({ id: "one", hintsUsed: 1 }),
          buildEntry({ id: "many", hintsUsed: 3 }),
        ]}
      />,
    );

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("0 hints");
    expect(items[1]).toHaveTextContent("1 hint");
    expect(items[2]).toHaveTextContent("3 hints");
  });

  it("renders entries in the order they're given, numbered from 1", () => {
    render(
      <Leaderboard
        entries={[
          buildEntry({ id: "first", name: "Ada", elapsedSeconds: 30 }),
          buildEntry({ id: "second", name: "Grace", elapsedSeconds: 60 }),
        ]}
      />,
    );

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("1.");
    expect(items[0]).toHaveTextContent("Ada");
    expect(items[1]).toHaveTextContent("2.");
    expect(items[1]).toHaveTextContent("Grace");
  });
});
