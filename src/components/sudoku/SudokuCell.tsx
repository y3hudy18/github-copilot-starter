"use client";

import type { ChangeEvent } from "react";
import { cn } from "@/lib/utils/cn";

interface SudokuCellProps {
  value: number;
  isPrefilled: boolean;
  isInvalid: boolean;
  isHint?: boolean;
  isAlternateBox?: boolean;
  onChange: (value: number) => void;
}

export const SudokuCell = ({
  value,
  isPrefilled,
  isInvalid,
  isHint = false,
  isAlternateBox = false,
  onChange,
}: SudokuCellProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/[^1-9]/g, "");
    onChange(digitsOnly ? Number(digitsOnly) : 0);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value || ""}
      disabled={isPrefilled}
      onChange={handleChange}
      aria-invalid={isInvalid}
      className={cn(
        "flex h-10 w-10 items-center justify-center border border-slate-300 text-center text-lg outline-none transition-colors sm:h-12 sm:w-12 dark:border-slate-600",
        "focus:bg-cyan-50 dark:focus:bg-cyan-950",
        // Background is uniform per 3x3 box (checkerboard); only text styling marks prefilled cells.
        isAlternateBox ? "bg-slate-100 dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800",
        isPrefilled && "font-bold text-slate-800 dark:text-slate-100",
        !isPrefilled && "text-blue-700 dark:text-blue-300",
        isHint && "bg-purple-200 font-bold text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        isInvalid && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      )}
    />
  );
};
