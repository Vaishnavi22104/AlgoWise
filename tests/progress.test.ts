import { describe, expect, it } from "vitest";
import {
  computeLearning,
  emptyProgress,
  isItemDone,
  sanitizeProgress,
  withCheckpoint,
  withProblem,
  XP,
} from "@/lib/progress-stats";
import { buildLearningPath, LEARNING_PATH } from "@/content/learning";

const path = buildLearningPath();

describe("learning path", () => {
  it("links concepts to exactly the agreed problems", () => {
    const summary = path.map((c) => [c.title, c.problems.map((p) => `#${p.number} ${p.title}`)]);
    expect(summary).toEqual([
      ["Array Traversal", ["#1 Two Sum"]],
      ["Binary Search", ["#704 Binary Search"]],
      ["Stack", ["#20 Valid Parentheses"]],
      ["Singly Linked List", ["#206 Reverse Linked List", "#21 Merge Two Sorted Lists"]],
    ]);
    expect(LEARNING_PATH).toHaveLength(4);
  });
});

describe("progress calculations", () => {
  it("starts empty with zero XP and focus on the first concept", () => {
    const s = computeLearning(emptyProgress(), path);
    expect(s.xp).toBe(0);
    expect(s.checkpointsDone).toBe(0);
    expect(s.checkpointsTotal).toBe(12);
    expect(s.problemsTotal).toBe(5);
    expect(s.overallPct).toBe(0);
    expect(s.focus?.slug).toBe("array-traversal");
  });

  it("awards XP only for ticked items: 10 / 10 / 0 for checkpoints, 20 per problem", () => {
    let d = emptyProgress();
    d = withCheckpoint(d, "binary-search", "understand", true);
    expect(computeLearning(d, path).xp).toBe(XP.understand);
    d = withCheckpoint(d, "binary-search", "explore", true);
    expect(computeLearning(d, path).xp).toBe(20);
    d = withCheckpoint(d, "binary-search", "practice", true);
    expect(computeLearning(d, path).xp).toBe(20);
    d = withProblem(d, "binary-search", true);
    expect(computeLearning(d, path).xp).toBe(40);
  });

  it("reports per-concept percentages and the in-progress concept as focus", () => {
    let d = emptyProgress();
    for (const id of ["understand", "explore", "practice"] as const) d = withCheckpoint(d, "array-traversal", id, true);
    d = withCheckpoint(d, "binary-search", "understand", true);
    d = withCheckpoint(d, "binary-search", "explore", true);
    d = withCheckpoint(d, "stack", "understand", true);
    const s = computeLearning(d, path);
    expect(s.concepts.map((c) => c.pct)).toEqual([100, 67, 33, 0]);
    expect(s.checkpointsDone).toBe(6);
    expect(s.overallPct).toBe(50);
    expect(s.focus?.slug).toBe("binary-search");
    expect(s.focus?.done).toBe(2);
  });

  it("has no focus once everything is complete", () => {
    let d = emptyProgress();
    for (const c of path) for (const id of ["understand", "explore", "practice"] as const) d = withCheckpoint(d, c.slug, id, true);
    const s = computeLearning(d, path);
    expect(s.focus).toBeNull();
    expect(s.overallPct).toBe(100);
  });

  it("unticking removes the checkpoint and its XP (no XP farming)", () => {
    let d = withCheckpoint(emptyProgress(), "stack", "understand", true);
    d = withCheckpoint(d, "stack", "understand", false);
    expect(d.checkpoints).toEqual({});
    expect(computeLearning(d, path).xp).toBe(0);
    d = withProblem(withProblem(emptyProgress(), "two-sum", true), "two-sum", false);
    expect(d.completedProblems).toEqual({});
  });

  it("ignores unknown slugs when counting", () => {
    const d = withProblem(withCheckpoint(emptyProgress(), "not-real", "understand", true), "ghost", true);
    const s = computeLearning(d, path);
    expect(s.xp).toBe(0);
    expect(s.checkpointsDone).toBe(0);
    expect(s.problemsDone).toBe(0);
  });

  it("does not mutate its input", () => {
    const d = emptyProgress();
    withCheckpoint(d, "stack", "explore", true);
    withProblem(d, "two-sum", true);
    expect(d).toEqual(emptyProgress());
  });

  it("isItemDone: concepts need all three checkpoints, problems need to be ticked", () => {
    let d = withCheckpoint(emptyProgress(), "stack", "understand", true);
    expect(isItemDone(d, { type: "concept", slug: "stack" })).toBe(false);
    d = withCheckpoint(withCheckpoint(d, "stack", "explore", true), "stack", "practice", true);
    expect(isItemDone(d, { type: "concept", slug: "stack" })).toBe(true);
    expect(isItemDone(withProblem(d, "two-sum", true), { type: "problem", slug: "two-sum" })).toBe(true);
    expect(isItemDone(d, { type: "problem", slug: "two-sum" })).toBe(false);
  });
});

describe("sanitizeProgress", () => {
  it("round-trips valid data through JSON", () => {
    let d = withCheckpoint(emptyProgress(), "stack", "explore", true);
    d = withProblem(d, "valid-parentheses", true);
    expect(sanitizeProgress(JSON.parse(JSON.stringify(d)))).toEqual(d);
  });

  it("discards old prototype data and garbage", () => {
    expect(sanitizeProgress({ completed: { "concept:stack": 1 }, points: 50, days: [], recent: [], revisits: {} })).toEqual(emptyProgress());
    expect(sanitizeProgress(null)).toEqual(emptyProgress());
    expect(sanitizeProgress("nope")).toEqual(emptyProgress());
    expect(sanitizeProgress({ version: 2, checkpoints: { stack: { explore: "yes", bogus: 5 } }, completedProblems: { a: -1, b: 3 } })).toEqual({
      version: 2,
      checkpoints: {},
      completedProblems: { b: 3 },
    });
  });
});
