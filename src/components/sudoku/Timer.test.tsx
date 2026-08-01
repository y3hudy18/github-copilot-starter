import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Timer } from "./Timer";

describe("Timer", () => {
  it("renders 0:00 when no time has elapsed", () => {
    render(<Timer elapsedSeconds={0} />);

    expect(screen.getByRole("timer")).toHaveTextContent("0:00");
  });

  it("pads seconds under 10 with a leading zero", () => {
    render(<Timer elapsedSeconds={5} />);

    expect(screen.getByRole("timer")).toHaveTextContent("0:05");
  });

  it("formats minutes and seconds once past 60 seconds", () => {
    render(<Timer elapsedSeconds={65} />);

    expect(screen.getByRole("timer")).toHaveTextContent("1:05");
  });

  it("formats larger elapsed times correctly", () => {
    render(<Timer elapsedSeconds={725} />);

    expect(screen.getByRole("timer")).toHaveTextContent("12:05");
  });
});
