import { createTrace } from "@/core/algorithm/trace";
import type { AlgorithmStep } from "@/core/algorithm/types";
import { traversalState } from "./visualization";

export interface TraversalInput {
  arr: number[];
}

export function traversalTrace({ arr }: TraversalInput): AlgorithmStep[] {
  const t = createTrace();
  let total = 0;

  t.step({
    anchor: "init",
    operation: "Create the array",
    explanation: `The array holds ${arr.length} numbers. Their indexes run from 0 to ${arr.length - 1}.`,
    state: traversalState({ arr, done: 0, vars: [] }),
  });
  t.step({
    anchor: "total",
    operation: "Set total = 0",
    explanation: "total will collect the sum of every element we visit.",
    event: "update-variable",
    state: traversalState({ arr, done: 0, vars: [{ name: "total", value: 0 }] }),
  });

  arr.forEach((value, i) => {
    t.step({
      anchor: "loop",
      operation: `i = ${i}`,
      explanation: `The loop moves the index i to ${i}. Only the element at this position is in focus.`,
      event: "move-pointer",
      state: traversalState({
        arr,
        i,
        done: i,
        vars: [
          { name: "i", value: i, tone: "pointer" },
          { name: "total", value: total },
        ],
      }),
    });
    t.step({
      anchor: "read",
      operation: `current = arr[${i}] = ${value}`,
      explanation: `Indexing arr[${i}] reads the value ${value} straight from that position.`,
      event: "visit",
      state: traversalState({
        arr,
        i,
        done: i,
        vars: [
          { name: "i", value: i, tone: "pointer" },
          { name: "current", value, tone: "active" },
          { name: "total", value: total },
        ],
      }),
    });
    total += value;
    t.step({
      anchor: "add",
      operation: `total += ${value}  ->  ${total}`,
      explanation: `Add ${value} to the running total. This element is finished.`,
      event: "update-variable",
      state: traversalState({
        arr,
        i,
        done: i + 1,
        vars: [
          { name: "i", value: i, tone: "pointer" },
          { name: "current", value },
          { name: "total", value: total, tone: "success" },
        ],
      }),
    });
  });

  t.step({
    anchor: "result",
    operation: `Output the total -> ${total}`,
    explanation: "The loop ended because i reached the length of the array. Every element was visited once.",
    event: "found",
    state: traversalState({
      arr,
      done: arr.length,
      vars: [{ name: "total", value: total, tone: "success" }],
      result: `Sum of all elements = ${total}`,
    }),
  });

  return t.steps;
}
