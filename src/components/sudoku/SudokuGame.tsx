"use client";

import { useCallback, useState } from "react";
import type { Difficulty } from "@/lib/sudoku";
import { useSudoku } from "@/hooks/useSudoku";
import { useTimer } from "@/hooks/useTimer";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { SudokuBoard } from "./SudokuBoard";
import { DifficultySelector } from "./DifficultySelector";
import { GameControls } from "./GameControls";
import { StatusMessage } from "./StatusMessage";
import { Timer } from "./Timer";
import { SaveScoreForm } from "./SaveScoreForm";
import { Leaderboard } from "./Leaderboard";

export const SudokuGame = () => {
  const {
    board,
    difficulty,
    prefilled,
    conflictingCells,
    incorrectCells,
    hintCells,
    hintUsed,
    hintCount,
    isSolved,
    hasStarted,
    changeDifficulty,
    newGame,
    updateCell,
    giveHint,
    checkBoard,
  } = useSudoku();

  const { elapsedSeconds, reset: resetTimer } = useTimer(hasStarted && !isSolved);
  const { entries: leaderboardEntries, addEntry: addLeaderboardEntry } = useLeaderboard();
  const [hasSavedScore, setHasSavedScore] = useState(false);

  const handleNewGame = useCallback(() => {
    newGame();
    resetTimer();
    setHasSavedScore(false);
  }, [newGame, resetTimer]);

  const handleChangeDifficulty = useCallback(
    (nextDifficulty: Difficulty) => {
      changeDifficulty(nextDifficulty);
      resetTimer();
      setHasSavedScore(false);
    },
    [changeDifficulty, resetTimer],
  );

  const handleSaveScore = useCallback(
    (name: string) => {
      addLeaderboardEntry(name, elapsedSeconds, difficulty, hintCount);
      setHasSavedScore(true);
    },
    [addLeaderboardEntry, elapsedSeconds, difficulty, hintCount],
  );

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Sudoku</h1>

      <DifficultySelector difficulty={difficulty} onChange={handleChangeDifficulty} />

      <Timer elapsedSeconds={elapsedSeconds} />

      <SudokuBoard
        board={board}
        prefilled={prefilled}
        conflictingCells={conflictingCells}
        incorrectCells={incorrectCells}
        hintCells={hintCells}
        onCellChange={updateCell}
      />

      <div className="flex items-center gap-4">
        <GameControls
          onNewGame={handleNewGame}
          onHint={giveHint}
          onCheck={checkBoard}
          hintDisabled={isSolved}
          hintUsed={hintUsed}
        />
        <StatusMessage
          isSolved={isSolved}
          hasConflicts={conflictingCells.size > 0 || incorrectCells.size > 0}
        />
      </div>

      {isSolved && !hasSavedScore && <SaveScoreForm onSave={handleSaveScore} />}

      <section className="flex flex-col items-center gap-2">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Top 10</h2>
        <Leaderboard entries={leaderboardEntries} />
      </section>
    </div>
  );
};
