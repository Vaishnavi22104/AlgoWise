import type {
  Comparison,
  Tone,
  Variable,
  VisualizationState,
} from "@/core/visualization/types";

interface Params {
  nums: number[];
  i?: number;
  /** value -> index entries stored so far, in insertion order. */
  seen: [number, number][];
  /** Index of the stored complement when a pair is found. */
  matchIndex?: number;
  iTone?: Tone;
  vars?: Variable[];
  comparison?: Comparison | null;
  result?: { text: string; tone: "success" | "error" } | null;
}

export function twoSumState(p: Params): VisualizationState {
  return {
    structures: [
      {
        kind: "array",
        id: "nums",
        label: "nums",
        cells: p.nums.map((value, idx) => {
          if (idx === p.matchIndex) return { value, tone: "success" };
          if (idx === p.i) return { value, tone: p.iTone ?? "active" };
          return { value };
        }),
        pointers: p.i === undefined ? [] : [{ index: p.i, label: "i" }],
      },
      {
        kind: "hashmap",
        id: "seen",
        label: "seen  (value -> index)",
        entries: p.seen.map(([key, value]) => ({
          key,
          value,
          tone: value === p.matchIndex ? "success" : "neutral",
        })),
      },
    ],
    variables: p.vars ?? [],
    comparison: p.comparison ?? null,
    result: p.result ?? null,
  };
}
