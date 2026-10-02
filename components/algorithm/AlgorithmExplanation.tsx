import { eventMeta } from "@/core/visualization/events";
import { toneColors } from "@/core/visualization/tokens";
import type { AlgorithmStep } from "@/core/algorithm/types";

/** "What is happening right now", shown under the controls. */
export function AlgorithmExplanation({ step }: { step: AlgorithmStep }) {
  const ev = step.event ? eventMeta[step.event] : null;
  const c = ev ? toneColors(ev.tone) : null;
  return (
    <div className="grid gap-x-6 gap-y-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" aria-live="polite">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Current operation</p>
        <p className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[15px] font-semibold text-ink">
          <span className="break-words">{step.operation}</span>
          {ev && c && (
            <span
              className="rounded border px-1.5 py-px font-sans text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: c.bg, borderColor: c.border, color: c.text }}
            >
              {ev.label}
            </span>
          )}
        </p>
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Explanation</p>
        <p className="mt-1 text-[15px] leading-relaxed text-ink">{step.explanation}</p>
      </div>
    </div>
  );
}
