import type { AlgorithmMeta } from "@/core/algorithm/types";

export const metadata: Omit<AlgorithmMeta, "languages"> = {
  id: "valid-parentheses",
  slug: "valid-parentheses",
  type: "problem",
  title: "Valid Parentheses",
  category: "Stack",
  difficulty: "Easy",
  description: "Decide whether every bracket in a string is closed by the right kind of bracket, in the right order.",
  tags: ["stack", "string", "brackets"],
  complexity: {
    time: "O(n)",
    space: "O(n)",
    note: "One pass over the string. In the worst case all characters are opening brackets and sit on the stack.",
  },
  inputSummary: 's = "{[()]}"',
  howItWorks: [
    "Brackets nest like boxes: the last one opened must be the first one closed. That is exactly the Last-In, First-Out rule of a stack.",
    "Scan left to right. Opening brackets are pushed. A closing bracket must match the top of the stack: compare, then pop.",
    "If a closing bracket meets an empty stack or the wrong partner, the string is invalid. When the scan ends, the stack must be empty.",
  ],
  related: ["concept:stack", "problem:two-sum"],
  problem: {
    number: 20,
    url: "https://leetcode.com/problems/valid-parentheses/",
    summary: "Check that a string made of brackets is balanced and correctly nested.",
    statement: {
      description: [
        "You are given a string s that contains only the six characters ( ) [ ] { }.",
        "Decide whether s is valid. A string is valid when every opening bracket is closed by a bracket of the same type, the brackets are closed in the correct order (the most recently opened one is closed first), and every closing bracket has a matching opening bracket before it. Return true if the string is valid, otherwise false.",
      ],
      examples: [
        { input: 's = "()"', output: "true", explanation: "The single pair is opened and then closed by the same type." },
        { input: 's = "()[]{}"', output: "true", explanation: "Three separate pairs, each closed right after it opens." },
        { input: 's = "(]"', output: "false", explanation: "The ( is closed by a ], which is a different type." },
        { input: 's = "([])"', output: "true", explanation: "The [ ] pair sits completely inside the ( ) pair, so the order is correct." },
        { input: 's = "{[()]}"', output: "true", explanation: "This is the example animated on this page: three nested pairs, closed from the inside out." },
      ],
      constraints: ["1 <= s.length <= 10,000", "s consists only of the characters ( ) [ ] { }"],
    },
  },
  showcaseStep: 8,
};
