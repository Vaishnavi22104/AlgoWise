import { createTrace } from "@/core/algorithm/trace";
import type { AlgorithmStep } from "@/core/algorithm/types";
import { listState, nodeId } from "./visualization";

export interface LinkedListInput {
  values: number[];
}

/** Anchors: build-0..build-3 create the list, then curr, loop, visit, advance (see code.ts). */
export function linkedListTrace({ values }: LinkedListInput): AlgorithmStep[] {
  const t = createTrace();
  const n = values.length;

  // Build phase
  for (let i = 0; i < n; i++) {
    t.step({
      anchor: `build-${i}`,
      operation: i === 0 ? `head = Node(${values[0]})` : `Link a new node holding ${values[i]}`,
      explanation:
        i === 0
          ? `A node stores a value and a next pointer. head points at the first node, and its next is null (nothing follows yet).`
          : `A new node is created and the previous node's next pointer is set to it. The arrow is the pointer.`,
      event: "insert",
      state: listState({
        values,
        count: i + 1,
        active: i,
        fresh: i,
        pointers: [{ target: nodeId(0), label: "head" }],
      }),
    });
  }

  // Traversal phase
  const printed: number[] = [];
  const head = { target: nodeId(0), label: "head" };

  t.step({
    anchor: "curr",
    operation: "curr = head",
    explanation: "curr is a second pointer to the same first node. We walk with curr so head never moves.",
    event: "move-pointer",
    state: listState({ values, count: n, active: 0, pointers: [head, { target: nodeId(0), label: "curr" }] }),
  });

  for (let i = 0; i < n; i++) {
    t.step({
      anchor: "loop",
      operation: "Is curr a node? (curr is not null)",
      explanation: "curr points at a real node, so the loop body runs.",
      event: "compare",
      state: listState({
        values,
        count: n,
        active: i,
        visited: i,
        pointers: [head, { target: nodeId(i), label: "curr" }],
        comparison: { left: "curr", op: "!=", right: "null", holds: true, tone: "warning" },
        vars: [{ name: "output", value: printed.join(" ") || "-" }],
      }),
    });
    printed.push(values[i]);
    t.step({
      anchor: "visit",
      operation: `Output curr.val  ->  ${values[i]}`,
      explanation: `Read the value stored in the current node: ${values[i]}.`,
      event: "visit",
      state: listState({
        values,
        count: n,
        active: i,
        visited: i,
        pointers: [head, { target: nodeId(i), label: "curr" }],
        vars: [{ name: "output", value: printed.join(" "), tone: "success" }],
      }),
    });
    t.step({
      anchor: "advance",
      operation: "curr = curr.next",
      explanation:
        i + 1 < n
          ? "Follow the arrow: curr now points at the next node."
          : "This was the last node, so its next is null. curr becomes null.",
      event: "move-pointer",
      state: listState({
        values,
        count: n,
        active: i + 1 < n ? i + 1 : undefined,
        visited: i + 1,
        pointers: [head, { target: i + 1 < n ? nodeId(i + 1) : null, label: "curr" }],
        vars: [{ name: "output", value: printed.join(" ") }],
      }),
    });
  }

  t.step({
    anchor: "loop",
    operation: "Is curr a node? (curr is null)",
    explanation: "curr is null, so we walked off the end of the list and the loop stops.",
    event: "compare",
    state: listState({
      values,
      count: n,
      visited: n,
      pointers: [head, { target: null, label: "curr" }],
      comparison: { left: "curr", op: "!=", right: "null", holds: false, tone: "warning" },
      vars: [{ name: "output", value: printed.join(" ") }],
      result: `Visited all ${n} nodes: ${values.join(" -> ")}`,
    }),
  });

  return t.steps;
}
