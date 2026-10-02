import { toneColors } from "@/core/visualization/tokens";
import type { ListNodeState } from "@/core/visualization/types";

interface Props {
  node: ListNodeState;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Linked-list node: value on the left, a dot (the `next` pointer) on the right. */
export function Node({ node, x, y, w, h }: Props) {
  const c = toneColors(node.tone ?? "neutral");
  const dotX = x + w - 8;
  return (
    <g opacity={node.faded ? 0.5 : 1} className="viz-svg-tone" data-node={node.id} data-tone={node.tone ?? "neutral"}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={9}
        strokeWidth={2}
        className="viz-svg-tone"
        style={{ fill: c.bg, stroke: c.border }}
      />
      <line
        x1={x + w - 16}
        x2={x + w - 16}
        y1={y + 6}
        y2={y + h - 6}
        strokeWidth={1.5}
        className="viz-svg-tone"
        style={{ stroke: c.border }}
      />
      <text
        x={x + (w - 16) / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-mono"
        style={{ fill: c.text, fontSize: 15, fontWeight: 600 }}
      >
        {node.value}
      </text>
      <circle cx={dotX} cy={y + h / 2} r={3.5} className="viz-svg-tone" style={{ fill: c.border }} />
    </g>
  );
}
