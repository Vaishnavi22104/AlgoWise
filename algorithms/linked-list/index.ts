import { defineAlgorithm } from "@/core/algorithm/define";
import { languages } from "./code";
import { linkedListTrace } from "./executor";
import { metadata } from "./metadata";

export default defineAlgorithm({
  ...metadata,
  languages,
  input: { values: [10, 20, 30, 40] },
  execute: linkedListTrace,
});
