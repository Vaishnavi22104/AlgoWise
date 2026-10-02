import type { AlgorithmMeta } from "@/core/algorithm/types";

export const metadata: Omit<AlgorithmMeta, "languages"> = {
  id: "two-sum",
  slug: "two-sum",
  type: "problem",
  title: "Two Sum",
  category: "Hashing",
  difficulty: "Easy",
  description: "Given an array and a target value, find two elements whose values add up to the target.",
  tags: ["array", "hash map", "complement"],
  complexity: {
    time: "O(n)",
    space: "O(n)",
    note: "One pass over the array, with a hash map that may store every element.",
  },
  inputSummary: "nums = [2, 7, 11, 15], target = 9",
  howItWorks: [
    "The slow idea is to try every pair, which costs O(n^2). The faster idea is to ask, for each number x: has the number I need (target - x) already appeared?",
    "A hash map answers that question in O(1). We walk through the array once, and before storing x we check whether its complement is already in the map.",
    "If it is, the stored index and the current index form the answer. If not, we store x and move on.",
  ],
  related: ["concept:array-traversal", "problem:binary-search"],
  problem: {
    number: 1,
    url: "https://leetcode.com/problems/two-sum/",
    summary: "Find the indexes of the two numbers in an array that add up to a given target.",
    statement: {
      description: [
        "You are given an array of integers called nums and an integer called target.",
        "Find two different positions in the array whose values add up to target, and return those two indexes. You may assume that every input has exactly one valid answer, and you may not use the same element twice. The two indexes can be returned in any order.",
      ],
      examples: [
        { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9, so the answer is the indexes 0 and 1." },
        { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "2 + 4 = 6. The 3 at index 0 cannot pair with itself, so it is not the answer." },
        { input: "nums = [3, 3], target = 6", output: "[0, 1]", explanation: "Two equal values are fine as long as they sit at different indexes." },
      ],
      constraints: [
        "2 <= nums.length <= 10,000",
        "-1,000,000,000 <= nums[i] <= 1,000,000,000",
        "-1,000,000,000 <= target <= 1,000,000,000",
        "Exactly one valid answer exists.",
      ],
      followUp: "Trying every pair takes O(n^2). Can you solve it faster than that?",
    },
  },
  showcaseStep: 6,
};
