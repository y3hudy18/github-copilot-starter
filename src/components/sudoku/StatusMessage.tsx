"use client";

interface StatusMessageProps {
  isSolved: boolean;
  hasConflicts: boolean;
}

export const StatusMessage = ({ isSolved, hasConflicts }: StatusMessageProps) => {
  if (isSolved) {
    return (
      <span className="text-base font-medium text-green-700 dark:text-green-400">
        Congratulations! You solved it!
      </span>
    );
  }

  if (hasConflicts) {
    return (
      <span className="text-base font-medium text-red-700 dark:text-red-400">
        Some cells conflict — fix the highlighted numbers.
      </span>
    );
  }

  return null;
};
