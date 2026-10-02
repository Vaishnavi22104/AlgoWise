import type { Primitive, Variable, VisualizationState } from "@/core/visualization/types";

interface Params {
  items: number[];
  /** Tone of the top item. */
  topTone?: "neutral" | "active" | "success" | "warning";
  operation?: { type: "push" | "pop" | "peek"; value: Primitive } | null;
  vars?: Variable[];
  result?: string;
}

export function stackState({ items, topTone = "neutral", operation = null, vars = [], result }: Params): VisualizationState {
  return {
    structures: [
      {
        kind: "stack",
        id: "stack",
        label: "stack",
        items: items.map((value, i) => ({ value, tone: i === items.length - 1 ? topTone : "neutral" })),
        operation,
      },
    ],
    variables: vars,
    result: result ? { text: result, tone: "success" } : null,
  };
}
