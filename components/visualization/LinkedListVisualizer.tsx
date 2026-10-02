import { layout } from "@/core/visualization/tokens";
import type { LinkedListStructure } from "@/core/visualization/types";
import { toneColors } from "@/core/visualization/tokens";
import { StructureCaption } from "./ArrayVisualizer";
import { Arrow } from "./Arrow";
import { Node } from "./Node";

const { w: W, h: H, gap: GAP } = layout.node;
const PITCH = W + GAP;
const PAD = 6;
const PTR_H = 24;

const liftFor = (span: number) => 22 + 12 * Math.min(span, 6);
const arcHeight = (span: number) => liftFor(span) * 0.75 + 12;

export function LinkedListVisualizer({ structure }: { structure: LinkedListStructure }) {
  const { nodes } = structure;
  const n = nodes.length;
  const slotOf = new Map(nodes.map((nd, i) => [nd.id, i]));
  const nullSlot = n;
  const slotX = (slot: number) => PAD + slot * PITCH;
  const totalW = slotX(n) + W + PAD;

  // Work out every arrow and how much headroom the curved ones need.
  const links = nodes.flatMap((nd, i) => {
    const target = nd.next === null ? nullSlot : (slotOf.get(nd.next) ?? nullSlot);
    return [{ node: nd, from: i, to: target }];
  });
  const needed = Math.max(0, ...links.filter((l) => l.to !== l.from + 1).map((l) => arcHeight(Math.abs(l.to - l.from))));
  const arcTop = Math.max(needed, structure.allowArcs ? arcHeight(n) : 0);

  const nodeY = arcTop + 4;
  const midY = nodeY + H / 2;

  // Stack pointers that share a target.
  const rowsAt: Record<number, number> = {};
  const pointers = (structure.pointers ?? []).map((p) => {
    const slot = p.target === null ? nullSlot : (slotOf.get(p.target) ?? nullSlot);
    const row = rowsAt[slot] ?? 0;
    rowsAt[slot] = row + 1;
    return { ...p, slot, row };
  });
  const rows = Math.max(1, ...Object.values(rowsAt));
  const totalH = nodeY + H + 10 + Math.max(rows, 3) * PTR_H;

  const pointerColor = toneColors("pointer");
  const nullColor = toneColors("neutral");

  return (
    <figure className="m-0" aria-label={structure.label ?? "linked list"}>
      {structure.label && <StructureCaption>{structure.label}</StructureCaption>}
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        width="100%"
        className="mx-auto block h-auto"
        style={{ maxWidth: totalW }}
        role="img"
        aria-label={`${structure.label ?? "linked list"}: ${nodes.map((nd) => nd.value).join(", ")}`}
      >
        {/* terminator */}
        <g>
          <rect
            x={slotX(nullSlot)}
            y={midY - 14}
            width={W}
            height={28}
            rx={8}
            fill="none"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            style={{ stroke: nullColor.border }}
          />
          <text
            x={slotX(nullSlot) + W / 2}
            y={midY}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-mono"
            style={{ fill: "var(--color-muted)", fontSize: 12 }}
          >
            null
          </text>
        </g>

        {links.map(({ node, from, to }) => {
          const straight = to === from + 1;
          const fromPt = { x: slotX(from) + W - 8, y: straight ? midY : nodeY };
          const toPt = straight
            ? { x: slotX(to) - 2, y: midY }
            : { x: slotX(to) + (to === nullSlot ? W / 2 : W / 2), y: nodeY - 1 };
          return (
            <Arrow
              key={`${node.id}->${node.next}`}
              from={fromPt}
              to={toPt}
              curved={!straight}
              lift={liftFor(Math.abs(to - from))}
              tone={node.linkTone}
            />
          );
        })}

        {nodes.map((nd, i) => (
          <Node key={nd.id} node={nd} x={slotX(i)} y={nodeY} w={W} h={H} />
        ))}

        {pointers.map((p) => {
          const text = p.label;
          const pillW = text.length * 6.6 + 24;
          return (
            <g
              key={p.label}
              className="viz-move"
              style={{
                transform: `translate(${slotX(p.slot) + W / 2}px, ${nodeY + H + 8 + p.row * PTR_H}px)`,
              }}
            >
              <rect
                x={-pillW / 2}
                y={0}
                width={pillW}
                height={20}
                rx={5}
                strokeWidth={1}
                style={{ fill: pointerColor.bg, stroke: pointerColor.border }}
              />
              <text
                x={0}
                y={10}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-mono"
                style={{ fill: pointerColor.text, fontSize: 11, fontWeight: 500 }}
              >
                {`↑ ${text}`}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
