import { toneColors, toneLabels } from "@/core/visualization/tokens";
import { TONES } from "@/core/visualization/types";

/** Shows the shared colour language so viewers can decode any animation. */
export function ToneLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted" aria-label="Colour legend">
      {TONES.map((t) => (
        <li key={t} className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-[3px] border"
            style={{ background: toneColors(t).bg, borderColor: toneColors(t).border }}
          />
          {toneLabels[t]}
        </li>
      ))}
    </ul>
  );
}
