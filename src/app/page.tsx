import { SudokuGameLoader } from "@/components/sudoku/SudokuGameLoader";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-100 dark:bg-slate-900">
      <SudokuGameLoader />
    </div>
  );
}
