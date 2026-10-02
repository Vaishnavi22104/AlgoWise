import { defineAlgorithm } from "@/core/algorithm/define";
import { languages } from "./code";
import { mergeTrace } from "./executor";
import { metadata } from "./metadata";

export default defineAlgorithm({
  ...metadata,
  languages,
  input: { a: [1, 3, 5], b: [2, 4, 6] },
  execute: mergeTrace,
});
