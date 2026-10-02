import { getAlgorithm } from "@/core/algorithm/registry";
import type { LearningConcept } from "@/lib/progress-stats";
import "@/content";

/**
 * The learning journey: each concept and the practice problems recommended for it.
 * Slugs must exist in the registry (a test checks this).
 */
export const LEARNING_PATH: { concept: string; problems: string[] }[] = [
  { concept: "array-traversal", problems: ["two-sum"] },
  { concept: "binary-search", problems: ["binary-search"] },
  { concept: "stack", problems: ["valid-parentheses"] },
  { concept: "singly-linked-list", problems: ["reverse-linked-list", "merge-two-sorted-lists"] },
];

/** Serializable, so a server page can hand it to the client. */
export function buildLearningPath(): LearningConcept[] {
  return LEARNING_PATH.map(({ concept, problems }) => {
    const c = getAlgorithm("concept", concept);
    if (!c) throw new Error(`Learning path: unknown concept "${concept}"`);
    return {
      slug: c.slug,
      title: c.title,
      problems: problems.map((slug) => {
        const p = getAlgorithm("problem", slug);
        if (!p?.problem) throw new Error(`Learning path: unknown problem "${slug}"`);
        return { slug: p.slug, title: p.title, number: p.problem.number };
      }),
    };
  });
}
