import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LEADERBOARD_STORAGE_KEY } from "@/lib/leaderboard";
import { useLeaderboard } from "@/hooks/useLeaderboard";

describe("useLeaderboard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("starts empty when nothing is stored", () => {
    const { result } = renderHook(() => useLeaderboard());

    expect(result.current.entries).toEqual([]);
  });

  it("adds a new entry with the given name, time, difficulty, and hints used", () => {
    const { result } = renderHook(() => useLeaderboard());

    act(() => {
      result.current.addEntry("Ada", 90, "hard", 2);
    });

    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0]).toMatchObject({
      name: "Ada",
      elapsedSeconds: 90,
      difficulty: "hard",
      hintsUsed: 2,
    });
  });

  it("keeps entries sorted by fastest time", () => {
    const { result } = renderHook(() => useLeaderboard());

    act(() => {
      result.current.addEntry("Slow", 200, "easy", 0);
    });
    act(() => {
      result.current.addEntry("Fast", 50, "easy", 0);
    });

    expect(result.current.entries.map((entry) => entry.name)).toEqual(["Fast", "Slow"]);
  });

  it("persists entries to localStorage so they survive a remount", () => {
    const { result, unmount } = renderHook(() => useLeaderboard());

    act(() => {
      result.current.addEntry("Ada", 42, "medium", 1);
    });
    unmount();

    const { result: nextResult } = renderHook(() => useLeaderboard());

    expect(nextResult.current.entries).toHaveLength(1);
    expect(nextResult.current.entries[0]).toMatchObject({ name: "Ada", elapsedSeconds: 42, hintsUsed: 1 });
  });

  it("writes to the shared leaderboard storage key", () => {
    const { result } = renderHook(() => useLeaderboard());

    act(() => {
      result.current.addEntry("Ada", 42, "medium", 0);
    });

    const stored = JSON.parse(window.localStorage.getItem(LEADERBOARD_STORAGE_KEY) ?? "[]");
    expect(stored).toHaveLength(1);
  });
});
