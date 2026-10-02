/** Central animation timing. Never hard-code durations in a visualization. */
export const animation = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 600,
} as const;

export type Speed = "slow" | "normal" | "fast";

/** Delay between automatic steps while playing. */
export const stepIntervalMs: Record<Speed, number> = {
  slow: 1800,
  normal: 1100,
  fast: 500,
};

export const speeds: Speed[] = ["slow", "normal", "fast"];
