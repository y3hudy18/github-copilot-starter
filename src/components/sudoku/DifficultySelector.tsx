"use client";

import { DIFFICULTIES, DIFFICULTY_LABELS, type Difficulty } from "@/lib/sudoku";
import { cn } from "@/lib/utils/cn";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onChange: (difficulty: Difficulty) => void;
}

export const DifficultySelector = ({ difficulty, onChange }: DifficultySelectorProps) => (
  <div className="flex gap-2" role="group" aria-label="Difficulty">
    {DIFFICULTIES.map((level) => (
      <button
        key={level}
        type="button"
        onClick={() => onChange(level)}
        aria-pressed={difficulty === level}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          difficulty === level
            ? "bg-blue-700 text-white"
            : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
        )}
      >
        {DIFFICULTY_LABELS[level]}
      </button>
    ))}
  </div>
);
