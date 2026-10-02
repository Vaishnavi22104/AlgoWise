import type {
  Comparison,
  LinkedListStructure,
  ListNodeState,
  Tone,
  VisualizationState,
} from "@/core/visualization/types";

interface Params {
  a: number[];
  b: number[];
  /** Index of l1 in `a` (a.length means null). */
  l1: number;
  l2: number;
  /** Values appended to the result so far (dummy is implicit). */
  merged: number[];
  /** Index in the result row where tail sits (0 = dummy). */
  tail: number;
  /** Source nodes shown as being compared. */
  comparing?: boolean;
  /** Node picked this step: which list and index. */
  picked?: { list: "a" | "b"; index: number };
  /** Number of freshly appended result nodes (highlighted). */
  fresh?: number;
  /** Highlight the arrow into the first fresh node. */
  linkFresh?: boolean;
  comparison?: Comparison | null;
  result?: string;
  allDone?: boolean;
}

function sourceList(
  id: string,
  label: string,
  prefix: string,
  values: number[],
  at: number,
  pointerLabel: string,
  p: Params,
  listKey: "a" | "b",
): LinkedListStructure {
  const nodes: ListNodeState[] = values.map((value, i) => {
    let tone: Tone = "neutral";
    if (p.comparing && i === at) tone = "warning";
    if (p.picked && p.picked.list === listKey && p.picked.index === i) tone = "success";
    return {
      id: `${prefix}${i}`,
      value,
      next: i + 1 < values.length ? `${prefix}${i + 1}` : null,
      tone,
      faded: i < at && !(p.picked && p.picked.list === listKey && p.picked.index === i),
    };
  });
  return {
    kind: "linked-list",
    id,
    label,
    nodes,
    pointers: [{ target: at < values.length ? `${prefix}${at}` : null, label: pointerLabel }],
  };
}

export function mergeState(p: Params): VisualizationState {
  const total = 1 + p.merged.length;
  const firstFresh = total - (p.fresh ?? 0);
  const resultNodes: ListNodeState[] = [
    {
      id: "r0",
      value: "D",
      next: total > 1 ? "r1" : null,
      tone: "neutral",
      faded: true,
      linkTone: p.linkFresh && firstFresh === 1 ? "pointer" : undefined,
    },
    ...p.merged.map((value, i) => {
      const idx = i + 1;
      const isFresh = idx >= firstFresh && (p.fresh ?? 0) > 0;
      return {
        id: `r${idx}`,
        value,
        next: idx + 1 < total ? `r${idx + 1}` : null,
        tone: (p.allDone || isFresh ? "success" : "neutral") as Tone,
        linkTone: p.linkFresh && idx + 1 === firstFresh ? ("pointer" as Tone) : undefined,
      };
    }),
  ];

  return {
    structures: [
      sourceList("l1", "l1", "a", p.a, p.l1, "l1", p, "a"),
      sourceList("l2", "l2", "b", p.b, p.l2, "l2", p, "b"),
      {
        kind: "linked-list",
        id: "merged",
        label: "merged  (dummy = D)",
        nodes: resultNodes,
        pointers: [
          { target: "r0", label: "dummy" },
          { target: `r${p.tail}`, label: "tail" },
        ],
      },
    ],
    comparison: p.comparison ?? null,
    result: p.result ? { text: p.result, tone: "success" } : null,
  };
}
