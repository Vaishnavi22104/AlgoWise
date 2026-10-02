"use client";

import { useEffect, useState } from "react";
import binarySearch from "@/algorithms/binary-search";
import { CodeFallback } from "@/components/editor/CodeFallback";
import { languageMeta, lineFor, pickImplementation } from "@/core/algorithm/languages";
import { usePreferredLanguage } from "@/lib/language";
import { VisualizationCanvas } from "@/components/visualization/VisualizationCanvas";

const steps = binarySearch.run();

/** Auto-playing Binary Search used on the landing page: the real engine, not a screenshot. */
export function LivePreview() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % steps.length), 1500);
    return () => clearInterval(id);
  }, []);

  const step = steps[i];
  const { id: langId, impl } = pickImplementation(binarySearch.languages, usePreferredLanguage());
  return (
    <div className="overflow-hidden rounded-xl border border-line-strong bg-surface shadow-pop" aria-label="Live preview of the Binary Search visualization">
      <div className="flex items-center justify-between border-b border-line bg-slate-50 px-4 py-2">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <span className="font-mono text-xs text-muted">Binary Search · {languageMeta(langId).label}</span>
        <span className="font-mono text-xs text-muted">
          Step {step.id} / {steps.length}
        </span>
      </div>
      <div className="grid md:grid-cols-[5fr_6fr]">
        <div className="h-[300px] border-b border-line md:border-b-0 md:border-r">
          <CodeFallback source={impl.source} activeLine={lineFor(impl, step.anchor)} />
        </div>
        <div className="min-h-[300px]">
          <VisualizationCanvas state={step.state} />
        </div>
      </div>
      <div className="border-t border-line bg-slate-50 px-4 py-2.5 text-sm">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Now </span>
        <span className="font-mono font-semibold">{step.operation}</span>
        <span className="ml-2 text-muted">{step.explanation}</span>
      </div>
    </div>
  );
}
