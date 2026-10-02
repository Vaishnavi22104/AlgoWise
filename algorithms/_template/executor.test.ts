import { describe, expect, it } from "vitest";
import { validateTrace } from "@/core/algorithm/validate";
import definition from "./index";
import { templateAlgorithmTrace } from "./executor";

describe("template algorithm", () => {
  it("produces a structurally valid trace", () => {
    expect(validateTrace(definition, definition.run())).toEqual([]);
  });

  it("finds the maximum", () => {
    expect(templateAlgorithmTrace({ arr: [3, 9, 4, 7] }).at(-1)?.state.result?.text).toBe("Maximum = 9");
  });

  it("handles empty input, a single element and duplicates", () => {
    expect(templateAlgorithmTrace({ arr: [] })).toHaveLength(1);
    expect(templateAlgorithmTrace({ arr: [5] }).at(-1)?.state.result?.text).toBe("Maximum = 5");
    expect(templateAlgorithmTrace({ arr: [2, 2, 2] }).at(-1)?.state.result?.text).toBe("Maximum = 2");
  });
});
