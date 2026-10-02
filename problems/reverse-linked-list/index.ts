import { defineAlgorithm } from "@/core/algorithm/define";
import { languages } from "./code";
import { reverseTrace } from "./executor";
import { metadata } from "./metadata";

export default defineAlgorithm({
  ...metadata,
  languages,
  input: { values: [1, 2, 3, 4] },
  execute: reverseTrace,
});
