import type { Variable, VisualizationState } from "@/core/visualization/types";

interface Params {
  arr: number[];
  /** Index being examined (blue). */
  i?: number;
  /** Index of the best value so far (green). */
  best?: number;
  vars?: Variable[];
  result?: string;
}

/**
 * Turns the algorithm's variables into a VisualizationState.
 * Rule: this is the ONLY place that decides what is drawn. Use tones, never colours.
 */
export function templateAlgorithmState({ arr, i, best, vars = [], result }: Params): VisualizationState {
  return {
    structures: [
      {
        kind: "array",
        id: "arr",
        label: "arr",
        cells: arr.map((value, idx) => ({
          value,
          tone: idx === best ? "success" : idx === i ? "active" : "neutral",
        })),
        pointers: i === undefined ? [] : [{ index: i, label: "x" }],
      },
    ],
    variables: vars,
    result: result ? { text: result, tone: "success" } : null,
  };
}
