---
agent: 'agent'
---

# New Feature Implementation Prompt

Use the project instructions as the foundation for every decision made during this task.

## Feature Description

<!-- Describe the feature to implement -->

## Implementation Checklist

### 1. Planning
- [ ] Identify the feature scope and break it into small, focused components.
- [ ] Identify shared/reusable logic that should live in a custom hook.
- [ ] Identify shared/reusable UI that should live in a common component.
- [ ] Determine if new routes are needed (`app/` directory).
- [ ] Determine if server or client components are needed.

### 2. Folder Structure
Place all new files **within the existing project structure** — do not create new top-level folders or modify the current architecture.


### 3. TypeScript
- [ ] Define all types and interfaces in the existing `types/` file or create a new `*.types.ts` file inside it.
- [ ] No use of `any` — use `unknown` and narrow the type if needed.
- [ ] All function parameters and return values are explicitly typed.
- [ ] Use `as const` or enums for fixed sets of values.

### 4. React Components
- [ ] Use functional components only.
- [ ] Each component has a single, clear responsibility.
- [ ] Props are typed with a dedicated interface (e.g., `FeatureComponentProps`).
- [ ] Lists always include a `key` prop.
- [ ] `useCallback` is used for event handlers passed as props.
- [ ] `useMemo` is used for expensive computed values.

### 5. Custom Hooks
- [ ] Game loop or animation logic is encapsulated in a custom hook using `useEffect` + `requestAnimationFrame`.
- [ ] Data fetching logic is encapsulated in a custom hook.
- [ ] Hook names start with `use` (e.g., `useGameLoop`, `usePlayerState`).
- [ ] Hooks are pure, reusable, and do not contain JSX.

### 6. Next.js
- [ ] Use Server Components by default; add `"use client"` only when needed.
- [ ] Use `next/image` for images and `next/link` for navigation.
- [ ] Add `generateMetadata` if the feature introduces a new page.
- [ ] Place any server-side logic in `app/api/`.

### 7. Tailwind CSS
- [ ] All styling uses Tailwind utility classes.
- [ ] Dynamic/conditional classes use `cn()` (`clsx` + `tailwind-merge`).
- [ ] Responsive design follows mobile-first (`sm:`, `md:`, `lg:`).
- [ ] No hardcoded color or spacing values — use the Tailwind theme.

### 8. Code Quality
- [ ] No magic numbers or strings — use named constants.
- [ ] Early returns are used to reduce nesting.
- [ ] No direct state or prop mutation.
- [ ] Functions are small and single-responsibility.
- [ ] Descriptive names for variables, functions, and components.

### 9. Tests
Tests are **mandatory** for every new feature. Use **Jest** and **React Testing Library**.

#### Components
- [ ] Render test — component renders without crashing.
- [ ] Props test — component behaves correctly with different prop values.
- [ ] Interaction test — user interactions (click, input, keyboard) produce the expected result using `userEvent`.
- [ ] Snapshot test — add a snapshot for stable UI components.

#### Custom Hooks
- [ ] Test each hook in isolation using `renderHook` from React Testing Library.
- [ ] Cover all state transitions and side effects.
- [ ] Mock external dependencies (`fetch`, timers, `requestAnimationFrame`, etc.).

#### Utilities & Constants
- [ ] Unit test every utility function with valid inputs, edge cases, and invalid inputs.
- [ ] Verify constants and enums have the expected values.

#### General Testing Rules
- [ ] Test **behavior**, not implementation details.
- [ ] Use `screen.getByRole`, `getByText`, and `getByLabelText` — avoid `getByTestId` unless necessary.
- [ ] Mock only what is strictly necessary.
- [ ] Each test has a single, clear assertion goal.
- [ ] Tests are grouped with `describe` blocks matching the component or hook name.
- [ ] All tests pass before the feature is considered complete.

### 10. Reusability Review
Before finalizing, verify:
- [ ] Could any component be moved to `components/ui/` for shared use?
- [ ] Could any hook be moved to `hooks/` for shared use?
- [ ] Could any type be moved to a shared `types/` file?
- [ ] Are there any duplicated patterns that should be abstracted?
- [ ] Are there shared utilities that should have their own test file in `__tests__/`?