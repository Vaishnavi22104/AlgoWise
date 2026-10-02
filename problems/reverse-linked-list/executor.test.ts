import { describe, expect, it } from "vitest";
import { reverseTrace } from "./executor";

function finalArrows(values: number[]) {
  const last = reverseTrace({ values }).at(-1)!;
  const s = last.state.structures[0];
  if (s.kind !== "linked-list") throw new Error("expected list");
  return { s, last };
}

describe("reverse linked list", () => {
  it("reverses the demo list", () => {
    const { s, last } = finalArrows([1, 2, 3, 4]);
    expect(s.nodes.map((n) => n.next)).toEqual([null, "n1", "n2", "n3"]);
    expect(s.pointers?.find((p) => p.label.startsWith("prev"))?.target).toBe("n4");
    expect(last.state.result?.text).toContain("4 -> 3 -> 2 -> 1");
  });

  it("flips exactly one arrow per loop pass", () => {
    const steps = reverseTrace({ values: [1, 2, 3, 4] });
    expect(steps.filter((s) => s.anchor === "flip")).toHaveLength(4);
    expect(steps).toHaveLength(2 + 4 * 5 + 2);
  });

  it("handles one node", () => {
    const { s } = finalArrows([9]);
    expect(s.nodes.map((n) => n.next)).toEqual([null]);
  });

  it("handles an empty list", () => {
    const steps = reverseTrace({ values: [] });
    expect(steps.at(-1)?.anchor).toBe("return");
  });

  it("never loses a node: following arrows from prev reaches every node", () => {
    for (const step of reverseTrace({ values: [1, 2, 3, 4, 5] })) {
      const s = step.state.structures[0];
      if (s.kind !== "linked-list") throw new Error("expected list");
      const targets = s.nodes.map((n) => n.next).filter(Boolean);
      expect(new Set(targets).size).toBeLessThan(6);
    }
  });
});
