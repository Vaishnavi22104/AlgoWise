import { createTrace } from "@/core/algorithm/trace";
import type { AlgorithmStep } from "@/core/algorithm/types";
import { twoSumState } from "./visualization";

export interface TwoSumInput {
  nums: number[];
  target: number;
}

/** Lines: 2 seen = {}, 3 loop, 4 need, 5 lookup, 6 return pair, 7 store, 8 return []. */
export function twoSumTrace({ nums, target }: TwoSumInput): AlgorithmStep[] {
  const t = createTrace();
  const seen: [number, number][] = [];
  const lookup = (v: number) => seen.find(([k]) => k === v);

  t.step({
    anchor: "seen",
    operation: "Create an empty map: seen",
    explanation: `We want two numbers that add up to ${target}. The hash map remembers every number we have passed, with its index.`,
    event: "update-variable",
    state: twoSumState({ nums, seen, vars: [{ name: "target", value: target }] }),
  });

  for (let i = 0; i < nums.length; i++) {
    const x = nums[i];
    const need = target - x;
    const hit = lookup(need);

    t.step({
      anchor: "loop",
      operation: `i = ${i}, x = ${x}`,
      explanation: `Look at ${x}, the number at index ${i}.`,
      event: "move-pointer",
      state: twoSumState({
        nums,
        i,
        seen,
        vars: [{ name: "x", value: x, tone: "active" }, { name: "target", value: target }],
      }),
    });
    t.step({
      anchor: "need",
      operation: `need = ${target} - ${x} = ${need}`,
      explanation: `To reach ${target}, ${x} needs a partner equal to ${need}. That is its complement.`,
      event: "update-variable",
      state: twoSumState({
        nums,
        i,
        seen,
        vars: [
          { name: "x", value: x },
          { name: "need", value: need, tone: "pointer" },
          { name: "target", value: target },
        ],
      }),
    });
    t.step({
      anchor: "lookup",
      operation: `Is ${need} in seen?`,
      explanation: hit
        ? `Yes. ${need} was stored earlier at index ${hit[1]}, so ${need} + ${x} = ${target}.`
        : `No. We have not seen ${need} yet, so ${x} has no partner so far.`,
      event: hit ? "found" : "compare",
      state: twoSumState({
        nums,
        i,
        seen,
        matchIndex: hit?.[1],
        iTone: hit ? "success" : "warning",
        vars: [
          { name: "x", value: x },
          { name: "need", value: need, tone: "pointer" },
        ],
        comparison: { left: `need = ${need}`, op: "in", right: "seen", holds: !!hit, tone: "warning" },
      }),
    });

    if (hit) {
      t.step({
        anchor: "found",
        operation: `return [${hit[1]}, ${i}]`,
        explanation: `The pair is at indexes ${hit[1]} and ${i}: ${nums[hit[1]]} + ${x} = ${target}.`,
        event: "found",
        state: twoSumState({
          nums,
          i,
          seen,
          matchIndex: hit[1],
          iTone: "success",
          vars: [{ name: "need", value: need }],
          result: { text: `Indexes [${hit[1]}, ${i}]  ->  ${nums[hit[1]]} + ${x} = ${target}`, tone: "success" },
        }),
      });
      return t.steps;
    }

    seen.push([x, i]);
    t.step({
      anchor: "store",
      operation: `Store ${x} -> index ${i} in seen`,
      explanation: `Remember ${x} at index ${i} so a later number can find it.`,
      event: "insert",
      state: twoSumState({ nums, i, seen, vars: [{ name: "x", value: x }] }),
    });
  }

  t.step({
    anchor: "not-found",
    operation: "Return no pair",
    explanation: "We checked every number and none had a partner.",
    event: "not-found",
    state: twoSumState({ nums, seen, result: { text: "No pair adds up to the target", tone: "error" } }),
  });
  return t.steps;
}
