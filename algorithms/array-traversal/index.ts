import { defineAlgorithm } from "@/core/algorithm/define";
import { languages } from "./code";
import { traversalTrace } from "./executor";
import { metadata } from "./metadata";

export default defineAlgorithm({
  ...metadata,
  languages,
  input: { arr: [4, 9, 2, 7, 5] },
  execute: traversalTrace,
});
