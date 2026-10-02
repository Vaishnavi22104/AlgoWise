import { createTrace } from "@/core/algorithm/trace";
import type { AlgorithmStep } from "@/core/algorithm/types";
import { stackState } from "./visualization";

export interface StackOp {
  /** Anchor in `code.ts` of the line that performs this operation, e.g. "push-1". */
  at: string;
  op: "push" | "pop" | "peek";
  value?: number;
}

export interface StackInput {
  ops: StackOp[];
}

export function stackTrace({ ops }: StackInput): AlgorithmStep[] {
  const t = createTrace();
  const items: number[] = [];
  const popped: number[] = [];
  const sizeVar = () => ({ name: "size", value: items.length });

  t.step({
    anchor: "create",
    operation: "Create an empty stack",
    explanation: "A stack is a pile where you can only touch the top. It starts empty.",
    event: "insert",
    state: stackState({ items: [], vars: [sizeVar()] }),
  });

  ops.forEach((o, idx) => {
    const isLast = idx === ops.length - 1;
    if (o.op === "push") {
      items.push(o.value as number);
      t.step({
        anchor: o.at,
        operation: `Push ${o.value}`,
        explanation: `${o.value} is placed on top. It will be the first one to leave.`,
        event: "push",
        state: stackState({
          items,
          topTone: "success",
          operation: { type: "push", value: o.value as number },
          vars: [sizeVar(), { name: "top", value: o.value as number, tone: "active" }],
        }),
      });
    } else if (o.op === "peek") {
      const top = items[items.length - 1];
      t.step({
        anchor: o.at,
        operation: `Peek -> ${top}`,
        explanation: `Peek only looks at the top item (${top}). Nothing is removed.`,
        event: "select",
        state: stackState({
          items,
          topTone: "active",
          operation: { type: "peek", value: top },
          vars: [sizeVar(), { name: "top", value: top, tone: "active" }],
        }),
      });
    } else {
      const top = items.pop();
      if (top === undefined) {
        t.step({
          anchor: o.at,
          operation: "Pop from an empty stack",
          explanation: "There is nothing to remove, so a real program would raise an error here.",
          event: "not-found",
          state: { ...stackState({ items, vars: [sizeVar()] }), result: { text: "Stack underflow", tone: "error" } },
        });
        return;
      }
      popped.push(top);
      t.step({
        anchor: o.at,
        operation: `Pop -> ${top}`,
        explanation: `${top} was the most recent arrival, so it leaves first. That is Last In, First Out.`,
        event: "pop",
        state: stackState({
          items,
          topTone: "active",
          operation: { type: "pop", value: top },
          vars: [sizeVar(), { name: "popped", value: top, tone: "warning" }],
          result: isLast ? `Popped in order: ${popped.join(", ")}` : undefined,
        }),
      });
    }
  });

  return t.steps;
}
