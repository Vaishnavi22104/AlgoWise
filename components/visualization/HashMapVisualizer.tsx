import { toneColors } from "@/core/visualization/tokens";
import type { HashMapStructure } from "@/core/visualization/types";
import { StructureCaption } from "./ArrayVisualizer";

export function HashMapVisualizer({ structure }: { structure: HashMapStructure }) {
  return (
    <figure className="m-0" aria-label={structure.label ?? "hash map"}>
      {structure.label && <StructureCaption>{structure.label}</StructureCaption>}
      <div className="flex min-h-11 flex-wrap items-center justify-center gap-2">
        {structure.entries.length === 0 && <span className="font-mono text-sm text-muted">{"{ }  empty"}</span>}
        {structure.entries.map((e) => {
          const c = toneColors(e.tone ?? "neutral");
          return (
            <span
              key={String(e.key)}
              data-tone={e.tone ?? "neutral"}
              className="viz-pop viz-tone inline-flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 font-mono text-sm font-semibold"
              style={{ background: c.bg, borderColor: c.border, color: c.text }}
            >
              {e.key}
              <span aria-hidden="true" className="opacity-50">→</span>
              {e.value}
            </span>
          );
        })}
      </div>
    </figure>
  );
}
