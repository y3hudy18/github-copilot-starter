"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sudoku-color-scheme";
const DARK_CLASS = "dark";

type ColorScheme = "light" | "dark";

const prefersDarkScheme = (): boolean =>
  typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;

const readStoredScheme = (): ColorScheme | null => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
};

interface UseDarkModeResult {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

/** Applies/removes the `dark` class on the document root and persists the choice. */
export const useDarkMode = (): UseDarkModeResult => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

  useEffect(() => {
    // Deferred to an effect (not a lazy initializer) so the server-rendered
    // and first client render match, avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColorScheme(readStoredScheme() ?? (prefersDarkScheme() ? "dark" : "light"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(DARK_CLASS, colorScheme === "dark");
    window.localStorage.setItem(STORAGE_KEY, colorScheme);
  }, [colorScheme]);

  const toggleDarkMode = useCallback(() => {
    setColorScheme((previous) => (previous === "dark" ? "light" : "dark"));
  }, []);

  return { isDarkMode: colorScheme === "dark", toggleDarkMode };
};
