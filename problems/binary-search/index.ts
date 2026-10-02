import { defineAlgorithm } from "@/core/algorithm/define";
import { languages } from "./code";
import { searchTrace } from "./executor";
import { metadata } from "./metadata";

export default defineAlgorithm({
  ...metadata,
  languages,
  input: { arr: [1, 4, 6, 9, 13, 18, 24, 31], target: 24, arrayName: "nums" },
  execute: searchTrace,
});
