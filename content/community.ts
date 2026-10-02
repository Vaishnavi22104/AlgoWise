/** Sample open-source activity used by the /github page and the docs. */

export const LABELS = [
  { name: "good first issue", color: "success", about: "Small, well-scoped, great for a first PR" },
  { name: "help wanted", color: "active", about: "We would love a contributor for this" },
  { name: "new visualization", color: "pointer", about: "Add a concept or algorithm" },
  { name: "problem visualization", color: "pointer", about: "Add a problem walkthrough" },
  { name: "ui/ux", color: "warning", about: "Layout, polish, responsiveness" },
  { name: "accessibility", color: "active", about: "Keyboard, screen reader, contrast, motion" },
  { name: "performance", color: "warning", about: "Rendering and bundle size" },
  { name: "documentation", color: "neutral", about: "Guides, comments, examples" },
  { name: "bug", color: "error", about: "Something is incorrect" },
  { name: "enhancement", color: "active", about: "Improve something that exists" },
  { name: "discussion", color: "neutral", about: "Ideas and design questions" },
  { name: "algorithm", color: "pointer", about: "Executor or trace logic" },
  { name: "testing", color: "success", about: "Tests and validation" },
] as const;

export type Level = "Beginner" | "Intermediate" | "Advanced";

export const ISSUES: { n: number; title: string; labels: string[]; level: Level; closed?: boolean }[] = [
  { n: 101, title: "Add Array Traversal visualization", labels: ["good first issue"], level: "Beginner", closed: true },
  { n: 102, title: "Add Linked List insertion animation", labels: ["good first issue"], level: "Beginner" },
  { n: 103, title: "Add Queue visualization", labels: ["good first issue"], level: "Beginner" },
  { n: 104, title: "Add Merge Sort visualization", labels: ["help wanted"], level: "Intermediate" },
  { n: 105, title: "Add Sliding Window pattern", labels: ["help wanted"], level: "Intermediate" },
  { n: 106, title: "Improve mobile visualization layout", labels: ["ui/ux"], level: "Beginner" },
  { n: 107, title: "Add keyboard controls", labels: ["enhancement"], level: "Intermediate", closed: true },
  { n: 108, title: "Add Binary Tree visualization", labels: ["new visualization"], level: "Intermediate" },
  { n: 109, title: "Add accessibility support", labels: ["accessibility"], level: "Advanced" },
  { n: 110, title: "Optimize animation rendering", labels: ["performance"], level: "Advanced" },
];

export type PrStatus = "merged" | "open" | "changes-requested";

export const PULL_REQUESTS: {
  n: number;
  title: string;
  status: PrStatus;
  body: string;
  includes?: string[];
  checklist?: { label: string; done: boolean }[];
  review?: string;
}[] = [
  {
    n: 42,
    title: "Add Binary Search Visualization",
    status: "merged",
    body: "Adds the Binary Search visualization using the standard visualization primitives.",
    includes: ["executor", "visualization", "tests", "metadata"],
  },
  {
    n: 43,
    title: "Add Queue Visualization",
    status: "open",
    body: "Adds a reusable Queue visualization and integrates enqueue/dequeue events.",
    checklist: [
      { label: "metadata", done: true },
      { label: "visualization", done: true },
      { label: "executor", done: true },
      { label: "tests", done: false },
      { label: "documentation", done: false },
      { label: "review", done: false },
    ],
  },
  {
    n: 44,
    title: "Add Custom Graph Renderer",
    status: "changes-requested",
    body: "Introduces a graph renderer for upcoming graph algorithms.",
    review:
      "The implementation introduces a separate animation library and custom color system. Please use the existing visualization primitives and design tokens.",
  },
  {
    n: 45,
    title: "Improve Binary Search Explanation",
    status: "merged",
    body: "Rewrites the step explanations. You do not have to add a whole algorithm to contribute.",
    includes: ["explanations", "accessibility", "documentation", "tests", "UI", "performance"],
  },
];

export const LEVELS: { level: Level; items: string[] }[] = [
  { level: "Beginner", items: ["Documentation", "UI text", "Simple visualization", "Small bug"] },
  { level: "Intermediate", items: ["New algorithm", "New problem visualization", "Animation improvement", "Testing"] },
  { level: "Advanced", items: ["Animation engine", "Execution engine", "Performance", "Architecture", "Accessibility", "Security"] },
];

export const CONTRIBUTION_TYPES = [
  { title: "Add a visualization", body: "Create a new algorithm animation.", label: "new visualization" },
  { title: "Add a problem", body: "Add a visual explanation for a problem.", label: "problem visualization" },
  { title: "Improve an existing visualization", body: "Make an animation clearer.", label: "enhancement" },
  { title: "Fix a bug", body: "Improve correctness or UI.", label: "bug" },
  { title: "Improve documentation", body: "Help contributors understand the framework.", label: "documentation" },
  { title: "Improve accessibility", body: "Keyboard navigation, screen readers, contrast and more.", label: "accessibility" },
  { title: "Improve performance", body: "Optimize rendering and execution.", label: "performance" },
] as const;

export const ROADMAP = [
  { phase: "Phase 1", name: "Foundation", status: "Shipped", items: ["Visualization engine", "Core components", "Initial algorithms", "Initial problem visualizations", "My Learning with progress saved in the browser"] },
  { phase: "Phase 2", name: "Community", status: "In progress", items: ["Contributor templates", "Issue system", "PR workflow", "More algorithms"] },
  { phase: "Phase 3", name: "Accounts", status: "Planned", items: ["User authentication", "Account-based progress", "Cross-device progress synchronization", "Google/GitHub login"] },
  { phase: "Phase 4", name: "Community learning", status: "Planned", items: ["Persistent learning history", "Learning streaks", "Personalized learning paths", "Friends/study groups", "Shared progress", "Discussions"] },
] as const;

/** Documented only. None of these exist in the MVP; they are good first discussions for contributors. */
export const FUTURE_OPPORTUNITIES = [
  "User authentication",
  "Account-based progress",
  "Cross-device progress synchronization",
  "Google/GitHub login",
  "Persistent learning history",
  "Learning streaks",
  "Personalized learning paths",
  "Friends/study groups",
  "Shared progress",
  "Discussions",
] as const;
