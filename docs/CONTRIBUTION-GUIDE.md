# Contribution guide

Start with [CONTRIBUTING.md](../CONTRIBUTING.md). This page covers the review process and the sample issue and PR examples shown on the `/github` page.

## Labels

`good first issue`, `help wanted`, `new visualization`, `problem visualization`, `ui/ux`, `accessibility`, `performance`, `documentation`, `bug`, `enhancement`, `discussion`, `algorithm`, `testing`. Sync them with `.github/labels.yml`.

## Levels

- **Beginner**: documentation, UI text, a simple visualization, a small bug
- **Intermediate**: a new algorithm or problem, animation improvements, tests
- **Advanced**: animation engine, execution engine, performance, architecture, accessibility, security

## Sample issues

| # | Title | Label |
| --- | --- | --- |
| 101 | Add Array Traversal visualization (done) | good first issue |
| 102 | Add Linked List insertion animation | good first issue |
| 103 | Add Queue visualization | good first issue |
| 104 | Add Merge Sort visualization | help wanted |
| 105 | Add Sliding Window pattern | help wanted |
| 106 | Improve mobile visualization layout | ui/ux |
| 107 | Add keyboard controls (done) | enhancement |
| 108 | Add Binary Tree visualization | new visualization |
| 109 | Add accessibility support | accessibility |
| 110 | Optimize animation rendering | performance |

## Sample pull requests

- **#42 Add Binary Search Visualization**: merged. Executor, visualization, tests and metadata using the standard primitives.
- **#43 Add Queue Visualization**: open. Metadata, visualization and executor done; tests, documentation and review pending.
- **#44 Add Custom Graph Renderer**: changes requested. "The implementation introduces a separate animation library and custom color system. Please use the existing visualization primitives and design tokens."
- **#45 Improve Binary Search Explanation**: merged. Shows that you can contribute without adding a whole algorithm.

These are illustrative examples of the workflow, not real repository history.

## Review checklist

Follows the architecture, uses design tokens, has tests, was checked in the browser, updates docs, adds no unnecessary dependency.
