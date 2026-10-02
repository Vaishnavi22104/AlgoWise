import type { AlgorithmMeta } from "@/core/algorithm/types";

export const metadata: Omit<AlgorithmMeta, "languages"> = {
  id: "binary-search-problem",
  slug: "binary-search",
  type: "problem",
  title: "Binary Search",
  category: "Searching",
  difficulty: "Easy",
  description: "Return the index of a target in a sorted array, or -1 if it is missing, in O(log n) time.",
  tags: ["array", "sorted", "binary search"],
  complexity: {
    time: "O(log n)",
    space: "O(1)",
    note: "The range halves on every iteration, and only a few integers are stored.",
  },
  inputSummary: "nums = [1, 4, 6, 9, 13, 18, 24, 31], target = 24",
  howItWorks: [
    "This is the interview version of the Binary Search concept. The array is sorted, so one comparison with the middle element tells us which half can be thrown away.",
    "Watch the shaded search range: it shrinks every iteration. The red cells are the ones we have proved cannot hold the target.",
    "Because the range halves each time, 8 elements need at most 4 comparisons and a million elements need at most 20.",
  ],
  related: ["concept:binary-search", "problem:two-sum"],
  problem: {
    number: 704,
    url: "https://leetcode.com/problems/binary-search/",
    summary: "Given a sorted array of distinct integers and a target, return the target's index or -1.",
    statement: {
      description: [
        "You are given an array of integers nums that is sorted in ascending order, and an integer called target. All values in nums are different.",
        "Search for target in nums. If it is present, return its index. If it is not present, return -1. Your solution must run in O(log n) time.",
      ],
      examples: [
        { input: "nums = [-1, 0, 3, 5, 9, 12], target = 9", output: "4", explanation: "9 is stored at index 4." },
        { input: "nums = [-1, 0, 3, 5, 9, 12], target = 2", output: "-1", explanation: "2 does not appear in the array, so we return -1." },
        { input: "nums = [1, 4, 6, 9, 13, 18, 24, 31], target = 24", output: "6", explanation: "This is the example animated on this page." },
      ],
      constraints: [
        "1 <= nums.length <= 10,000",
        "-10,000 < nums[i], target < 10,000",
        "All values in nums are distinct.",
        "nums is sorted in ascending order.",
      ],
    },
  },
  showcaseStep: 6,
};
