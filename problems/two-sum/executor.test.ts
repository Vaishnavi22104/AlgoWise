import { describe, expect, it } from "vitest";
import { twoSumTrace } from "./executor";

describe("two sum", () => {
  it("finds the demo pair", () => {
    const steps = twoSumTrace({ nums: [2, 7, 11, 15], target: 9 });
    expect(steps).toHaveLength(9);
    expect(steps.at(-1)?.state.result?.text).toContain("[0, 1]");
  });

  it("reports when there is no pair", () => {
    const steps = twoSumTrace({ nums: [1, 2, 3], target: 100 });
    expect(steps.at(-1)?.event).toBe("not-found");
  });

  it("handles duplicate values", () => {
    const steps = twoSumTrace({ nums: [3, 3], target: 6 });
    expect(steps.at(-1)?.state.result?.text).toContain("[0, 1]");
  });

  it("handles empty and single-element input", () => {
    expect(twoSumTrace({ nums: [], target: 1 }).at(-1)?.event).toBe("not-found");
    expect(twoSumTrace({ nums: [5], target: 5 }).at(-1)?.event).toBe("not-found");
  });

  it("only stores numbers it has already passed", () => {
    for (const step of twoSumTrace({ nums: [2, 7, 11, 15], target: 18 })) {
      const map = step.state.structures[1];
      if (map.kind !== "hashmap") throw new Error("expected hashmap");
      expect(map.entries.length).toBeLessThan(5);
    }
  });
});
