import { describe, expect, it } from "vitest";
import { parenthesesTrace } from "./executor";

const run = (s: string) => parenthesesTrace({ s });
const verdict = (s: string) => run(s).at(-1)!.state.result?.tone;

describe("valid parentheses", () => {
  it("accepts the demo string and ends with an empty stack", () => {
    const steps = run("{[()]}");
    expect(steps.at(-1)?.state.result?.tone).toBe("success");
    const st = steps.at(-1)!.state.structures[1];
    if (st.kind !== "stack") throw new Error("expected stack");
    expect(st.items).toHaveLength(0);
  });

  it("accepts simple valid strings", () => {
    expect(verdict("()")).toBe("success");
    expect(verdict("()[]{}")).toBe("success");
    expect(verdict("")).toBe("success");
  });

  it("rejects mismatched brackets", () => {
    expect(verdict("(]")).toBe("error");
    expect(verdict("([)]")).toBe("error");
  });

  it("rejects a closing bracket with an empty stack", () => {
    expect(verdict(")")).toBe("error");
  });

  it("rejects unclosed brackets", () => {
    expect(verdict("((")).toBe("error");
  });

  it("pushes openers and pops on a match", () => {
    const events = run("()").map((s) => s.event);
    expect(events).toContain("push");
    expect(events).toContain("pop");
  });

  it("never leaves more than the unmatched openers on the stack", () => {
    for (const step of run("{[()]}")) {
      const st = step.state.structures[1];
      if (st.kind !== "stack") throw new Error("expected stack");
      expect(st.items.length).toBeLessThan(4);
    }
  });
});
