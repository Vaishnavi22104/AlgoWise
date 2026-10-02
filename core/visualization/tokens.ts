import type { Tone } from "./types";

/**
 * Visualization colour tokens.
 *
 * The actual values live in `app/globals.css` (`--viz-<tone>-*`). Algorithms
 * and primitives only ever refer to a semantic `Tone`, never to a raw colour.
 *
 *  neutral  normal data
 *  active   the element currently being worked on
 *  success  correct / found / finished
 *  warning  currently being compared
 *  error    rejected / out of range / invalid
 *  pointer  pointer or reference relationship
 */
export const toneColors = (tone: Tone = "neutral") => ({
  bg: `var(--viz-${tone}-bg)`,
  border: `var(--viz-${tone}-border)`,
  text: `var(--viz-${tone}-text)`,
  solid: `var(--viz-${tone}-solid)`,
});

export const toneLabels: Record<Tone, string> = {
  neutral: "Normal data",
  active: "Active element",
  success: "Correct / found",
  warning: "Being compared",
  error: "Rejected / out of range",
  pointer: "Pointer / reference",
};

/** Layout constants shared by every primitive. */
export const layout = {
  cell: 56,
  cellGap: 8,
  node: { w: 48, h: 40, gap: 26 },
} as const;
