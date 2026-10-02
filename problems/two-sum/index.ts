import { defineAlgorithm } from "@/core/algorithm/define";
import { languages } from "./code";
import { twoSumTrace } from "./executor";
import { metadata } from "./metadata";

export default defineAlgorithm({
  ...metadata,
  languages,
  input: { nums: [2, 7, 11, 15], target: 9 },
  execute: twoSumTrace,
});
