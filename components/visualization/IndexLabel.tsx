export function IndexLabel({ index, left, top, width }: { index: number; left: number; top: number; width: number }) {
  return (
    <div
      className="absolute text-center font-mono text-[11px] text-muted"
      style={{ left, top, width }}
      aria-hidden="true"
    >
      {index}
    </div>
  );
}
