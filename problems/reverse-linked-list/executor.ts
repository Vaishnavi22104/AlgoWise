import { createTrace } from "@/core/algorithm/trace";
import type { AlgorithmStep } from "@/core/algorithm/types";
import { nodeId, reverseState } from "./visualization";

export interface ReverseInput {
  values: number[];
}

/** Lines: 2 prev, 3 curr, 4 loop, 5 nxt, 6 flip arrow, 7 prev = curr, 8 curr = nxt, 9 return. */
export function reverseTrace({ values }: ReverseInput): AlgorithmStep[] {
  const t = createTrace();
  const n = values.length;
  const ids = values.map((_, i) => nodeId(i));
  const next: (string | null)[] = ids.map((_, i) => (i + 1 < n ? ids[i + 1] : null));
  const reversed: string[] = [];
  const head = { target: ids[0] ?? null, label: "head" };
  const indexOf = (id: string) => ids.indexOf(id);

  let prev: string | null = null;
  let curr: string | null = ids[0] ?? null;
  const origin = values.join(" -> ");

  t.step({
    anchor: "prev",
    operation: "prev = null",
    explanation: "prev will trail one node behind curr. At the start there is nothing behind us, so it is null.",
    event: "update-variable",
    state: reverseState({ values, next, reversed, pointers: [head, { target: null, label: "prev" }] }),
  });
  t.step({
    anchor: "curr",
    operation: "curr = head",
    explanation: "curr is the node we are about to re-point. We start at the head.",
    event: "move-pointer",
    state: reverseState({
      values,
      next,
      reversed,
      curr,
      pointers: [head, { target: null, label: "prev" }, { target: curr, label: "curr" }],
    }),
  });

  while (curr !== null) {
    const ci: number = indexOf(curr);
    t.step({
      anchor: "loop",
      operation: "Is curr a node? (curr is not null)",
      explanation: "curr points at a node, so there is still work to do.",
      event: "compare",
      state: reverseState({
        values,
        next,
        reversed,
        curr,
        pointers: [head, { target: prev, label: "prev" }, { target: curr, label: "curr" }],
        comparison: { left: "curr", op: "!=", right: "null", holds: true, tone: "warning" },
      }),
    });

    const nxt: string | null = next[ci];
    t.step({
      anchor: "save-next",
      operation: "nxt = curr.next",
      explanation: "Save the next node first. Once we re-point curr.next we would lose the rest of the list.",
      event: "select",
      state: reverseState({
        values,
        next,
        reversed,
        curr,
        pointers: [
          head,
          { target: prev, label: "prev" },
          { target: curr, label: "curr" },
          { target: nxt, label: "nxt" },
        ],
      }),
    });

    next[ci] = prev;
    t.step({
      anchor: "flip",
      operation: "curr.next = prev",
      explanation: "The key move: curr's arrow now points backwards, at prev, instead of forwards.",
      event: "move-pointer",
      state: reverseState({
        values,
        next,
        reversed,
        curr,
        relinked: curr,
        pointers: [
          head,
          { target: prev, label: "prev" },
          { target: curr, label: "curr" },
          { target: nxt, label: "nxt" },
        ],
      }),
    });

    prev = curr;
    reversed.push(curr);
    t.step({
      anchor: "move-prev",
      operation: "prev = curr",
      explanation: "This node is finished. prev steps forward so it is ready for the next node.",
      event: "move-pointer",
      state: reverseState({
        values,
        next,
        reversed,
        pointers: [
          head,
          { target: prev, label: "prev" },
          { target: curr, label: "curr" },
          { target: nxt, label: "nxt" },
        ],
      }),
    });

    curr = nxt;
    t.step({
      anchor: "move-curr",
      operation: "curr = nxt",
      explanation:
        curr === null
          ? "nxt was null, so curr becomes null: we reached the end of the original list."
          : "curr moves on to the node we saved in nxt.",
      event: "move-pointer",
      state: reverseState({
        values,
        next,
        reversed,
        curr,
        pointers: [
          head,
          { target: prev, label: "prev" },
          { target: curr, label: "curr" },
          { target: nxt, label: "nxt" },
        ],
      }),
    });
  }

  t.step({
    anchor: "loop",
    operation: "Is curr a node? (curr is null)",
    explanation: "curr is null, so every node has been re-pointed and the loop ends.",
    event: "compare",
    state: reverseState({
      values,
      next,
      reversed,
      pointers: [head, { target: prev, label: "prev" }, { target: null, label: "curr" }],
      comparison: { left: "curr", op: "!=", right: "null", holds: false, tone: "warning" },
    }),
  });

  // Read the final order by following the arrows from prev.
  const order: number[] = [];
  for (let id = prev, guard = 0; id !== null && guard <= n; guard++) {
    order.push(values[indexOf(id)]);
    id = next[indexOf(id)];
  }
  t.step({
    anchor: "return",
    operation: "return prev",
    explanation: "prev is the last node we visited, which is now the first node of the reversed list.",
    event: "found",
    state: reverseState({
      values,
      next,
      reversed,
      pointers: [head, { target: prev, label: "prev (new head)" }],
      result: `${origin} -> null  becomes  ${order.join(" -> ")} -> null`,
    }),
  });
  return t.steps;
}
