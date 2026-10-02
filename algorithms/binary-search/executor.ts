import { createTrace } from "@/core/algorithm/trace";
import type { AlgorithmStep } from "@/core/algorithm/types";
import { searchState } from "./visualization";

export interface BinarySearchInput {
  arr: number[];
  target: number;
  /** Name of the array in the displayed code (`arr` or `nums`). */
  arrayName?: string;
}

/**
 * Trace for the 12-line Python function shown in `code.ts`.
 * Line numbers: 2 low, 3 high, 4 loop test, 5 mid, 6 equal?, 7 return mid,
 * 8 less?, 9 low = mid+1, 11 high = mid-1, 12 return -1.
 */
export function binarySearchTrace({ arr, target, arrayName = "arr" }: BinarySearchInput): AlgorithmStep[] {
  const t = createTrace();
  const A = arrayName;
  const base = { arr, target, name: A };

  let low = 0;
  t.step({
    anchor: "low",
    operation: "Set low = 0",
    explanation: "low marks the first index we still have to consider.",
    event: "update-variable",
    state: searchState({ ...base, low }),
  });

  let high = arr.length - 1;
  t.step({
    anchor: "high",
    operation: `Set high = ${high}`,
    explanation: "high marks the last index we still have to consider. The whole array is the search range.",
    event: "update-variable",
    state: searchState({ ...base, low, high }),
  });

  for (;;) {
    const keepGoing = low <= high;
    t.step({
      anchor: "loop",
      operation: `Is low <= high?  (${low} <= ${high})`,
      explanation: keepGoing
        ? "The range still contains at least one element, so the search continues."
        : "low passed high: the range is empty, so the target is not in the array.",
      event: "compare",
      state: searchState({
        ...base,
        low,
        high,
        comparison: { left: `low = ${low}`, op: "<=", right: `high = ${high}`, holds: keepGoing, tone: "warning" },
      }),
    });
    if (!keepGoing) break;

    const mid = Math.floor((low + high) / 2);
    t.step({
      anchor: "mid",
      operation: `mid = middle of ${low} and ${high} = ${mid}`,
      explanation: "mid points at the middle element of the current range.",
      event: "select",
      state: searchState({ ...base, low, high, mid, midVar: mid }),
    });

    const midValue = arr[mid];
    const equal = midValue === target;
    t.step({
      anchor: "equal",
      operation: `Comparing ${A}[mid] with target`,
      explanation: equal
        ? `${midValue} equals the target ${target}.`
        : `${midValue} is not equal to the target ${target}.`,
      event: "compare",
      state: searchState({
        ...base,
        low,
        high,
        mid,
        midVar: mid,
        midTone: "warning",
        comparison: { left: `${A}[mid] = ${midValue}`, op: "==", right: `target = ${target}`, holds: equal, tone: "warning" },
      }),
    });

    if (equal) {
      t.step({
        anchor: "found",
        operation: `return mid  ->  ${mid}`,
        explanation: `The target ${target} is at index ${mid}. The search ends early.`,
        event: "found",
        state: searchState({
          ...base,
          low,
          high,
          mid,
          midVar: mid,
          midTone: "success",
          result: { text: `Found ${target} at index ${mid}`, tone: "success" },
        }),
      });
      return t.steps;
    }

    const less = midValue < target;
    t.step({
      anchor: "less",
      operation: `Is ${A}[mid] < target?  (${midValue} < ${target})`,
      explanation: less
        ? `${midValue} is smaller than ${target}, and the array is sorted, so everything at or left of mid is too small.`
        : `${midValue} is larger than ${target}, and the array is sorted, so everything at or right of mid is too big.`,
      event: "compare",
      state: searchState({
        ...base,
        low,
        high,
        mid,
        midVar: mid,
        midTone: "warning",
        comparison: { left: `${A}[mid] = ${midValue}`, op: "<", right: `target = ${target}`, holds: less, tone: "warning" },
      }),
    });

    if (less) {
      low = mid + 1;
      t.step({
        anchor: "go-right",
        operation: `low = mid + 1  ->  ${low}`,
        explanation: "Discard the left half including mid: the search range now starts one place after mid.",
        event: "move-pointer",
        state: searchState({ ...base, low, high, midVar: mid }),
      });
    } else {
      high = mid - 1;
      t.step({
        anchor: "go-left",
        operation: `high = mid - 1  ->  ${high}`,
        explanation: "Discard the right half including mid: the search range now ends one place before mid.",
        event: "move-pointer",
        state: searchState({ ...base, low, high, midVar: mid }),
      });
    }
  }

  t.step({
    anchor: "not-found",
    operation: "return -1",
    explanation: `Every possible position was ruled out, so ${target} is not in the array.`,
    event: "not-found",
    state: searchState({
      ...base,
      low,
      high,
      result: { text: `${target} is not in the array`, tone: "error" },
    }),
  });
  return t.steps;
}
