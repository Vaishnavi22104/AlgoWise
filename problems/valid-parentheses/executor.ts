import { createTrace } from "@/core/algorithm/trace";
import type { AlgorithmStep } from "@/core/algorithm/types";
import { parenthesesState } from "./visualization";

export interface ParenthesesInput {
  s: string;
}

const PAIRS: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

/** Anchors: stack, pairs, loop, is-closing, match (compare + pop), fail, push, final (see code.ts). */
export function parenthesesTrace({ s }: ParenthesesInput): AlgorithmStep[] {
  const t = createTrace();
  const chars = [...s];
  const stack: string[] = [];
  const openIdx: number[] = [];
  const matched: number[] = [];
  const base = { chars };

  t.step({
    anchor: "stack",
    operation: "Create an empty stack",
    explanation: "Opening brackets will wait on this stack until their closing partner shows up.",
    event: "update-variable",
    state: parenthesesState({ ...base, matched, stack }),
  });
  t.step({
    anchor: "pairs",
    operation: "pairs: ) -> (   ] -> [   } -> {",
    explanation: "pairs tells us which opening bracket each closing bracket expects.",
    event: "update-variable",
    state: parenthesesState({ ...base, matched, stack }),
  });

  const fail = (i: number, anchor: string, text: string, explanation: string): AlgorithmStep[] => {
    t.step({
      anchor,
      operation: "Return false (invalid)",
      explanation,
      event: "not-found",
      state: parenthesesState({
        ...base,
        i,
        iTone: "error",
        matched,
        stack,
        stackTopTone: "error",
        result: { text, tone: "error" },
      }),
    });
    return t.steps;
  };

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const closing = ch in PAIRS;

    t.step({
      anchor: "loop",
      operation: `ch = "${ch}"`,
      explanation: `Read the next character: ${ch}.`,
      event: "visit",
      state: parenthesesState({ ...base, i, matched, stack }),
    });
    t.step({
      anchor: "is-closing",
      operation: `Is "${ch}" a closing bracket?`,
      explanation: closing
        ? `${ch} closes something, so it must match the bracket on top of the stack.`
        : `${ch} is an opening bracket, so it has to wait for its partner.`,
      event: "compare",
      state: parenthesesState({
        ...base,
        i,
        matched,
        stack,
        comparison: { left: `"${ch}"`, op: "is closing", right: "", holds: closing, tone: "warning" },
      }),
    });

    if (!closing) {
      stack.push(ch);
      openIdx.push(i);
      t.step({
        anchor: "push",
        operation: `PUSH "${ch}"`,
        explanation: `Push ${ch} on the stack. The most recent opening bracket is always on top.`,
        event: "push",
        state: parenthesesState({
          ...base,
          i,
          matched,
          stack,
          stackTopTone: "success",
          operation: { type: "push", value: ch },
        }),
      });
      continue;
    }

    if (stack.length === 0) {
      t.step({
        anchor: "match",
        operation: "COMPARE: stack is empty",
        explanation: `${ch} has nothing to close because the stack is empty.`,
        event: "compare",
        state: parenthesesState({
          ...base,
          i,
          iTone: "warning",
          matched,
          stack,
          comparison: { left: "stack", op: "is", right: "empty", holds: true, tone: "warning" },
        }),
      });
      return fail(i, "fail", `Invalid: "${ch}" has no opening bracket`, "No opening bracket is waiting, so the string is invalid.");
    }

    const top = stack[stack.length - 1];
    const expected = PAIRS[ch];
    const ok = top === expected;

    t.step({
      anchor: "match",
      operation: `COMPARE: top "${top}" vs expected "${expected}"`,
      explanation: ok
        ? `${ch} expects ${expected}, and the top of the stack is ${top}. They match.`
        : `${ch} expects ${expected}, but the top of the stack is ${top}. They do not match.`,
      event: "compare",
      state: parenthesesState({
        ...base,
        i,
        iTone: "warning",
        matched,
        stack,
        stackTopTone: "warning",
        comparison: { left: `top = "${top}"`, op: ok ? "==" : "!=", right: `"${expected}"`, holds: ok, tone: "warning" },
      }),
    });

    if (!ok) {
      return fail(i, "fail", `Invalid: "${ch}" does not match "${top}"`, "The brackets are interleaved wrongly, so the string is invalid.");
    }

    stack.pop();
    const o = openIdx.pop() as number;
    matched.push(o, i);
    t.step({
      anchor: "match",
      operation: `POP "${top}"`,
      explanation: `Matched pair ${top}${ch}. Pop ${top} off the stack.`,
      event: "pop",
      state: parenthesesState({
        ...base,
        i,
        iTone: "success",
        matched,
        stack,
        operation: { type: "pop", value: top },
      }),
    });
  }

  const valid = stack.length === 0;
  t.step({
    anchor: "final",
    operation: `Is the stack empty?  ->  return ${valid}`,
    explanation: valid
      ? "Every opening bracket was closed in the right order, so the stack is empty. The string is valid."
      : `${stack.length} opening bracket(s) were never closed, so the string is invalid.`,
    event: valid ? "found" : "not-found",
    state: parenthesesState({
      ...base,
      matched,
      stack,
      stackTopTone: valid ? "neutral" : "error",
      result: valid
        ? { text: "Valid: every bracket is matched", tone: "success" }
        : { text: `Invalid: ${stack.length} unclosed bracket(s)`, tone: "error" },
    }),
  });
  return t.steps;
}
