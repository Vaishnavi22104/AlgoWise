import type { AlgorithmDefinition } from "@/core/algorithm/types";
import { VisualizationCanvas } from "@/components/visualization/VisualizationCanvas";

/** A frozen, scaled-down frame of the real animation, picked by `showcaseStep`. */
export function AlgorithmThumbnail({ def }: { def: AlgorithmDefinition }) {
  const steps = def.run();
  const index = Math.max(0, Math.min(def.showcaseStep ?? Math.floor(steps.length / 2), steps.length - 1));
  return (
    <div className="relative h-[156px] overflow-hidden border-b border-line bg-slate-50/70" aria-hidden="true">
      <div className="pointer-events-none absolute left-1/2 top-2 w-[640px] origin-top -translate-x-1/2 scale-[0.56]">
        <VisualizationCanvas state={steps[index].state} compact />
      </div>
    </div>
  );
}
