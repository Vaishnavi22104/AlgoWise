import type { CSSProperties } from "react";
import { animation } from "@/core/visualization/timing";
import type { Structure, VisualizationState } from "@/core/visualization/types";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { ComparisonIndicator } from "./ComparisonIndicator";
import { HashMapVisualizer } from "./HashMapVisualizer";
import { LinkedListVisualizer } from "./LinkedListVisualizer";
import { ResultIndicator } from "./ResultIndicator";
import { StackVisualizer } from "./StackVisualizer";
import { VariableBadge } from "./VariableBadge";

function StructureView({ structure }: { structure: Structure }) {
  switch (structure.kind) {
    case "array":
      return <ArrayVisualizer structure={structure} />;
    case "stack":
      return <StackVisualizer structure={structure} />;
    case "linked-list":
      return <LinkedListVisualizer structure={structure} />;
    case "hashmap":
      return <HashMapVisualizer structure={structure} />;
  }
}

const motionVars = {
  "--dur-fast": `${animation.fast}ms`,
  "--dur-normal": `${animation.normal}ms`,
  "--dur-slow": `${animation.slow}ms`,
} as CSSProperties;

/**
 * Renders any VisualizationState. It has no idea which algorithm produced it.
 * `compact` is used for thumbnails.
 */
export function VisualizationCanvas({ state, compact = false }: { state: VisualizationState; compact?: boolean }) {
  return (
    <div
      className={`viz-root flex flex-col gap-5 ${compact ? "p-4" : "min-h-[400px] p-5"}`}
      style={motionVars}
      data-testid="visualization-canvas"
    >
      {!compact && (
        <div className="flex min-h-7 flex-wrap items-center gap-2" aria-label="Variables">
          {state.variables?.map((v) => <VariableBadge key={v.name} variable={v} />)}
        </div>
      )}
      <div className={`flex flex-1 flex-col justify-center gap-7 ${compact ? "" : "py-1"}`}>
        {state.structures.map((s) => (
          <StructureView key={s.id} structure={s} />
        ))}
      </div>
      {!compact && (
        <div className="flex min-h-[38px] flex-wrap items-center justify-center gap-3" aria-live="polite">
          {state.comparison && <ComparisonIndicator comparison={state.comparison} />}
          {state.result && <ResultIndicator result={state.result} />}
        </div>
      )}
    </div>
  );
}
