import type { Variable, VisualizationState } from "@/core/visualization/types";

interface Params {
  arr: number[];
  /** Index the loop is currently on. */
  i?: number;
  /** How many leading elements are fully processed. */
  done: number;
  vars: Variable[];
  result?: string;
}

export function traversalState({ arr, i, done, vars, result }: Params): VisualizationState {
  return {
    structures: [
      {
        kind: "array",
        id: "arr",
        label: "arr",
        cells: arr.map((value, idx) => ({
          value,
          tone: idx === i ? (idx < done ? "success" : "active") : idx < done ? "success" : "neutral",
        })),
        pointers: i === undefined ? [] : [{ index: i, label: "i" }],
      },
    ],
    variables: vars,
    result: result ? { text: result, tone: "success" } : null,
  };
}
