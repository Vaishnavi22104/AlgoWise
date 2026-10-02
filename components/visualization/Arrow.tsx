import type { Tone } from "@/core/visualization/types";
import { toneColors } from "@/core/visualization/tokens";

interface Props {
  /** Start point: the `next` dot of the source node. */
  from: { x: number; y: number };
  /** End point: left edge (straight) or top centre (curved) of the target. */
  to: { x: number; y: number };
  curved: boolean;
  /** Control-point lift for curved arrows. */
  lift: number;
  tone?: Tone;
}

/** A `next` reference. Re-pointed arrows mount fresh, so they fade in. */
export function Arrow({ from, to, curved, lift, tone = "neutral" }: Props) {
  const color = toneColors(tone).solid;
  const d = curved
    ? `M ${from.x} ${from.y} C ${from.x} ${from.y - lift}, ${to.x} ${to.y - lift}, ${to.x} ${to.y - 7}`
    : `M ${from.x} ${from.y} L ${to.x - 7} ${to.y}`;
  const head = curved
    ? `${to.x},${to.y} ${to.x - 4.5},${to.y - 8} ${to.x + 4.5},${to.y - 8}`
    : `${to.x},${to.y} ${to.x - 8},${to.y - 4.5} ${to.x - 8},${to.y + 4.5}`;
  return (
    <g className="viz-fade">
      <path d={d} fill="none" strokeWidth={tone === "neutral" ? 1.75 : 2.5} strokeLinecap="round" style={{ stroke: color }} />
      <polygon points={head} style={{ fill: color }} />
    </g>
  );
}
