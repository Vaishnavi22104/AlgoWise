import { toneColors } from "@/core/visualization/tokens";
import type { ResultBanner } from "@/core/visualization/types";

export function ResultIndicator({ result }: { result: ResultBanner }) {
  const c = toneColors(result.tone);
  return (
    <div
      className="viz-pop inline-flex max-w-full items-center gap-2 rounded-lg border-2 px-3.5 py-1.5 text-sm font-semibold"
      style={{ background: c.bg, borderColor: c.border, color: c.text }}
      role="status"
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.solid }} aria-hidden="true" />
      <span className="break-words">{result.text}</span>
    </div>
  );
}
