# Refactor a Simple Sudoku Game with React and NextJS

Use this simple Sudoku game as a starting point to practice your skills with GitHub Copilot. The goal is to refactor the code to use modern web technologies like React and NextJS, while also adding new features and improving the overall user experience.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Dependencies

- [Node.js](https://nodejs.org/) 18.18 or later
- npm (bundled with Node.js)

### Installation

1. Fork this repository to your GitHub account. Use the "Fork" button on the top right corner of the repository page.
2. Clone your forked repository to your local machine.
3. Install dependencies and start the dev server.

```bash
git clone https://github.com/your-username/<<name of your forked repo>>.git
cd <<name of your forked repo>>
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

The original legacy HTML/CSS/JS implementation is preserved under [legacy/](legacy/) for reference.

## Testing

Tests live under [tests/](tests/), mirroring the `src/` structure, and use Vitest with jsdom.

```bash
npm test            # run the full suite once
npm run test:watch  # watch mode
npm run test:coverage
```

### Baseline (pre-refactor) evidence

Commit [`3beff11e`](https://github.com/y3hudy18/github-copilot-starter/commit/3beff11e) is the last
commit before the React/Next.js refactor began (`4244618` — "feat: scaffold Next.js/React/TypeScript
sudoku migration" — introduced the Next.js app,
game logic, and full Vitest suite all at once, so no automated tests existed prior to it). The files
under [legacy/](legacy/) today are byte-identical to that commit's `index.html`/`sudoku.js`/`styles.css`
(verified with `git diff 3beff11e:sudoku.js HEAD:legacy/sudoku.js`, empty output).

[tests/legacy/sudoku.legacy.test.ts](tests/legacy/sudoku.legacy.test.ts) is a smoke test written against
that untouched legacy script (board renders, exposes `newGame`/`checkSolution`, flags incorrect entries),
run in isolation to demonstrate the pre-refactor game worked before any refactor changes:

```bash
npx vitest run tests/legacy/sudoku.legacy.test.ts
```

## Project Instructions

Use GitHub Copilot to refactor the code for this game to use React, NextJS, and ES6+ features. The goal is to create a more modern and maintainable codebase and add additional functionality to the final product. You can use any combination of code completion and chat features, like Ask, Edit, or Agent modes.

- Game should use React and NextJS for the frontend.
- Use ES6+ features such as arrow functions, destructuring, try/catch blocks, and modules.
- Error should be handled gracefully with appropriate messages to the user.
- Implement a Sudoku board generator that creates a valid Sudoku puzzle with a unique solution.
- Add a timer to track how long it takes to solve the puzzle.
- Implement a solution checker that verifies if the user's solution is correct using event delegation.
- Add a difficulty selector to allow users to choose between easy, medium, and hard puzzles.
- Implement a New Game button to start a new game without refreshing the page.
- Add a hint feature that provides clues for the user that are noted with unique colors.
- Add a check puzzle button that checks the current state of the board against the solution.
- User should get immediate feedback on their input, such as highlighting invalid entries.
- Top 10 scores should be saved in local storage and displayed on the page with the user's name, time taken, hints used, and difficulty level.
- use either modular CSS or a framework like Tailwind CSS for styling.
- The game should be responsive and work well on both desktop and mobile devices.
- UI colors should be visually appealing and accessible.
- Completed and correct puzzles should display a congratulatory message with the time taken and hints used and ask for the user's name for Top 10 times.

## Built With

- [Next.js](https://nextjs.org/) - React framework (App Router)
- [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) - Component-based UI with static typing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling

## License

[License](LICENSE.txt)
