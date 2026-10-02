import { defineAlgorithm } from "@/core/algorithm/define";
import { languages } from "./code";
import { stackTrace, type StackInput } from "./executor";
import { metadata } from "./metadata";

const input: StackInput = {
  ops: [
    { at: "push-1", op: "push", value: 10 },
    { at: "push-2", op: "push", value: 20 },
    { at: "push-3", op: "push", value: 30 },
    { at: "peek", op: "peek" },
    { at: "pop-1", op: "pop" },
    { at: "push-4", op: "push", value: 40 },
    { at: "pop-2", op: "pop" },
    { at: "pop-3", op: "pop" },
  ],
};

export default defineAlgorithm({
  ...metadata,
  languages,
  input,
  execute: stackTrace,
});
