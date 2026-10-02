import type { AlgorithmMeta } from "@/core/algorithm/types";

export const metadata: Omit<AlgorithmMeta, "languages"> = {
  id: "singly-linked-list",
  slug: "singly-linked-list",
  type: "concept",
  title: "Singly Linked List",
  category: "Linked Lists",
  difficulty: "Easy",
  description: "Build a chain of nodes connected by next pointers, then walk through it one node at a time.",
  tags: ["linked list", "node", "pointer", "traversal"],
  complexity: {
    time: "O(n)",
    space: "O(1)",
    note: "Traversal visits each node once. Walking needs only one extra pointer (curr).",
  },
  inputSummary: "10 -> 20 -> 30 -> 40 -> null",
  howItWorks: [
    "Unlike an array, the nodes of a linked list can live anywhere in memory. Each node stores a value and a next pointer to the following node. The last node's next is null.",
    "Because nodes are only connected by pointers, you cannot jump to position 3. You start at head and follow the arrows, which is why we copy head into a walker called curr.",
    "In the animation, the purple labels are pointers and the arrows are next references. Green nodes have been visited, and the blue node is where curr is now.",
  ],
  related: ["problem:reverse-linked-list", "problem:merge-two-sorted-lists"],
  showcaseStep: 9,
};
