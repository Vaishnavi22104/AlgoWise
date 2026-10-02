import type {
  Comparison,
  ListPointer,
  Tone,
  Variable,
  VisualizationState,
} from "@/core/visualization/types";

interface Params {
  values: number[];
  /** How many nodes exist so far. */
  count: number;
  pointers: ListPointer[];
  /** Index of the node with the active (blue) tone. */
  active?: number;
  /** Nodes with index below this are already visited. */
  visited?: number;
  /** Index of a freshly linked node. */
  fresh?: number;
  vars?: Variable[];
  comparison?: Comparison | null;
  result?: string;
}

export const nodeId = (i: number) => `n${i + 1}`;

export function listState(p: Params): VisualizationState {
  const nodes = p.values.slice(0, p.count).map((value, i) => {
    let tone: Tone = "neutral";
    if (p.visited !== undefined && i < p.visited) tone = "success";
    if (i === p.active) tone = "active";
    return {
      id: nodeId(i),
      value,
      next: i + 1 < p.count ? nodeId(i + 1) : null,
      tone,
      linkTone: p.fresh !== undefined && i === p.fresh - 1 ? ("pointer" as Tone) : undefined,
    };
  });
  return {
    structures: [{ kind: "linked-list", id: "list", label: "linked list", nodes, pointers: p.pointers }],
    variables: p.vars ?? [],
    comparison: p.comparison ?? null,
    result: p.result ? { text: p.result, tone: "success" } : null,
  };
}
