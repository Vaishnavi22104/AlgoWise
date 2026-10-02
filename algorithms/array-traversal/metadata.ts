import type { AlgorithmMeta } from "@/core/algorithm/types";

export const metadata: Omit<AlgorithmMeta, "languages"> = {
  id: "array-traversal",
  slug: "array-traversal",
  type: "concept",
  title: "Array Traversal",
  category: "Arrays",
  difficulty: "Easy",
  description: "Visit every element of an array by moving an index from left to right.",
  tags: ["array", "iteration", "index", "loop"],
  complexity: {
    time: "O(n)",
    space: "O(1)",
    note: "Every element is touched exactly once, and we only keep two extra variables.",
  },
  inputSummary: "arr = [4, 9, 2, 7, 5]",
  howItWorks: [
    "An array stores its elements side by side, and each one has an index starting at 0. The loop variable i is just a number that points at one index at a time.",
    "On every pass the loop reads the element at i (current), uses it, and then i moves one step to the right. When i reaches the length of the array the loop stops.",
    "Watch the purple i marker slide across the cells: the blue cell is the element being read, and green cells have already been added to the running total.",
  ],
  related: ["concept:binary-search", "concept:singly-linked-list"],
  showcaseStep: 9,
};
