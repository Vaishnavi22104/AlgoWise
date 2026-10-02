import type { VisualizationEvent, VisualizationState } from "../visualization/types";
import type { Implementations } from "./languages";

export const CATEGORIES = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stack",
  "Queue",
  "Hashing",
  "Searching",
  "Sorting",
  "Trees",
  "Graphs",
  "Dynamic Programming",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export type AlgorithmType = "concept" | "problem";

/** One execution step. The UI renders exactly this and nothing else. */
export interface AlgorithmStep {
  /** 1-based, sequential. */
  id: number;
  /**
   * Language-independent name of the code position this step belongs to, e.g. "mid".
   * Every language implementation maps the same anchor to its own line (see `defineCode`),
   * so one trace drives the highlight in Java, Python and any future language.
   */
  anchor: string;
  /** Short label, e.g. "Comparing arr[mid] with target". */
  operation: string;
  /** One or two sentences for beginners. */
  explanation: string;
  state: VisualizationState;
  event?: VisualizationEvent;
}

export interface Complexity {
  time: string;
  space: string;
  note: string;
}

/** A full problem statement written in AlgoWise's own words (not copied from the original site). */
export interface ProblemStatement {
  /** Paragraphs describing the task, the input and what to return. */
  description: string[];
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  followUp?: string;
}

export interface ProblemReference {
  number: number;
  /** Link to the original problem. We never copy statements. */
  url: string;
  /** Our own one-sentence summary. */
  summary: string;
  /** Our own complete restatement: task, examples and limits. */
  statement: ProblemStatement;
}

/** Serializable metadata (safe to pass from server to client components). */
export interface AlgorithmMeta {
  id: string;
  slug: string;
  type: AlgorithmType;
  title: string;
  category: Category;
  difficulty: Difficulty;
  description: string;
  tags: string[];
  complexity: Complexity;
  /** Code per language. The trace and visualization are shared; only the text differs. */
  languages: Implementations;
  /** Human-readable description of the fixed demo input. */
  inputSummary: string;
  /** Paragraphs shown under "How it works". */
  howItWorks: string[];
  prerequisites?: string[];
  /** Keys like "concept:binary-search" or "problem:two-sum". */
  related?: string[];
  sourceLink?: string;
  contributor?: string;
  problem?: ProblemReference;
  /** Step index used for thumbnails. Defaults to the middle step. */
  showcaseStep?: number;
}

export interface AlgorithmDefinition extends AlgorithmMeta {
  /** Runs the trusted executor on the fixed demo input. */
  run: () => AlgorithmStep[];
}

export interface AlgorithmSpec<I> extends AlgorithmMeta {
  input: I;
  execute: (input: I) => AlgorithmStep[];
}
