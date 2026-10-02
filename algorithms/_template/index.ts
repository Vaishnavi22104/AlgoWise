import { defineAlgorithm } from "@/core/algorithm/define";
import { languages } from "./code";
import { templateAlgorithmTrace } from "./executor";
import { metadata } from "./metadata";

/** Fixed, easy-to-read demo input. Custom input is a future feature. */
export default defineAlgorithm({
  ...metadata,
  languages,
  input: { arr: [3, 9, 4, 7] },
  execute: templateAlgorithmTrace,
});
