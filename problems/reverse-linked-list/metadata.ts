import type { AlgorithmMeta } from "@/core/algorithm/types";

export const metadata: Omit<AlgorithmMeta, "languages"> = {
  id: "reverse-linked-list",
  slug: "reverse-linked-list",
  type: "problem",
  title: "Reverse Linked List",
  category: "Linked Lists",
  difficulty: "Easy",
  description: "Reverse a singly linked list by turning every next pointer around, in one pass and without extra memory.",
  tags: ["linked list", "pointers", "in-place", "iteration"],
  complexity: {
    time: "O(n)",
    space: "O(1)",
    note: "Each node is re-pointed once, and we only use three pointers: prev, curr and nxt.",
  },
  inputSummary: "1 -> 2 -> 3 -> 4 -> null",
  howItWorks: [
    "We never move any node. We only turn the arrows around. Three pointers do the work: prev (the node behind), curr (the node we are fixing) and nxt (a saved copy of the way forward).",
    "In each round we save curr.next in nxt, flip curr.next to point back at prev, then slide prev and curr one node to the right. The purple arrow marks the pointer that was just flipped.",
    "When curr falls off the end, prev is sitting on the old last node, which is the new head. Notice that the old head now points to null.",
  ],
  related: ["concept:singly-linked-list", "problem:merge-two-sorted-lists"],
  problem: {
    number: 206,
    url: "https://leetcode.com/problems/reverse-linked-list/",
    summary: "Reverse a singly linked list and return the new head.",
    statement: {
      description: [
        "You are given the head of a singly linked list, where each node holds a value and a pointer to the next node.",
        "Reverse the list so that the arrows point the other way, and return the head of the reversed list. The last node of the original list becomes the new head. An empty list stays empty.",
      ],
      examples: [
        { input: "head = 1 -> 2 -> 3 -> 4 -> 5", output: "5 -> 4 -> 3 -> 2 -> 1", explanation: "Every arrow is flipped. Node 5 is now the head and node 1 points to null." },
        { input: "head = 1 -> 2", output: "2 -> 1", explanation: "A two-node list: the two nodes simply swap roles." },
        { input: "head = (empty list)", output: "(empty list)", explanation: "With no nodes there is nothing to reverse, so we return null." },
        { input: "head = 1 -> 2 -> 3 -> 4", output: "4 -> 3 -> 2 -> 1", explanation: "This is the example animated on this page." },
      ],
      constraints: ["The list has between 0 and 5,000 nodes.", "-5,000 <= Node.val <= 5,000"],
      followUp: "A list can be reversed with a loop or with recursion. Can you write both?",
    },
  },
  showcaseStep: 9,
};
