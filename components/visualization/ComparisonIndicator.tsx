import { Check, X } from "lucide-react";
import { toneColors } from "@/core/visualization/tokens";
import type { Comparison } from "@/core/visualization/types";

export function ComparisonIndicator({ comparison }: { comparison: Comparison }) {
  const c = toneColors(comparison.tone ?? "warning");
  const verdict = toneColors(comparison.holds ? "success" : "error");
  return (
    <div
      className="viz-pop inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[13px]"
      style={{ background: c.bg, borderColor: c.border, color: c.text }}
      role="status"
    >
      <span>{comparison.left}</span>
      <span className="font-semibold">{comparison.op}</span>
      {comparison.right && <span>{comparison.right}</span>}
      {comparison.holds !== undefined && (
        <span
          className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full"
          style={{ background: verdict.solid, color: "#fff" }}
          aria-label={comparison.holds ? "true" : "false"}
        >
          {comparison.holds ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
        </span>
      )}
    </div>
  );
}
