import { layout } from "@/core/visualization/tokens";
import type { ArrayStructure } from "@/core/visualization/types";
import { ArrayCell } from "./ArrayCell";
import { IndexLabel } from "./IndexLabel";
import { Pointer } from "./Pointer";
import { SearchRange } from "./SearchRange";

const { cell: C, cellGap: G } = layout;
const RANGE_H = 28;
const INDEX_H = 20;
const PTR_H = 24;

export function StructureCaption({ children }: { children: React.ReactNode }) {
  return <figcaption className="mb-2 text-center font-mono text-[11px] uppercase tracking-wider text-muted">{children}</figcaption>;
}

export function ArrayVisualizer({ structure }: { structure: ArrayStructure }) {
  const n = structure.cells.length;
  const stack: Record<number, number> = {};
  const pointers = (structure.pointers ?? []).map((p) => {
    const row = stack[p.index] ?? 0;
    stack[p.index] = row + 1;
    return { ...p, row };
  });
  const usedRows = Math.max(0, ...Object.values(stack));
  const rows = Math.max(usedRows, structure.pointerRows ?? (pointers.length > 0 ? 1 : 0));

  const width = Math.max(n * (C + G) - G, 0);
  const cellTop = RANGE_H;
  const height = RANGE_H + C + INDEX_H + (rows > 0 ? 6 + rows * PTR_H : 0);
  const x = (i: number) => i * (C + G);
  const range = structure.range;

  return (
    <figure className="m-0" aria-label={structure.label ?? "array"}>
      {structure.label && <StructureCaption>{structure.label}</StructureCaption>}
      {n === 0 ? (
        <p className="text-center font-mono text-sm text-muted">[ ] empty array</p>
      ) : (
        <div className="overflow-x-auto pb-1">
          <div className="relative mx-auto" style={{ width, height }}>
            {range && (
              <SearchRange
                left={x(range.from)}
                width={(range.to - range.from + 1) * (C + G) - G}
                label={range.label}
                height={RANGE_H}
              />
            )}
            {structure.cells.map((cell, i) => (
              <ArrayCell key={i} value={cell.value} tone={cell.tone} faded={cell.faded} size={C} left={x(i)} top={cellTop} />
            ))}
            {structure.cells.map((_, i) => (
              <IndexLabel key={`i${i}`} index={i} left={x(i)} top={cellTop + C + 3} width={C} />
            ))}
            {pointers.map((p) => (
              <Pointer
                key={p.label}
                label={p.label}
                width={C}
                x={x(p.index)}
                y={cellTop + C + INDEX_H + 4 + p.row * PTR_H}
              />
            ))}
          </div>
        </div>
      )}
    </figure>
  );
}
