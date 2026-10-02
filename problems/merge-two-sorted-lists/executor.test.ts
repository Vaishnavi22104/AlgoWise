import { describe, expect, it } from "vitest";
import { mergeTrace } from "./executor";

const resultOf = (a: number[], b: number[]) => mergeTrace({ a, b }).at(-1)!.state.result?.text;

describe("merge two sorted lists", () => {
  it("merges the demo lists", () => {
    expect(resultOf([1, 3, 5], [2, 4, 6])).toBe("Merged: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> null");
    expect(mergeTrace({ a: [1, 3, 5], b: [2, 4, 6] })).toHaveLength(30);
  });

  it("handles uneven lengths", () => {
    expect(resultOf([1], [2, 3, 4])).toBe("Merged: 1 -> 2 -> 3 -> 4 -> null");
    expect(resultOf([5, 6, 7], [1])).toBe("Merged: 1 -> 5 -> 6 -> 7 -> null");
  });

  it("handles empty lists", () => {
    expect(resultOf([], [])).toBe("Merged:  -> null");
    expect(resultOf([], [1, 2])).toBe("Merged: 1 -> 2 -> null");
  });

  it("handles duplicates", () => {
    expect(resultOf([1, 1], [1])).toBe("Merged: 1 -> 1 -> 1 -> null");
  });

  it("builds a sorted result at every step", () => {
    for (const step of mergeTrace({ a: [1, 4, 9], b: [2, 3, 10] })) {
      const merged = step.state.structures[2];
      if (merged.kind !== "linked-list") throw new Error("expected list");
      const vals = merged.nodes.slice(1).map((n) => n.value as number);
      expect([...vals].sort((x, y) => x - y)).toEqual(vals);
    }
  });
});
