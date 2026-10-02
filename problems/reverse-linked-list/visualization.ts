import type {
  Comparison,
  ListPointer,
  Tone,
  VisualizationState,
} from "@/core/visualization/types";

export const nodeId = (i: number) => `n${i + 1}`;

interface Params {
  values: number[];
  /** next[i] is the node id (or null) that node i currently points to. */
  next: (string | null)[];
  /** Node ids that are already reversed. */
  reversed: string[];
  curr?: string | null;
  /** Node whose arrow was just re-pointed. */
  relinked?: string;
  pointers: ListPointer[];
  comparison?: Comparison | null;
  result?: string;
}

export function reverseState(p: Params): VisualizationState {
  return {
    structures: [
      {
        kind: "linked-list",
        id: "list",
        label: "linked list",
        nodes: p.values.map((value, i) => {
          const id = nodeId(i);
          let tone: Tone = "neutral";
          if (p.reversed.includes(id)) tone = "success";
          if (id === p.curr) tone = "active";
          return {
            id,
            value,
            next: p.next[i],
            tone,
            linkTone: id === p.relinked ? ("pointer" as Tone) : undefined,
          };
        }),
        pointers: p.pointers,
        allowArcs: true,
      },
    ],
    comparison: p.comparison ?? null,
    result: p.result ? { text: p.result, tone: "success" } : null,
  };
}
