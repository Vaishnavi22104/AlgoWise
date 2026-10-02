import { describe, expect, it } from "vitest";
import { binarySearchTrace } from "./executor";

const arr = [2, 5, 8, 12, 17, 21, 29];

describe("binary search", () => {
  it("finds the demo target", () => {
    const steps = binarySearchTrace({ arr, target: 17 });
    expect(steps.at(-1)?.event).toBe("found");
    expect(steps.at(-1)?.state.result?.text).toBe("Found 17 at index 4");
    expect(steps).toHaveLength(16);
  });

  it("reports a missing target", () => {
    const steps = binarySearchTrace({ arr, target: 10 });
    expect(steps.at(-1)?.event).toBe("not-found");
    expect(steps.at(-1)?.anchor).toBe("not-found");
  });

  it("handles an empty array", () => {
    const steps = binarySearchTrace({ arr: [], target: 1 });
    expect(steps.at(-1)?.event).toBe("not-found");
  });

  it("handles a single element", () => {
    expect(binarySearchTrace({ arr: [5], target: 5 }).at(-1)?.event).toBe("found");
    expect(binarySearchTrace({ arr: [5], target: 3 }).at(-1)?.event).toBe("not-found");
  });

  it("finds targets at both ends", () => {
    expect(binarySearchTrace({ arr, target: 2 }).at(-1)?.state.result?.text).toBe("Found 2 at index 0");
    expect(binarySearchTrace({ arr, target: 29 }).at(-1)?.state.result?.text).toBe("Found 29 at index 6");
  });

  it("works with duplicate values", () => {
    const steps = binarySearchTrace({ arr: [1, 2, 2, 2, 3], target: 2 });
    expect(steps.at(-1)?.event).toBe("found");
  });

  it("keeps the drawn pointers equal to the low/high variables (state is the source of truth)", () => {
    for (const target of [2, 12, 29, 4, 100]) {
      for (const step of binarySearchTrace({ arr, target })) {
        const s = step.state.structures[0];
        if (s.kind !== "array") throw new Error("expected array");
        for (const name of ["low", "high"]) {
          const v = step.state.variables?.find((x) => x.name === name);
          const p = s.pointers?.find((x) => x.label === name);
          if (v && p) expect(p.index).toBe(v.value);
        }
      }
    }
  });

  it("only highlights the search range inside the array and shrinks it", () => {
    const steps = binarySearchTrace({ arr, target: 17 });
    const sizes = steps
      .map((s) => s.state.structures[0])
      .map((s) => (s.kind === "array" && s.range ? s.range.to - s.range.from + 1 : null))
      .filter((x): x is number => x !== null);
    expect(sizes[0]).toBe(7);
    expect(sizes.at(-1)).toBeLessThan(sizes[0]);
  });
});
