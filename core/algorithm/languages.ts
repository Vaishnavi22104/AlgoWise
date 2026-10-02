/**
 * Programming languages AlgoWise can show code in.
 *
 * Languages only change which SOURCE TEXT is displayed and how it is highlighted.
 * Execution steps and visualization are shared by every language, so adding a language
 * never touches the visualization engine: add an entry here, then add an implementation
 * to the algorithms that should offer it.
 */
export const LANGUAGES = [
  { id: "java", label: "Java", editor: "java" },
  { id: "python", label: "Python", editor: "python" },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]["id"];

/** Shown first, and the fallback when an algorithm has no code in the learner's language. */
export const DEFAULT_LANGUAGE: LanguageId = "java";

export const isLanguageId = (v: unknown): v is LanguageId => LANGUAGES.some((l) => l.id === v);

export const languageMeta = (id: LanguageId) => LANGUAGES.find((l) => l.id === id)!;

/** Code for one language plus the map from step anchors to lines of that code. */
export interface CodeImplementation {
  /** Text shown in the editor (anchor markers already removed). */
  source: string;
  /** anchor -> 1-based line of `source`. */
  lines: Record<string, number>;
}

/** All implementations of one algorithm. Only languages that are listed are offered. */
export type Implementations = Partial<Record<LanguageId, CodeImplementation>>;

const MARKER = /\s*(?:\/\/|#)\s*@([A-Za-z][\w-]*)\s*$/;

/**
 * Write the code with a trailing `//@anchor` (Java and similar) or `#@anchor` (Python) comment on every
 * line a step can point at. The markers are stripped from what the learner sees, and the line numbers are
 * computed for you, so editing the code never leaves a stale line map.
 *
 *   int mid = low + (high - low) / 2;   //@mid
 */
export function defineCode(annotated: string): CodeImplementation {
  const lines: Record<string, number> = {};
  const out = annotated.split("\n").map((text, i) => {
    const m = MARKER.exec(text);
    if (!m) return text;
    if (lines[m[1]]) throw new Error(`Anchor "${m[1]}" is used twice (lines ${lines[m[1]]} and ${i + 1})`);
    lines[m[1]] = i + 1;
    return text.slice(0, m.index);
  });
  return { source: out.join("\n"), lines };
}

/** Line to highlight for a step, or 0 when this language has no line for that anchor. */
export const lineFor = (impl: CodeImplementation | undefined, anchor: string): number => impl?.lines[anchor] ?? 0;

/** The implementation to show: the chosen language if present, otherwise the default. */
export function pickImplementation(impls: Implementations, wanted: LanguageId): { id: LanguageId; impl: CodeImplementation } {
  if (impls[wanted]) return { id: wanted, impl: impls[wanted]! };
  const fallback = impls[DEFAULT_LANGUAGE] ? DEFAULT_LANGUAGE : (Object.keys(impls)[0] as LanguageId);
  return { id: fallback, impl: impls[fallback]! };
}

export const availableLanguages = (impls: Implementations) => LANGUAGES.filter((l) => impls[l.id]);
