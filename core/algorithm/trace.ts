import type { AlgorithmStep } from "./types";

/** Tiny helper so executors never number steps by hand. */
export function createTrace() {
  const steps: AlgorithmStep[] = [];
  return {
    steps,
    step(step: Omit<AlgorithmStep, "id">) {
      steps.push({ id: steps.length + 1, ...step });
    },
  };
}
