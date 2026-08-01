import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LEADERBOARD_STORAGE_KEY, MAX_LEADERBOARD_ENTRIES } from "./constants";
import { addEntryToLeaderboard, loadLeaderboard, saveLeaderboard, sortByFastestTime } from "./storage";
import type { LeaderboardEntry } from "./types";

const buildEntry = (overrides: Partial<LeaderboardEntry> = {}): LeaderboardEntry => ({
  id: "id-1",
  name: "Ada",
  elapsedSeconds: 60,
  difficulty: "easy",
  completedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("sortByFastestTime", () => {
  it("sorts entries by ascending elapsed time", () => {
    const entries = [
      buildEntry({ id: "slow", elapsedSeconds: 200 }),
      buildEntry({ id: "fast", elapsedSeconds: 50 }),
      buildEntry({ id: "medium", elapsedSeconds: 100 }),
    ];

    expect(sortByFastestTime(entries).map((entry) => entry.id)).toEqual(["fast", "medium", "slow"]);
  });

  it("does not mutate the original array", () => {
    const entries = [buildEntry({ id: "a", elapsedSeconds: 2 }), buildEntry({ id: "b", elapsedSeconds: 1 })];
    const original = [...entries];

    sortByFastestTime(entries);

    expect(entries).toEqual(original);
  });
});

describe("addEntryToLeaderboard", () => {
  it("inserts a new entry in the correct sorted position", () => {
    const entries = [buildEntry({ id: "a", elapsedSeconds: 30 }), buildEntry({ id: "b", elapsedSeconds: 90 })];
    const newEntry = buildEntry({ id: "c", elapsedSeconds: 60 });

    expect(addEntryToLeaderboard(entries, newEntry).map((entry) => entry.id)).toEqual(["a", "c", "b"]);
  });

  it(`caps the list at ${MAX_LEADERBOARD_ENTRIES} entries, dropping the slowest`, () => {
    const entries = Array.from({ length: MAX_LEADERBOARD_ENTRIES }, (_, index) =>
      buildEntry({ id: `entry-${index}`, elapsedSeconds: index * 10 }),
    );
    const fastestEntry = buildEntry({ id: "fastest", elapsedSeconds: -1 });

    const result = addEntryToLeaderboard(entries, fastestEntry);

    expect(result).toHaveLength(MAX_LEADERBOARD_ENTRIES);
    expect(result[0].id).toBe("fastest");
    expect(result.find((entry) => entry.id === `entry-${MAX_LEADERBOARD_ENTRIES - 1}`)).toBeUndefined();
  });
});

describe("loadLeaderboard / saveLeaderboard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("returns an empty array when nothing is stored", () => {
    expect(loadLeaderboard()).toEqual([]);
  });

  it("returns an empty array when the stored value is invalid JSON", () => {
    window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, "{not json");

    expect(loadLeaderboard()).toEqual([]);
  });

  it("returns an empty array when the stored value is not an array", () => {
    window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify({ not: "an array" }));

    expect(loadLeaderboard()).toEqual([]);
  });

  it("round-trips entries through localStorage", () => {
    const entries = [buildEntry()];

    saveLeaderboard(entries);

    expect(loadLeaderboard()).toEqual(entries);
  });
});
