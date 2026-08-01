import { describe, expect, it } from "vitest";
import { formatElapsedTime } from "./time";

describe("formatElapsedTime", () => {
  it("formats 0 seconds as 0:00", () => {
    expect(formatElapsedTime(0)).toBe("0:00");
  });

  it("pads seconds under 10 with a leading zero", () => {
    expect(formatElapsedTime(5)).toBe("0:05");
  });

  it("formats minutes and seconds once past 60 seconds", () => {
    expect(formatElapsedTime(65)).toBe("1:05");
  });

  it("formats larger elapsed times correctly", () => {
    expect(formatElapsedTime(725)).toBe("12:05");
  });
});
