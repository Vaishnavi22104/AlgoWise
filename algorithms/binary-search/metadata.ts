import type { AlgorithmMeta } from "@/core/algorithm/types";

export const metadata: Omit<AlgorithmMeta, "languages"> = {
  id: "binary-search",
  slug: "binary-search",
  type: "concept",
  title: "Binary Search",
  category: "Searching",
  difficulty: "Easy",
  description: "Find an element in a sorted array by repeatedly reducing the search space.",
  tags: ["array", "sorted", "divide and conquer", "two pointers"],
  complexity: {
    time: "O(log n)",
    space: "O(1)",
    note: "Each comparison throws away half of the remaining elements.",
  },
  inputSummary: "arr = [2, 5, 8, 12, 17, 21, 29], target = 17",
  howItWorks: [
    "Binary search only works on a sorted array. It keeps two pointers, low and high, that fence in the part of the array where the target could still be.",
    "Each round it looks at the middle element. If that is the target, we are done. If it is too small, nothing at or left of mid can be the answer, so low jumps to mid + 1. If it is too big, high jumps to mid - 1.",
    "The red cells are ruled out for good. The range shrinks until it either lands on the target or becomes empty.",
  ],
  related: ["problem:binary-search", "concept:array-traversal"],
  showcaseStep: 6,
};
