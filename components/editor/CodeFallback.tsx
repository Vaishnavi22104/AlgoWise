"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight read-only code view with the same line highlight as the Monaco editor.
 * Shown while Monaco loads, and permanently if the editor bundle cannot be fetched
 * (for example when presenting offline).
 */
export function CodeFallback({ source, activeLine }: { source: string; activeLine: number }) {
  const lines = source.split("\n");
  const activeRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Keep the active line visible by scrolling ONLY this panel. scrollIntoView() would also
  // scroll the whole page, yanking the user back to the editor while they scroll elsewhere.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const line = activeRef.current;
    if (!scroller || !line) return;
    const top = line.offsetTop;
    const bottom = top + line.offsetHeight;
    if (top < scroller.scrollTop) scroller.scrollTop = top;
    else if (bottom > scroller.scrollTop + scroller.clientHeight) scroller.scrollTop = bottom - scroller.clientHeight;
  }, [activeLine]);

  return (
    <div ref={scrollerRef} className="relative h-full overflow-auto bg-surface py-3 font-mono text-[13px] leading-5" role="code" aria-label="Algorithm code">
      {lines.map((text, i) => {
        const n = i + 1;
        const active = n === activeLine;
        return (
          <div
            key={n}
            ref={active ? activeRef : undefined}
            className="flex"
            style={{ background: active ? "rgb(37 99 235 / 0.1)" : undefined, boxShadow: active ? "inset 3px 0 0 var(--color-accent)" : undefined }}
            aria-current={active ? "step" : undefined}
          >
            <span className="w-10 shrink-0 select-none pr-3 text-right text-slate-400">{n}</span>
            <pre className="m-0 whitespace-pre font-mono">{text || " "}</pre>
          </div>
        );
      })}
    </div>
  );
}
