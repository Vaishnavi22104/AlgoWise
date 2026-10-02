# Adding an algorithm

About 30 minutes for a simple concept. You never touch layout, controls or colours.

## 1. Generate the folder

```bash
npm run create-algorithm -- selection-sort --title "Selection Sort"
```

This copies `algorithms/_template` to `algorithms/selection-sort` and registers it in `content/index.ts`. (Manual route: copy the folder yourself and add an import and a list entry to the marked places in `content/index.ts`.)

For a problem walkthrough use `--problem`; see [ADDING-PROBLEM.md](ADDING-PROBLEM.md).

## 2. Fill in `metadata.ts`

`category` and `difficulty` must come from the lists in `core/algorithm/types.ts`. Write `description` for a beginner, explain the complexity in plain words, and add 2–3 paragraphs under `howItWorks`. `inputSummary` is the fixed demo input as text.

## 3. Write `code.ts`

The code shown in the editor, once per language: **Java (the default) and Python**. Keep each version short and equivalent.

End every line that a step can highlight with `//@name` (Java) or `#@name` (Python). Use the **same names in both languages**. The markers are removed from what learners see, and line numbers are computed for you, so you never count lines.

```ts
java: defineCode(`int mid = low + (high - low) / 2;   //@mid`),
python: defineCode(`mid = (low + high) // 2           #@mid`),
```

The visualization is shared: you never write animation code per language. A test fails if a step points at an anchor that one of the languages is missing.

## 4. Write `executor.ts`

Run the algorithm and record one step per interesting moment:

```ts
const t = createTrace();
t.step({
  anchor: "mid",                                 // the //@mid / #@mid line in code.ts
  operation: `mid = middle of ${low} and ${high}`, // short, language-neutral label
  explanation: "mid points at the middle element.",
  event: "select",                               // optional
  state: searchState({ arr, low, high, mid }),
});
return t.steps;
```

Guidelines:

- Step on lines that change something or make a decision, including loop checks.
- Keep `operation` under ~50 characters, `explanation` under two sentences.
- Keep `operation` and `explanation` **language-neutral**: say "null", "empty stack", "middle index", not `None`, `//` or `append()`. A test rejects common Python-only wording.
- Never mutate arrays that you also put into a state; build a fresh state per step.

## 5. Describe the state in `visualization.ts`

Return a `VisualizationState` from your variables using the existing structures:

| Structure | Use for |
| --- | --- |
| `array` | cells, pointers under cells, an optional highlighted range |
| `stack` | items bottom-to-top and a push/pop/peek badge |
| `linked-list` | nodes, `next` links, labelled pointers; slots never move |
| `hashmap` | key/value chips |

Add `variables`, a `comparison` and a `result` banner when they help. Choose **tones**, not colours:

| Tone | Meaning |
| --- | --- |
| `neutral` | normal data |
| `active` | element currently being worked on |
| `warning` | being compared |
| `success` | correct, found, finished |
| `error` | rejected, out of range, invalid |
| `pointer` | pointer or reference relationship |

If you need a visual that does not exist (a tree, a graph), open a discussion before building a new primitive.

## 6. Wire it up in `index.ts`

Pass your metadata, code, the fixed `input` and the `execute` function to `defineAlgorithm`.

## 7. Test it

Copy the patterns in `executor.test.ts`. Cover normal input, empty input, a single element, target not found, duplicates and already-sorted data where they apply, plus the final state and an important intermediate state. `tests/registry.test.ts` automatically checks every registered algorithm for valid steps and for anchors that exist in every language.

## 8. Run the checks

```bash
npm run lint
npm run test
npm run build
```

## 9. Look at it

`npm run dev`, then open `/visualize/<slug>`. Step through it and ask: can a beginner see what changed? Is the highlighted line the one that did it?

## 10. Open a PR

Use the PR template. Screenshots or a short GIF help reviewers.

## Optional: include it in My Learning

New concepts do not appear in My Learning automatically, because its checkpoints and recommended problems are a curated journey. To add one, append an entry to `LEARNING_PATH` in `content/learning.ts` (the concept slug and the problem slugs recommended for it). `tests/progress.test.ts` pins the current path, so update the expected list there too.
