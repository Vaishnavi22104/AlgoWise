import { toneColors } from "@/core/visualization/tokens";

interface Props {
  left: number;
  width: number;
  label?: string;
  height: number;
}

/** Bracket drawn above the cells that are still candidates. */
export function SearchRange({ left, width, label, height }: Props) {
  const c = toneColors("active");
  return (
    <div className="viz-move absolute top-0" style={{ left, width, height }} aria-hidden="true">
      <div
        className="absolute inset-x-0 bottom-1 rounded-t-md border-2 border-b-0"
        style={{ height: 8, borderColor: c.border }}
      />
      {label && (
        <div
          className="absolute inset-x-0 top-0 whitespace-nowrap text-center text-[11px] font-medium"
          style={{ color: c.text }}
        >
          {width >= 110 ? label : "range"}
        </div>
      )}
    </div>
  );
}
