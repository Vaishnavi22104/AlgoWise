import type { AlgorithmMeta } from "@/core/algorithm/types";

export const metadata: Omit<AlgorithmMeta, "languages"> = {
  id: "merge-two-sorted-lists",
  slug: "merge-two-sorted-lists",
  type: "problem",
  title: "Merge Two Sorted Lists",
  category: "Linked Lists",
  difficulty: "Easy",
  description: "Join two sorted linked lists into one sorted list by always taking the smaller front node.",
  tags: ["linked list", "two pointers", "merge", "dummy node"],
  complexity: {
    time: "O(n + m)",
    space: "O(1)",
    note: "Each node is attached once. We re-use the existing nodes and add only a dummy placeholder.",
  },
  inputSummary: "l1 = 1 -> 3 -> 5,  l2 = 2 -> 4 -> 6",
  howItWorks: [
    "Two pointers, l1 and l2, sit at the front of each list. Because both lists are sorted, the smaller of the two front values is always the next value of the answer.",
    "A tail pointer marks the end of the merged list. Each round we attach the smaller node after tail, advance that list's pointer, and move tail forward.",
    "A dummy node at the start removes the awkward 'is the result empty yet?' case. When one list runs out, the other one is already sorted and is attached in a single step.",
  ],
  related: ["problem:reverse-linked-list", "concept:singly-linked-list"],
  problem: {
    number: 21,
    url: "https://leetcode.com/problems/merge-two-sorted-lists/",
    summary: "Merge two sorted linked lists into one sorted linked list.",
    statement: {
      description: [
        "You are given the heads of two singly linked lists, list1 and list2. Both lists are already sorted in non-decreasing order.",
        "Merge them into one sorted linked list by splicing together the existing nodes of the two lists (do not build a copy), and return the head of the merged list.",
      ],
      examples: [
        { input: "list1 = 1 -> 2 -> 4, list2 = 1 -> 3 -> 4", output: "1 -> 1 -> 2 -> 3 -> 4 -> 4", explanation: "Repeatedly take the smaller front node. Equal values may come from either list." },
        { input: "list1 = (empty), list2 = (empty)", output: "(empty)", explanation: "Two empty lists merge into an empty list." },
        { input: "list1 = (empty), list2 = 0", output: "0", explanation: "When one list is empty, the answer is the other list." },
        { input: "list1 = 1 -> 3 -> 5, list2 = 2 -> 4 -> 6", output: "1 -> 2 -> 3 -> 4 -> 5 -> 6", explanation: "This is the example animated on this page." },
      ],
      constraints: [
        "Each list has between 0 and 50 nodes.",
        "-100 <= Node.val <= 100",
        "Both lists are sorted in non-decreasing order.",
      ],
    },
  },
  showcaseStep: 12,
};
