import { defineAlgorithm } from "@/core/algorithm/define";
import { languages } from "./code";
import { parenthesesTrace } from "./executor";
import { metadata } from "./metadata";

export default defineAlgorithm({
  ...metadata,
  languages,
  input: { s: "{[()]}" },
  execute: parenthesesTrace,
});
