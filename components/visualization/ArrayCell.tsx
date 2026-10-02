import { toneColors } from "@/core/visualization/tokens";
import type { Primitive, Tone } from "@/core/visualization/types";

interface Props {
  value: Primitive;
  tone?: Tone;
  faded?: boolean;
  size: number;
  left: number;
  top: number;
}

/** One box of an array. Position is absolute so neighbours never reflow. */
export function ArrayCell({ value, tone = "neutral", faded, size, left, top }: Props) {
  const c = toneColors(tone);
  const lift = tone === "active" || tone === "warning";
  return (
    <div
      data-tone={tone}
      className="viz-tone absolute flex items-center justify-center rounded-lg border-2 font-mono text-[17px] font-semibold"
      style={{
        left,
        top,
        width: size,
        height: size,
        background: c.bg,
        borderColor: c.border,
        color: c.text,
        opacity: faded ? 0.55 : 1,
        transform: lift ? "translateY(-3px)" : "none",
      }}
    >
      {value}
    </div>
  );
}
