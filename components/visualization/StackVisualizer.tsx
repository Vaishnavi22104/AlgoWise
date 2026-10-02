import { toneColors } from "@/core/visualization/tokens";
import type { StackStructure, Tone } from "@/core/visualization/types";
import { StructureCaption } from "./ArrayVisualizer";

const ITEM_H = 40;
const GAP = 6;
const MIN_SLOTS = 3;

const OPERATION: Record<"push" | "pop" | "peek", { text: string; arrow: string; tone: Tone }> = {
  push: { text: "PUSH", arrow: "↓", tone: "success" },
  pop: { text: "POP", arrow: "↑", tone: "warning" },
  peek: { text: "PEEK", arrow: "•", tone: "active" },
};

/** Badge that explains which stack operation just happened. */
export function OperationIndicator({ type, value }: { type: "push" | "pop" | "peek"; value: string | number }) {
  const meta = OPERATION[type];
  const c = toneColors(meta.tone);
  return (
    <span
      key={`${type}-${value}`}
      className="viz-pop inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold"
      style={{ background: c.bg, borderColor: c.border, color: c.text }}
    >
      <span aria-hidden="true">{type === "peek" ? "•" : meta.arrow}</span>
      {meta.text} {value}
    </span>
  );
}

export function StackVisualizer({ structure }: { structure: StackStructure }) {
  const { items, operation } = structure;
  const slots = Math.max(MIN_SLOTS, items.length);
  const innerHeight = slots * ITEM_H + (slots - 1) * GAP + 12;

  return (
    <figure className="m-0" aria-label={structure.label ?? "stack"}>
      {structure.label && <StructureCaption>{structure.label}</StructureCaption>}
      <div className="mb-2 flex h-6 justify-center">
        {operation && <OperationIndicator type={operation.type} value={operation.value} />}
      </div>
      <div
        className="relative mx-auto flex w-36 flex-col-reverse justify-start gap-[6px] rounded-b-xl border-x-2 border-b-2 px-2 pb-2 pt-1"
        style={{ height: innerHeight, borderColor: "var(--viz-neutral-border)" }}
      >
        {items.length === 0 && (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted">empty</span>
        )}
        {items.map((item, i) => {
          const c = toneColors(item.tone ?? "neutral");
          const isTop = i === items.length - 1;
          const entering = isTop && operation?.type === "push";
          return (
            <div
              key={i}
              data-tone={item.tone ?? "neutral"}
              className={`viz-tone relative flex items-center justify-center rounded-lg border-2 font-mono text-[17px] font-semibold ${entering ? "viz-drop" : ""}`}
              style={{ height: ITEM_H, background: c.bg, borderColor: c.border, color: c.text }}
            >
              {item.value}
              {isTop && (
                <span
                  className="absolute left-full ml-3 inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-medium"
                  style={{
                    background: "var(--viz-pointer-bg)",
                    borderColor: "var(--viz-pointer-border)",
                    color: "var(--viz-pointer-text)",
                  }}
                >
                  <span aria-hidden="true">←</span>top
                </span>
              )}
            </div>
          );
        })}
      </div>
    </figure>
  );
}
