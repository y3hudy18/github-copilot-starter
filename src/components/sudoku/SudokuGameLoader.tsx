"use client";

import dynamic from "next/dynamic";

// Puzzle generation is randomized, so the game must render client-side only to avoid hydration mismatches.
const SudokuGame = dynamic(
  () => import("@/components/sudoku/SudokuGame").then((mod) => mod.SudokuGame),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[520px] w-[368px] items-center justify-center text-slate-500">
        Loading Sudoku…
      </div>
    ),
  },
);

export const SudokuGameLoader = () => <SudokuGame />;
