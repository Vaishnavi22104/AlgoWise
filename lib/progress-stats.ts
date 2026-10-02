/**
 * My Learning: the progress model. Pure data and pure functions, no React and no storage,
 * so a future account system can persist or migrate exactly this shape.
 *
 * Everything here is SELF-REPORTED: the learner ticks a box, nothing is verified.
 */

export const CHECKPOINTS = ["understand", "explore", "practice"] as const;
export type CheckpointId = (typeof CHECKPOINTS)[number];

export const CHECKPOINT_LABELS: Record<CheckpointId, string> = {
  understand: "Understand the concept",
  explore: "Explore the visualization",
  practice: "Practice recommended problem",
};

/** XP is a record of learning activity. It is not a measure of DSA mastery. */
export const XP = { understand: 10, explore: 10, practice: 0, problem: 20 } as const;

export const SCHEMA_VERSION = 2;

/**
 * What gets saved (localStorage key `algowise:progress:v1`).
 * XP is derived from this, never stored, so it cannot drift out of sync.
 *
 * Conceptually: userProgress { concepts, checkpoints, completedProblems, xp }.
 */
export interface ProgressData {
  version: typeof SCHEMA_VERSION;
  /** concept slug -> checkpoint -> time the learner marked it complete */
  checkpoints: Record<string, Partial<Record<CheckpointId, number>>>;
  /** problem slug -> time the learner marked it complete */
  completedProblems: Record<string, number>;
}

export const emptyProgress = (): ProgressData => ({ version: SCHEMA_VERSION, checkpoints: {}, completedProblems: {} });

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isTime = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;

/**
 * Turns whatever was in storage into valid ProgressData.
 * Data written by the first prototype (page-view based, no `version: 2`) is dropped on purpose:
 * it recorded what was viewed, not what the learner reported.
 */
export function sanitizeProgress(raw: unknown): ProgressData {
  const out = emptyProgress();
  if (!isRecord(raw) || raw.version !== SCHEMA_VERSION) return out;

  if (isRecord(raw.checkpoints)) {
    for (const [slug, value] of Object.entries(raw.checkpoints)) {
      if (!isRecord(value)) continue;
      const entry: Partial<Record<CheckpointId, number>> = {};
      for (const id of CHECKPOINTS) if (isTime(value[id])) entry[id] = value[id] as number;
      if (Object.keys(entry).length) out.checkpoints[slug] = entry;
    }
  }
  if (isRecord(raw.completedProblems)) {
    for (const [slug, at] of Object.entries(raw.completedProblems)) if (isTime(at)) out.completedProblems[slug] = at;
  }
  return out;
}

/** Returns a new object with one checkpoint set or cleared. */
export function withCheckpoint(data: ProgressData, concept: string, id: CheckpointId, done: boolean, now = Date.now()): ProgressData {
  const entry = { ...data.checkpoints[concept] };
  if (done) entry[id] = entry[id] ?? now;
  else delete entry[id];
  const checkpoints = { ...data.checkpoints };
  if (Object.keys(entry).length) checkpoints[concept] = entry;
  else delete checkpoints[concept];
  return { ...data, checkpoints };
}

/** Returns a new object with one recommended problem set or cleared. */
export function withProblem(data: ProgressData, problem: string, done: boolean, now = Date.now()): ProgressData {
  const completedProblems = { ...data.completedProblems };
  if (done) completedProblems[problem] = completedProblems[problem] ?? now;
  else delete completedProblems[problem];
  return { ...data, completedProblems };
}

/** One concept and the problems recommended for it. Built from content, passed in so this file stays pure. */
export interface LearningConcept {
  slug: string;
  title: string;
  problems: { slug: string; title: string; number: number }[];
}

export interface ConceptProgress extends LearningConcept {
  checkpoints: { id: CheckpointId; label: string; done: boolean }[];
  done: number;
  total: number;
  pct: number;
  problemStatus: { slug: string; title: string; number: number; done: boolean }[];
}

export interface LearningSummary {
  concepts: ConceptProgress[];
  xp: number;
  checkpointsDone: number;
  checkpointsTotal: number;
  problemsDone: number;
  problemsTotal: number;
  /** Percentage of checkpoints marked complete. */
  overallPct: number;
  /** The concept to continue with, or null when everything is marked complete. */
  focus: ConceptProgress | null;
}

const pct = (done: number, total: number) => (total ? Math.round((done / total) * 100) : 0);

/** Only items that exist in `path` are counted, so stale keys in storage never inflate totals or XP. */
export function computeLearning(data: ProgressData, path: LearningConcept[]): LearningSummary {
  let xp = 0;
  const concepts: ConceptProgress[] = path.map((c) => {
    const marks = data.checkpoints[c.slug] ?? {};
    const checkpoints = CHECKPOINTS.map((id) => ({ id, label: CHECKPOINT_LABELS[id], done: !!marks[id] }));
    for (const cp of checkpoints) if (cp.done) xp += XP[cp.id];
    const problemStatus = c.problems.map((p) => ({ ...p, done: !!data.completedProblems[p.slug] }));
    xp += problemStatus.filter((p) => p.done).length * XP.problem;
    const done = checkpoints.filter((cp) => cp.done).length;
    return { ...c, checkpoints, done, total: checkpoints.length, pct: pct(done, checkpoints.length), problemStatus };
  });

  const checkpointsDone = concepts.reduce((n, c) => n + c.done, 0);
  const checkpointsTotal = concepts.reduce((n, c) => n + c.total, 0);
  const problems = concepts.flatMap((c) => c.problemStatus);

  // Focus: the concept furthest along but not finished; otherwise the first one not started.
  const started = concepts.filter((c) => c.done > 0 && c.done < c.total).sort((a, b) => b.done - a.done);
  const focus = started[0] ?? concepts.find((c) => c.done === 0) ?? null;

  return {
    concepts,
    xp,
    checkpointsDone,
    checkpointsTotal,
    problemsDone: problems.filter((p) => p.done).length,
    problemsTotal: problems.length,
    overallPct: pct(checkpointsDone, checkpointsTotal),
    focus,
  };
}

/** True when the learner has marked every checkpoint (concepts) or the problem itself (problems). */
export function isItemDone(data: ProgressData, item: { type: "concept" | "problem"; slug: string }): boolean {
  if (item.type === "problem") return !!data.completedProblems[item.slug];
  const marks = data.checkpoints[item.slug];
  return !!marks && CHECKPOINTS.every((id) => marks[id]);
}
