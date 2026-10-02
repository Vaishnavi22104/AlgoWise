import type {
  Comparison,
  Tone,
  VisualizationState,
} from "@/core/visualization/types";

interface Params {
  chars: string[];
  /** Index of the character being read. */
  i?: number;
  iTone?: Tone;
  /** Indexes already matched (shown green). */
  matched: number[];
  stack: string[];
  stackTopTone?: Tone;
  operation?: { type: "push" | "pop"; value: string } | null;
  comparison?: Comparison | null;
  result?: { text: string; tone: "success" | "error" } | null;
}

export function parenthesesState(p: Params): VisualizationState {
  return {
    structures: [
      {
        kind: "array",
        id: "input",
        label: "s",
        cells: p.chars.map((value, idx) => {
          if (idx === p.i) return { value, tone: p.iTone ?? "active" };
          if (p.matched.includes(idx)) return { value, tone: "success" };
          return { value };
        }),
        pointers: p.i === undefined ? [] : [{ index: p.i, label: "ch" }],
      },
      {
        kind: "stack",
        id: "stack",
        label: "stack",
        items: p.stack.map((value, idx) => ({
          value,
          tone: idx === p.stack.length - 1 ? (p.stackTopTone ?? "neutral") : "neutral",
        })),
        operation: p.operation ?? null,
      },
    ],
    comparison: p.comparison ?? null,
    result: p.result ?? null,
  };
}
