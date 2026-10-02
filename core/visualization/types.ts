/**
 * Visualization state model.
 *
 * The renderer knows nothing about specific algorithms: it only receives a
 * `VisualizationState`. Executors produce one state per step, so the execution
 * trace is always the single source of truth.
 */

/** Semantic colour roles. Meanings are identical across every algorithm. */
export type Tone = "neutral" | "active" | "success" | "warning" | "error" | "pointer";

export const TONES: readonly Tone[] = [
  "neutral",
  "active",
  "success",
  "warning",
  "error",
  "pointer",
];

export type VisualizationEvent =
  | "compare"
  | "select"
  | "swap"
  | "insert"
  | "delete"
  | "push"
  | "pop"
  | "visit"
  | "move-pointer"
  | "found"
  | "not-found"
  | "update-variable";

export type Primitive = string | number;

export interface ArrayCellState {
  value: Primitive;
  tone?: Tone;
  /** Dim a cell, e.g. when it is outside the active search range. */
  faded?: boolean;
}

export interface ArrayPointer {
  index: number;
  label: string;
}

export interface ArrayStructure {
  kind: "array";
  id: string;
  label?: string;
  cells: ArrayCellState[];
  pointers?: ArrayPointer[];
  /** Inclusive range highlighted above the cells. */
  range?: { from: number; to: number; label?: string } | null;
  /** Reserve this many pointer rows so the layout does not jump between steps. */
  pointerRows?: number;
}

export interface StackStructure {
  kind: "stack";
  id: string;
  label?: string;
  /** Bottom first, top last. */
  items: { value: Primitive; tone?: Tone }[];
  operation?: { type: "push" | "pop" | "peek"; value: Primitive } | null;
}

export interface ListNodeState {
  id: string;
  value: Primitive;
  /** Id of the next node, or null for the list terminator. */
  next: string | null;
  tone?: Tone;
  faded?: boolean;
  /** Highlight the outgoing arrow, e.g. right after it was re-pointed. */
  linkTone?: Tone;
}

export interface ListPointer {
  /** Node id, or null to point at the terminator. */
  target: string | null;
  label: string;
}

export interface LinkedListStructure {
  kind: "linked-list";
  id: string;
  label?: string;
  /** Slots are assigned by array order, so re-linking never moves nodes. */
  nodes: ListNodeState[];
  pointers?: ListPointer[];
  /** Reserve headroom for curved arrows (set when links can point backwards). */
  allowArcs?: boolean;
}

export interface HashMapStructure {
  kind: "hashmap";
  id: string;
  label?: string;
  entries: { key: Primitive; value: Primitive; tone?: Tone }[];
}

export type Structure = ArrayStructure | StackStructure | LinkedListStructure | HashMapStructure;

export interface Variable {
  name: string;
  value: Primitive | boolean | null;
  tone?: Tone;
}

export interface Comparison {
  left: string;
  op: string;
  right: string;
  /** Result of the comparison, rendered as a check or a cross. */
  holds?: boolean;
  tone?: Tone;
}

export interface ResultBanner {
  text: string;
  tone: "success" | "error";
}

export interface VisualizationState {
  structures: Structure[];
  variables?: Variable[];
  comparison?: Comparison | null;
  result?: ResultBanner | null;
}
