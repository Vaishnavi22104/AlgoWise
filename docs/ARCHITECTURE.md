# Architecture

## The pipeline

```text
Algorithm definition -> Executor -> Step state -> Visualization renderer -> UI controls
```

| Stage | Where | Responsibility |
| --- | --- | --- |
| Definition | `algorithms/*/metadata.ts`, `code.ts` | Title, category, complexity, and the code in each language |
| Executor | `algorithms/*/executor.ts` | Runs the algorithm on a fixed input and records steps |
| Step state | `algorithms/*/visualization.ts` | Converts variables into a `VisualizationState` |
| Renderer | `components/visualization/*` | Draws any `VisualizationState`; knows no algorithms |
| Controls | `core/visualization/playback.ts`, `components/algorithm/*` | Previous, step, play, pause, reset, speed, scrub |

The renderer and controls never import an algorithm. They receive an array of steps.

## The step

```ts
type AlgorithmStep = {
  id: number;                 // 1-based, sequential
  anchor: string;             // language-independent code position, e.g. "mid"
  operation: string;          // "Comparing arr[mid] with target"
  explanation: string;        // one or two beginner-friendly sentences
  state: VisualizationState;  // what to draw
  event?: VisualizationEvent; // compare | select | push | pop | ...
};
```

The editor highlights the line each language maps `anchor` to, the canvas draws `state`, and the explanation panel shows `operation` and `explanation`. All three come from the same object, so they stay in sync.

## Languages

The engine is language-independent. Language only decides which source text is shown.

```
Algorithm -> execution steps -> visualization state -> renderer      (shared, written once)
                  |
                  +-- anchor "mid" --> Java:   line 5  int mid = low + (high - low) / 2;
                                  \--> Python: line 5  mid = (low + high) // 2
```

- `core/algorithm/languages.ts` lists the supported languages (`LANGUAGES`: Java, Python), the default (Java) and `defineCode()`, which turns code annotated with `//@anchor` or `#@anchor` into `{ source, lines }`.
- Each algorithm has `languages: { java: {...}, python: {...} }`. Steps carry an `anchor`, never a line number, so the same trace highlights the right line in every language.
- `lib/language.ts` remembers the learner's choice in `localStorage` (`algowise:language`). Switching language only changes the code panel: playback, the current step and the visualization are untouched.
- There is no compiler, interpreter or code runner. Traces are still produced by trusted executor functions.

Adding another language later: see [ADDING-LANGUAGE.md](ADDING-LANGUAGE.md). It does not touch the visualization engine.

## The registry

`content/index.ts` is the manifest. Adding an algorithm means one import and one list entry (`npm run create-algorithm` edits it for you). `core/algorithm/registry.ts` stores definitions and provides lookup and search. Concepts, LeetCode, search, related links and routes are all generated from the registry.

## Server and client

Pages are server components. `generateStaticParams` builds a page per registered algorithm. `AlgorithmView` is a client component that runs the executor in the browser, wraps the page in an error boundary with a Retry button, and drives playback.

## Validation

`core/algorithm/validate.ts` checks every registered trace: sequential ids, every `anchor` defined in every language, pointer indexes inside the array, linked-list pointers and links that refer to real nodes, known tones. `tests/registry.test.ts` runs it against every algorithm, so a broken contribution fails CI.

## My Learning and future accounts

My Learning (`/learning`) is **self-reported** and **local-only**. There is no login, no backend and no database.

- `lib/progress-stats.ts`: the pure model and calculations (no React, no storage). Saved shape:
  `{ version: 2, checkpoints: { [conceptSlug]: { understand?, explore?, practice? } }, completedProblems: { [problemSlug]: timestamp } }`.
  XP is derived from this (Understand +10, Explore +10, each recommended problem +20; Practice +0), never stored, so it cannot drift. Opening a page earns nothing.
- `lib/progress.ts`: the browser store (`localStorage` key `algowise:progress:v1`, `useSyncExternalStore`). Data from the first prototype (no `version: 2`) is discarded on load.
- `content/learning.ts`: which problems are recommended for which concept.
- `components/progress/LearningJourney.tsx`: the page UI.

To add real accounts later, persist the same `ProgressData` object per user (for example one row per user with a JSON column, or tables for checkpoints and completed problems) and merge the local copy on first sign-in. The model has no UI dependencies, so nothing else changes. Accounts, sync, streaks, learning paths and social features are listed as future contribution opportunities and are **not implemented**.

## Security

Version 1 never evaluates user code. Traces come from trusted executor functions reviewed in PRs. A future editor must run code in a sandboxed worker with timeouts and memory limits.
