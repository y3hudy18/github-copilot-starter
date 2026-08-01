import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTimer } from "./useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at zero", () => {
    const { result } = renderHook(() => useTimer(true));

    expect(result.current.elapsedSeconds).toBe(0);
  });

  it("increments once per second while running", () => {
    const { result } = renderHook(() => useTimer(true));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.elapsedSeconds).toBe(3);
  });

  it("does not increment while paused", () => {
    const { result } = renderHook(() => useTimer(false));

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.elapsedSeconds).toBe(0);
  });

  it("stops incrementing once isRunning becomes false", () => {
    const { result, rerender } = renderHook(({ isRunning }) => useTimer(isRunning), {
      initialProps: { isRunning: true },
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.elapsedSeconds).toBe(2);

    rerender({ isRunning: false });

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.elapsedSeconds).toBe(2);
  });

  it("resets elapsed time back to zero", () => {
    const { result } = renderHook(() => useTimer(true));

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(result.current.elapsedSeconds).toBe(4);

    act(() => {
      result.current.reset();
    });

    expect(result.current.elapsedSeconds).toBe(0);
  });
});
