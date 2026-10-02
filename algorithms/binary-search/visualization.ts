import type {
  Comparison,
  ResultBanner,
  Tone,
  Variable,
  VisualizationState,
} from "@/core/visualization/types";

export interface SearchView {
  arr: number[];
  target: number;
  name: string;
  low?: number;
  high?: number;
  /** Highlighted middle element. */
  mid?: number;
  midTone?: Tone;
  /** Value of mid to display as a variable even when it is no longer highlighted. */
  midVar?: number;
  comparison?: Comparison | null;
  result?: ResultBanner | null;
}

/** Builds the visual state for any "search a sorted array" algorithm. */
export function searchState(v: SearchView): VisualizationState {
  const { arr, low, high, mid } = v;
  const n = arr.length;
  const known = low !== undefined && high !== undefined;
  const inRange = (i: number) => !known || (i >= low! && i <= high!);
  const valid = (i: number | undefined): i is number => i !== undefined && i >= 0 && i < n;

  const pointers = [
    ...(valid(low) ? [{ index: low, label: "low" }] : []),
    ...(valid(high) ? [{ index: high, label: "high" }] : []),
    ...(valid(mid) ? [{ index: mid, label: "mid" }] : []),
  ];

  const variables: Variable[] = [
    ...(low !== undefined ? [{ name: "low", value: low, tone: "pointer" as Tone }] : []),
    ...(high !== undefined ? [{ name: "high", value: high, tone: "pointer" as Tone }] : []),
    ...(v.midVar !== undefined ? [{ name: "mid", value: v.midVar, tone: "active" as Tone }] : []),
    { name: "target", value: v.target },
  ];

  return {
    structures: [
      {
        kind: "array",
        id: "arr",
        label: v.name,
        cells: arr.map((value, i) => {
          if (i === mid) return { value, tone: v.midTone ?? "active" };
          if (!inRange(i)) return { value, tone: "error", faded: true };
          return { value };
        }),
        pointers,
        pointerRows: 3,
        range: known && low! <= high! ? { from: low!, to: high!, label: "search range" } : null,
      },
    ],
    variables,
    comparison: v.comparison ?? null,
    result: v.result ?? null,
  };
}
