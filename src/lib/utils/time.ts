const SECONDS_PER_MINUTE = 60;

/** Formats a whole-second duration as `m:ss` (e.g. 65 -> "1:05"). */
export const formatElapsedTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
