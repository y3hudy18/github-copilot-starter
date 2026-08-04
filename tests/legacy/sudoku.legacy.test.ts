import { beforeAll, describe, expect, it } from "vitest";

declare global {
  interface Window {
    newGame: () => void;
    checkSolution: () => void;
  }
}

const LEGACY_HTML_BODY = `
  <div id="sudoku-board"></div>
  <div class="controls">
    <button onclick="newGame()">New Game</button>
    <button onclick="checkSolution()">Check Solution</button>
    <span id="message"></span>
  </div>
`;

// Exercises the untouched pre-refactor legacy/sudoku.js (byte-identical to
// commit 3beff11e, verified via `git diff 3beff11e:sudoku.js HEAD:legacy/sudoku.js`)
// to establish a passing baseline before any React/Next.js refactor changes.
describe("legacy sudoku.js baseline", () => {
  beforeAll(async () => {
    document.body.innerHTML = LEGACY_HTML_BODY;
    // @ts-expect-error legacy/sudoku.js is a plain script with no exports or type declarations.
    await import("../../legacy/sudoku.js");
  });

  it("exposes the newGame and checkSolution globals", () => {
    expect(typeof window.newGame).toBe("function");
    expect(typeof window.checkSolution).toBe("function");
  });

  it("renders a 9x9 board with the medium clue count prefilled on load", () => {
    const cells = document.querySelectorAll("#sudoku-board input.sudoku-cell");
    expect(cells.length).toBe(81);

    const prefilled = document.querySelectorAll("#sudoku-board input.prefilled");
    expect(prefilled.length).toBe(35);
  });

  it("flags incorrect entries when checking the solution", () => {
    const emptyCells = Array.from(
      document.querySelectorAll<HTMLInputElement>("#sudoku-board input:not(.prefilled)")
    );
    expect(emptyCells.length).toBeGreaterThan(0);

    // A valid puzzle can't have two "1"s in the same row, so at least one
    // filled cell here is guaranteed to mismatch the generated solution.
    emptyCells.forEach((cell) => {
      cell.value = "1";
      cell.dispatchEvent(new Event("input"));
    });

    window.checkSolution();

    expect(document.getElementById("message")?.innerHTML).toContain("incorrect");
  });
});
