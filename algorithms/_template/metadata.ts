import type { AlgorithmMeta } from "@/core/algorithm/types";

export const metadata: Omit<AlgorithmMeta, "languages"> = {
  id: "template-algorithm",
  slug: "template-algorithm",
  type: "concept", // "concept" lives in /algorithms, "problem" lives in /problems
  title: "Template Algorithm",
  category: "Arrays", // see CATEGORIES in core/algorithm/types.ts
  difficulty: "Easy",
  description: "One sentence that tells a beginner what this algorithm does.",
  tags: ["array", "example"],
  complexity: {
    time: "O(n)",
    space: "O(1)",
    note: "One sentence explaining WHY, in plain words.",
  },
  inputSummary: "arr = [3, 9, 4, 7]",
  howItWorks: [
    "Paragraph 1: the idea in plain language.",
    "Paragraph 2: what to watch for in the animation.",
  ],
  related: [], // e.g. ["concept:binary-search", "problem:two-sum"]
};
