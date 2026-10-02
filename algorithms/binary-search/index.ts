import { defineAlgorithm } from "@/core/algorithm/define";
import { languages } from "./code";
import { binarySearchTrace } from "./executor";
import { metadata } from "./metadata";

export default defineAlgorithm({
  ...metadata,
  languages,
  input: { arr: [2, 5, 8, 12, 17, 21, 29], target: 17 },
  execute: binarySearchTrace,
});
