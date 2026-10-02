import { describe, expect, it } from "vitest";
import { stackTrace } from "./executor";

const top = (steps: ReturnType<typeof stackTrace>, i: number) => {
  const s = steps[i].state.structures[0];
  return s.kind === "stack" ? s.items.map((x) => x.value) : [];
};

describe("stack", () => {
  const ops = [
    { at: "push-1", op: "push" as const, value: 1 },
    { at: "push-2", op: "push" as const, value: 2 },
    { at: "peek", op: "peek" as const },
    { at: "pop-1", op: "pop" as const },
    { at: "pop-2", op: "pop" as const },
  ];

  it("follows LIFO order", () => {
    const steps = stackTrace({ ops });
    expect(top(steps, 2)).toEqual([1, 2]);
    expect(top(steps, 3)).toEqual([1, 2]); // peek does not remove
    expect(top(steps, 4)).toEqual([1]);
    expect(top(steps, 5)).toEqual([]);
    expect(steps.at(-1)?.state.result?.text).toBe("Popped in order: 2, 1");
  });

  it("starts with an empty stack step", () => {
    expect(top(stackTrace({ ops }), 0)).toEqual([]);
  });

  it("flags popping an empty stack", () => {
    const steps = stackTrace({ ops: [{ at: "push-1", op: "pop" }] });
    expect(steps.at(-1)?.state.result?.text).toBe("Stack underflow");
  });

  it("handles no operations", () => {
    expect(stackTrace({ ops: [] })).toHaveLength(1);
  });
});
