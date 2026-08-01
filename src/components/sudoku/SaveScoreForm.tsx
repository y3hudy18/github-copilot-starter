"use client";

import { useCallback, useState, type FormEvent } from "react";

interface SaveScoreFormProps {
  onSave: (name: string) => void;
}

export const SaveScoreForm = ({ onSave }: SaveScoreFormProps) => {
  const [name, setName] = useState("");

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedName = name.trim();
      if (!trimmedName) return;
      onSave(trimmedName);
    },
    [name, onSave],
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label htmlFor="player-name" className="sr-only">
        Your name
      </label>
      <input
        id="player-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Enter your name"
        maxLength={20}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="rounded-md bg-green-700 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Save Score
      </button>
    </form>
  );
};
