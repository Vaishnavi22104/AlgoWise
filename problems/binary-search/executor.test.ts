import { describe, expect, it } from "vitest";
import { searchTrace } from "./executor";

describe("binary search (problem)", () => {
  it("uses nums in operation labels and finds the target", () => {
    const steps = searchTrace({ arr: [1, 4, 6, 9, 13, 18, 24, 31], target: 24, arrayName: "nums" });
    expect(steps.some((s) => s.operation.includes("nums[mid]"))).toBe(true);
    expect(steps.at(-1)?.state.result?.text).toBe("Found 24 at index 6");
  });

  it("returns not found for a missing value", () => {
    expect(searchTrace({ arr: [1, 4, 6], target: 5, arrayName: "nums" }).at(-1)?.event).toBe("not-found");
  });
});
