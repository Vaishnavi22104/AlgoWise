import { describe, expect, it } from "vitest";
import { linkedListTrace } from "./executor";

describe("singly linked list", () => {
  it("builds the list and visits every node", () => {
    const steps = linkedListTrace({ values: [10, 20, 30, 40] });
    expect(steps).toHaveLength(4 + 1 + 4 * 3 + 1);
    const last = steps.at(-1)!;
    expect(last.state.result?.text).toBe("Visited all 4 nodes: 10 -> 20 -> 30 -> 40");
    const s = last.state.structures[0];
    if (s.kind !== "linked-list") throw new Error("expected list");
    expect(s.pointers?.find((p) => p.label === "curr")?.target).toBe(null);
  });

  it("links each new node to the previous one while building", () => {
    const steps = linkedListTrace({ values: [1, 2, 3] });
    const s = steps[1].state.structures[0];
    if (s.kind !== "linked-list") throw new Error("expected list");
    expect(s.nodes.map((n) => n.next)).toEqual(["n2", null]);
  });

  it("handles a single node", () => {
    const steps = linkedListTrace({ values: [7] });
    expect(steps.at(-1)?.state.result?.text).toContain("1 nodes");
  });
});
