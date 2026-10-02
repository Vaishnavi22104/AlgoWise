import { createTrace } from "@/core/algorithm/trace";
import type { AlgorithmStep } from "@/core/algorithm/types";
import { mergeState } from "./visualization";

export interface MergeInput {
  a: number[];
  b: number[];
}

/**
 * Lines: 2 dummy, 3 tail, 4 loop, 5 compare, 6/9 attach, 7/10 advance source,
 * 11 tail = tail.next, 12 attach remainder, 13 return.
 */
export function mergeTrace({ a, b }: MergeInput): AlgorithmStep[] {
  const t = createTrace();
  const merged: number[] = [];
  let l1 = 0;
  let l2 = 0;
  let tail = 0;
  const s = (extra: Partial<Parameters<typeof mergeState>[0]> = {}) =>
    mergeState({ a, b, l1, l2, merged, tail, ...extra });

  t.step({
    anchor: "dummy",
    operation: "dummy = ListNode()",
    explanation: "A placeholder node (D) means we never have to special-case an empty result. The real answer starts at dummy.next.",
    event: "insert",
    state: s(),
  });
  t.step({
    anchor: "tail",
    operation: "tail = dummy",
    explanation: "tail always points at the last node of the merged list. Right now that is the dummy.",
    event: "move-pointer",
    state: s(),
  });

  while (l1 < a.length && l2 < b.length) {
    t.step({
      anchor: "loop",
      operation: "while l1 and l2:",
      explanation: "Both lists still have nodes, so we keep choosing the smaller front node.",
      event: "compare",
      state: s({ comparison: { left: "l1", op: "and", right: "l2 are not null", holds: true, tone: "warning" } }),
    });

    const fromA = a[l1] <= b[l2];
    t.step({
      anchor: "compare",
      operation: `Is l1.val <= l2.val?  (${a[l1]} <= ${b[l2]})`,
      explanation: fromA
        ? `${a[l1]} is not larger than ${b[l2]}, so the node from l1 goes next.`
        : `${a[l1]} is larger than ${b[l2]}, so the node from l2 goes next.`,
      event: "compare",
      state: s({
        comparing: true,
        comparison: { left: `l1.val = ${a[l1]}`, op: "<=", right: `l2.val = ${b[l2]}`, holds: fromA, tone: "warning" },
      }),
    });

    const value = fromA ? a[l1] : b[l2];
    const list = fromA ? "a" : "b";
    const index = fromA ? l1 : l2;
    merged.push(value);
    t.step({
      anchor: fromA ? "take-l1" : "take-l2",
      operation: `tail.next = ${fromA ? "l1" : "l2"}`,
      explanation: `Attach the node ${value} after tail. The merged list grows by one.`,
      event: "insert",
      state: s({ picked: { list, index }, fresh: 1, linkFresh: true }),
    });

    if (fromA) l1++;
    else l2++;
    t.step({
      anchor: fromA ? "advance-l1" : "advance-l2",
      operation: `${fromA ? "l1 = l1.next" : "l2 = l2.next"}`,
      explanation: `Move ${fromA ? "l1" : "l2"} forward so we compare its next node in the following round.`,
      event: "move-pointer",
      state: s({ fresh: 1 }),
    });

    tail++;
    t.step({
      anchor: "tail-next",
      operation: "tail = tail.next",
      explanation: "tail moves onto the node we just attached, ready for the next one.",
      event: "move-pointer",
      state: s(),
    });
  }

  t.step({
    anchor: "loop",
    operation: "while l1 and l2:  (one list is empty)",
    explanation: `${l1 >= a.length ? "l1" : "l2"} is null, so there is nothing left to compare.`,
    event: "compare",
    state: s({ comparison: { left: "l1", op: "and", right: "l2 are not null", holds: false, tone: "warning" } }),
  });

  const rest = l1 < a.length ? a.slice(l1) : b.slice(l2);
  const restList = l1 < a.length ? "l1" : "l2";
  merged.push(...rest);
  if (l1 < a.length) l1 = a.length;
  else l2 = b.length;
  t.step({
    anchor: "remainder",
    operation: "tail.next = l1 or l2",
    explanation:
      rest.length > 0
        ? `The leftover nodes of ${restList} (${rest.join(", ")}) are already sorted and larger than everything merged so far. Attach them in one move.`
        : "Both lists are empty, so there is nothing left to attach.",
    event: "insert",
    state: s({ fresh: rest.length, linkFresh: rest.length > 0 }),
  });

  t.step({
    anchor: "return",
    operation: "return dummy.next",
    explanation: "Skip the dummy placeholder: the merged list starts at dummy.next.",
    event: "found",
    state: s({
      allDone: true,
      tail: merged.length,
      result: `Merged: ${merged.join(" -> ")} -> null`,
    }),
  });
  return t.steps;
}
