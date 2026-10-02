# Animation system

## Rule

Every animation answers one question: **what algorithmic event does this movement represent?** Nothing moves for decoration. The execution state is the source of truth: if `low = 5`, the search range must start at index 5.

## Colour language (tones)

Defined once in `app/globals.css` as `--viz-<tone>-*`, referenced through `core/visualization/tokens.ts`.

| Tone | Meaning |
| --- | --- |
| neutral | normal data |
| active (blue) | currently active element |
| warning (orange) | currently being compared |
| success (green) | correct, found, selected result |
| error (red) | rejected, out of range, invalid |
| pointer (purple) | pointer or reference relationship |

Contributors choose a tone. They never choose a colour.

## Events

`compare`, `select`, `swap`, `insert`, `delete`, `push`, `pop`, `visit`, `move-pointer`, `found`, `not-found`, `update-variable`. Each step may carry one; the UI shows it as a label. See `core/visualization/events.ts`.

## Timing

`core/visualization/timing.ts` defines `instant`, `fast`, `normal`, `slow`, exposed to CSS as `--dur-fast`, `--dur-normal`, `--dur-slow`. Playback speed (Slow / Normal / Fast) is the delay between steps. Never hard-code a duration.

## What moves

- Array pointers slide between cells (a CSS `transform`, because only the index changes).
- The search range bracket resizes.
- Cells change tone with a CSS transition.
- A pushed stack item drops in; hash map entries pop in.
- Linked-list nodes never move. A re-pointed arrow is redrawn and fades in, so reversals are visible.

## Reduced motion

With `prefers-reduced-motion`, transitions and keyframes are cut to ~0ms. Every state change still happens.

## Primitives

`ArrayVisualizer` (`ArrayCell`, `IndexLabel`, `Pointer`, `SearchRange`), `StackVisualizer` (+ `OperationIndicator`), `LinkedListVisualizer` (`Node`, `Arrow`), `HashMapVisualizer`, `VariableBadge`, `ComparisonIndicator`, `ResultIndicator`, `ToneLegend`, composed by `VisualizationCanvas`.
