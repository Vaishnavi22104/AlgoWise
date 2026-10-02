import type { AlgorithmMeta } from "@/core/algorithm/types";

export const metadata: Omit<AlgorithmMeta, "languages"> = {
  id: "stack",
  slug: "stack",
  type: "concept",
  title: "Stack",
  category: "Stack",
  difficulty: "Easy",
  description: "A Last-In, First-Out pile: push onto the top, pop from the top, peek without removing.",
  tags: ["lifo", "push", "pop", "peek", "data structure"],
  complexity: {
    time: "O(1)",
    space: "O(n)",
    note: "push, pop and peek only touch the top item. Storing n items takes O(n) space.",
  },
  inputSummary: "push 10, 20, 30 -> peek -> pop -> push 40 -> pop, pop",
  howItWorks: [
    "A stack behaves like a stack of plates. You can only add a plate to the top (push) or take the top plate away (pop). Peek lets you look at the top plate without taking it.",
    "Because the newest item is always on top, items leave in the reverse of the order they arrived. This rule is called LIFO: Last In, First Out.",
    "Stacks power undo buttons, the browser back button, expression parsing and the function call stack. Valid Parentheses is a classic problem built on one.",
  ],
  related: ["problem:valid-parentheses", "concept:singly-linked-list"],
  showcaseStep: 4,
};
