import { toneColors } from "@/core/visualization/tokens";
import type { Variable } from "@/core/visualization/types";

export function VariableBadge({ variable }: { variable: Variable }) {
  const c = toneColors(variable.tone ?? "neutral");
  const shown = typeof variable.value === "boolean" ? String(variable.value) : (variable.value ?? "null");
  return (
    <span
      className="viz-tone inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs"
      style={{ background: variable.tone ? c.bg : "var(--color-surface)", borderColor: variable.tone ? c.border : "var(--color-line-strong)", color: c.text }}
    >
      <span className="opacity-70">{variable.name}</span>
      <span className="font-semibold">{shown}</span>
    </span>
  );
}
