import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

describe("DarkModeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("offers to switch to dark mode by default", () => {
    render(<DarkModeToggle />);

    expect(screen.getByRole("button", { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it("applies the dark class and flips the label when clicked", async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle />);

    await user.click(screen.getByRole("button", { name: /switch to dark mode/i }));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByRole("button", { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it("removes the dark class when toggled back off", async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle />);

    const button = screen.getByRole("button", { name: /switch to dark mode/i });
    await user.click(button);
    await user.click(screen.getByRole("button", { name: /switch to light mode/i }));

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
