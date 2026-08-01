"use client";

import { cn } from "@/lib/utils/cn";

interface GameControlsProps {
  onNewGame: () => void;
  onHint: () => void;
  onCheck: () => void;
  hintDisabled?: boolean;
  hintUsed?: boolean;
}

export const GameControls = ({
  onNewGame,
  onHint,
  onCheck,
  hintDisabled = false,
  hintUsed = false,
}: GameControlsProps) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={onNewGame}
      className="rounded-md bg-blue-700 px-5 py-2 text-base font-medium text-white transition-colors hover:bg-blue-800"
    >
      New Game
    </button>
    <button
      type="button"
      onClick={onHint}
      disabled={hintDisabled || hintUsed}
      className={cn(
        "rounded-md px-5 py-2 text-base font-medium text-white transition-colors disabled:cursor-not-allowed",
        hintUsed
          ? "bg-purple-700 disabled:opacity-100"
          : "bg-amber-500 hover:bg-amber-600 disabled:opacity-50",
      )}
    >
      {hintUsed ? "Hint Used" : "Hint"}
    </button>
    <button
      type="button"
      onClick={onCheck}
      className="rounded-md bg-slate-600 px-5 py-2 text-base font-medium text-white transition-colors hover:bg-slate-700"
    >
      Check
    </button>
  </div>
);
