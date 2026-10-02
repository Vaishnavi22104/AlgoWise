import { describe, expect, it } from "vitest";
import { traversalTrace } from "./executor";

describe("array traversal", () => {
  it("sums every element and ends with the total", () => {
    const steps = traversalTrace({ arr: [4, 9, 2, 7, 5] });
    expect(steps.at(-1)?.state.result?.text).toContain("27");
    expect(steps).toHaveLength(2 + 5 * 3 + 1);
  });

  it("handles an empty array", () => {
    const steps = traversalTrace({ arr: [] });
    expect(steps.at(-1)?.state.result?.text).toContain("0");
  });

  it("handles a single element", () => {
    const steps = traversalTrace({ arr: [8] });
    expect(steps.at(-1)?.state.result?.text).toContain("8");
  });

  it("moves the i pointer one index per loop pass", () => {
    const steps = traversalTrace({ arr: [1, 2, 3] });
    const positions = steps
      .filter((s) => s.anchor === "loop")
      .map((s) => (s.state.structures[0].kind === "array" ? s.state.structures[0].pointers?.[0].index : -1));
    expect(positions).toEqual([0, 1, 2]);
  });
});
