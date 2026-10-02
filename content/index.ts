/**
 * Content manifest. To publish a new algorithm, add one import and one array
 * entry here. Explore, search, progress and routes pick it up automatically.
 * (`npm run create-algorithm` edits this file for you.)
 */
import { registerAlgorithm } from "@/core/algorithm/registry";
import type { AlgorithmDefinition } from "@/core/algorithm/types";

// <create-algorithm:imports>
import arrayTraversal from "@/algorithms/array-traversal";
import binarySearch from "@/algorithms/binary-search";
import stack from "@/algorithms/stack";
import singlyLinkedList from "@/algorithms/linked-list";
import twoSum from "@/problems/two-sum";
import validParentheses from "@/problems/valid-parentheses";
import binarySearchProblem from "@/problems/binary-search";
import reverseLinkedList from "@/problems/reverse-linked-list";
import mergeTwoSortedLists from "@/problems/merge-two-sorted-lists";
// </create-algorithm:imports>

export const allAlgorithms: AlgorithmDefinition[] = [
  // <create-algorithm:list>
  arrayTraversal,
  binarySearch,
  stack,
  singlyLinkedList,
  twoSum,
  validParentheses,
  binarySearchProblem,
  reverseLinkedList,
  mergeTwoSortedLists,
  // </create-algorithm:list>
];

allAlgorithms.forEach(registerAlgorithm);

export * from "@/core/algorithm/registry";
