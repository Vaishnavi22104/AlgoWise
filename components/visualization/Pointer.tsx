import { toneColors } from "@/core/visualization/tokens";

interface Props {
  label: string;
  x: number;
  y: number;
  width: number;
}

/** Purple pointer tag. It slides because only its transform changes between steps. */
export function Pointer({ label, x, y, width }: Props) {
  const c = toneColors("pointer");
  return (
    <div
      className="viz-move absolute left-0 top-0 flex justify-center"
      style={{ width, transform: `translate(${x}px, ${y}px)` }}
    >
      <span
        className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-medium leading-4"
        style={{ background: c.bg, borderColor: c.border, color: c.text }}
      >
        <span aria-hidden="true">↑</span>
        {label}
      </span>
    </div>
  );
}
