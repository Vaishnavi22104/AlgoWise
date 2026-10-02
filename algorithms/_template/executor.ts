import { createTrace } from "@/core/algorithm/trace";
import type { AlgorithmStep } from "@/core/algorithm/types";
import { templateAlgorithmState } from "./visualization";

export interface TemplateAlgorithmInput {
  arr: number[];
}

/**
 * Runs the algorithm and records ONE STEP per interesting moment.
 * Every step needs: the code line it belongs to, a short `operation`,
 * a beginner-friendly `explanation`, the visual `state`, and (optionally) an `event`.
 */
export function templateAlgorithmTrace({ arr }: TemplateAlgorithmInput): AlgorithmStep[] {
  const t = createTrace();

  if (arr.length === 0) {
    t.step({
      anchor: "init",
      operation: "Empty array",
      explanation: "There is nothing to search, so there is no maximum.",
      event: "not-found",
      state: { structures: [{ kind: "array", id: "arr", label: "arr", cells: [] }], result: { text: "Empty array", tone: "error" } },
    });
    return t.steps;
  }

  let best = 0;
  t.step({
    anchor: "init",
    operation: `best = arr[0] = ${arr[0]}`,
    explanation: "Start by assuming the first element is the biggest.",
    event: "select",
    state: templateAlgorithmState({ arr, best, vars: [{ name: "best", value: arr[0], tone: "success" }] }),
  });

  for (let i = 0; i < arr.length; i++) {
    t.step({
      anchor: "loop",
      operation: `x = arr[${i}] = ${arr[i]}`,
      explanation: `Look at the next element, ${arr[i]}.`,
      event: "visit",
      state: templateAlgorithmState({ arr, i, best, vars: [{ name: "best", value: arr[best] }] }),
    });
    const bigger = arr[i] > arr[best];
    t.step({
      anchor: "compare",
      operation: `Is ${arr[i]} > ${arr[best]}?`,
      explanation: bigger ? "Yes, it is larger than the best so far." : "No, the best so far stays.",
      event: "compare",
      state: templateAlgorithmState({
        arr,
        i,
        best,
        vars: [{ name: "best", value: arr[best] }],
      }),
    });
    if (bigger) {
      best = i;
      t.step({
        anchor: "update",
        operation: `best = ${arr[i]}`,
        explanation: "A new maximum! Remember it.",
        event: "update-variable",
        state: templateAlgorithmState({ arr, i, best, vars: [{ name: "best", value: arr[best], tone: "success" }] }),
      });
    }
  }

  t.step({
    anchor: "return",
    operation: `return ${arr[best]}`,
    explanation: "Every element has been checked, so best is the maximum.",
    event: "found",
    state: templateAlgorithmState({ arr, best, vars: [{ name: "best", value: arr[best], tone: "success" }], result: `Maximum = ${arr[best]}` }),
  });
  return t.steps;
}
