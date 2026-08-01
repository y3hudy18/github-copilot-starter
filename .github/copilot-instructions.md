# GitHub Copilot Instructions

## Project Context

This project is a **legacy HTML + JavaScript game** being refactored into a modern stack.
The target stack is **Next.js + React + TypeScript + Tailwind CSS**, following ES6+ syntax and best practices throughout.

---

## JavaScript / TypeScript — ES6+ Syntax & Best Practices

For **every JS/TS file** in this project, always use modern ES6+ syntax and follow these best practices:

### Syntax

- Use `const` and `let` instead of `var`.
- Use **arrow functions** (`=>`) for anonymous functions and callbacks.
- Use **template literals** instead of string concatenation.
- Use **destructuring** for objects and arrays.
- Use the **spread/rest operator** (`...`) where applicable.
- Use **default parameter values** in function signatures.
- Use **optional chaining** (`?.`) and **nullish coalescing** (`??`).
- Use **logical assignment operators** (`&&=`, `||=`, `??=`).

### Modules

- Use **ES Modules** (`import`/`export`) — never `require`/`module.exports`.
- Prefer **named exports** over default exports when exporting multiple values.

### Async Code

- Use `async`/`await` instead of `.then()`/`.catch()` chains.
- Always handle errors with `try`/`catch` in async functions.

### Array & Object Methods

- Prefer functional array methods: `map()`, `filter()`, `reduce()`, `find()`, `some()`, `every()`, `flatMap()`.
- Use `Object.entries()`, `Object.keys()`, `Object.values()`, and `Object.fromEntries()`.

### General Best Practices

- Keep functions small, pure, and single-responsibility.
- Avoid mutating function arguments or external state.
- Use **early returns** to reduce nesting.
- Prefer **immutability** — avoid direct mutation; use spread or methods that return new values.
- Use **descriptive variable and function names**.
- Avoid magic numbers and strings — use named constants.

---

## TypeScript

- Always define **explicit types** for function parameters and return values.
- Use **interfaces** for object shapes and **type aliases** for unions/intersections.
- Avoid `any` — use `unknown` when the type is truly unknown, then narrow it.
- Use **generics** to write reusable, type-safe utilities.
- Enable and respect **strict mode** (`"strict": true` in `tsconfig.json`).
- Use **enums** or `as const` objects for fixed sets of values (e.g., game states, directions).

---

## React

- Use **functional components** exclusively — no class components.
- Use **React hooks** (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, etc.).
- Keep components **small and focused** — one responsibility per component.
- Lift state up only as far as necessary; prefer **local state** when possible.
- Use **custom hooks** to encapsulate and reuse logic (e.g., `useGameLoop`, `usePlayerState`).
- Always provide a **`key`** prop when rendering lists.
- Avoid inline function definitions in JSX when performance matters — use `useCallback`.
- Use **React Context** sparingly; prefer prop drilling for shallow trees or a state manager for complex state.

---

## Next.js

- Use the **App Router** (`app/` directory) — not the Pages Router.
- Prefer **React Server Components (RSC)** by default; only use `"use client"` when interactivity or browser APIs are needed.
- Use **`next/image`** for all images and **`next/link`** for all internal navigation.
- Use **route-based code splitting** naturally provided by the App Router.
- Keep **API routes** in `app/api/` and use them only for server-side logic.
- Use **`generateMetadata`** for dynamic page metadata.

---

## Tailwind CSS

- Use **Tailwind utility classes** exclusively for styling — avoid custom CSS unless absolutely necessary.
- Follow a **mobile-first** approach using responsive prefixes (`sm:`, `md:`, `lg:`, etc.).
- Use `cn()` (via `clsx` + `tailwind-merge`) for conditional and dynamic class composition.
- Extract repeated class combinations into **reusable components**, not custom CSS classes.
- Use Tailwind's **`theme`** configuration for custom colors, spacing, and fonts — avoid hardcoded values.

---

## Refactoring Guidelines (Legacy → Modern)

- Replace **global variables** with scoped state (React state or context).
- Replace **DOM manipulation** (`getElementById`, `innerHTML`, etc.) with **React JSX and state**.
- Replace **`setTimeout`/`setInterval` game loops** with `useEffect` + `requestAnimationFrame`.
- Replace **inline event handlers** (`onclick`, `onkeydown` in HTML) with React event props.
- Break large monolithic JS files into **small, focused modules and components**.
- Preserve **game logic correctness** during refactoring — refactor structure, not behavior.