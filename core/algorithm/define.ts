import type { AlgorithmDefinition, AlgorithmSpec } from "./types";

/** Binds an executor to its fixed demo input and returns a registrable definition. */
export function defineAlgorithm<I>(spec: AlgorithmSpec<I>): AlgorithmDefinition {
  const { input, execute, ...meta } = spec;
  return { ...meta, run: () => execute(input) };
}
