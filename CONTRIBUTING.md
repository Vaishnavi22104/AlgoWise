# Contributing to AlgoWise

Thank you for helping. **You do not have to build the whole application to contribute.** One algorithm, one animation tweak, one clearer explanation, one test: all of these matter.

## Ways to contribute

| You want to | Start here |
| --- | --- |
| Add a visualization | [docs/ADDING-ALGORITHM.md](docs/ADDING-ALGORITHM.md) |
| Add a problem walkthrough | [docs/ADDING-PROBLEM.md](docs/ADDING-PROBLEM.md) |
| Improve an animation | [docs/ANIMATION-SYSTEM.md](docs/ANIMATION-SYSTEM.md) |
| Fix a bug, docs, accessibility, performance | open an issue or a PR |

Issues are labelled by difficulty: **Beginner** (docs, UI text, a small visualization), **Intermediate** (new algorithm, tests, animation work) and **Advanced** (engine, performance, accessibility, architecture).

## Workflow

1. Fork the repository and create a branch (`feat/queue-visualization`).
2. `npm install`, then `npm run create-algorithm -- queue` (or copy `algorithms/_template`).
3. Fill in `metadata.ts`, `code.ts` (Java and Python, same `//@anchor` names), `executor.ts`, `visualization.ts`.
4. Add tests in `executor.test.ts`.
5. `npm run lint && npm run test && npm run build`.
6. Open a PR using the template and describe what you changed.

## Rules that keep the project consistent

- **Design tokens only.** Choose a `Tone`, never a hex colour. See `core/visualization/tokens.ts`.
- **Shared primitives only.** Use the array, stack, linked list and hash map renderers. If you need a new primitive, open a discussion first.
- **One step format.** Every step has an `anchor` (a language-independent code position), `operation`, `explanation`, `state` and an optional `event`.
- **Central timing.** No hard-coded animation durations. See `core/visualization/timing.ts`.
- **No extra animation or UI libraries.** No new dependency without discussion.
- **The state is the truth.** A step may never draw something that contradicts the algorithm.
- **TypeScript strict, ESLint and Prettier clean.** Small files, small functions.
- **Original content.** Write your own explanations and code. Write problem statements in your own words; do not paste them from other sites.

## Quality bar for a visualization

1. A beginner can see what changed.
2. The current code line is obvious.
3. The relevant data is highlighted.
4. Every animation maps to an algorithmic event.
5. It can pause, step and reset.
6. It uses the standard design system.
7. It works on a small screen.
8. It has tests (normal input, empty, single element, not found, duplicates).

## Reporting bugs and ideas

Use the issue templates: Feature request, New visualization, Bug report.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).
