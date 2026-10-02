"use client";

import { Minimize2 } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Dispatch } from "react";
import { createPortal } from "react-dom";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { LanguageSelect } from "@/components/editor/LanguageSelect";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ToneLegend } from "@/components/visualization/ToneLegend";
import { VisualizationCanvas } from "@/components/visualization/VisualizationCanvas";
import type { Implementations, LanguageId } from "@/core/algorithm/languages";
import type { AlgorithmStep } from "@/core/algorithm/types";
import type { PlaybackAction, PlaybackState } from "@/core/visualization/playback";
import { cn } from "@/lib/cn";
import { AlgorithmControls } from "./AlgorithmControls";
import { AlgorithmExplanation } from "./AlgorithmExplanation";

interface Props {
  title: string;
  inputSummary: string;
  step: AlgorithmStep;
  playback: PlaybackState;
  dispatch: Dispatch<PlaybackAction>;
  languages: Implementations;
  langId: LanguageId;
  onLanguage: (id: LanguageId) => void;
  code: { path: string; source: string; editorLanguage: string; activeLine: number };
  onExit: () => void;
}

const MAX_SCALE = 1.7;
const MIN_SCALE = 0.4;

/**
 * Makes the whole visualization fit the available space: no scrolling, nothing cut off.
 * It lays the content out at width / scale, measures its height, and picks the largest scale
 * (up to MAX_SCALE) at which everything is visible. Pure presentation: the content is untouched.
 */
function FitToSpace({ children, refitKey }: { children: React.ReactNode; refitKey: unknown }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const fit = useCallback(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    const W = box.clientWidth;
    const H = box.clientHeight;
    if (!W || !H) return; // hidden tab or not laid out yet

    inner.style.width = `${W}px`;
    let scale = Math.min(MAX_SCALE, H / Math.max(inner.offsetHeight, 1));
    for (let i = 0; i < 10; i++) {
      scale = Math.max(MIN_SCALE, scale);
      inner.style.width = `${W / scale}px`;
      const shown = inner.offsetHeight * scale;
      if (shown <= H || scale <= MIN_SCALE) break;
      scale *= Math.max(0.5, (H / shown) * 0.98);
    }
    const shownHeight = inner.offsetHeight * scale;
    inner.style.transform = `scale(${scale})`;
    inner.style.top = `${Math.max(0, (H - shownHeight) / 2)}px`;
  }, []);

  // Re-fit when the step changes (content may change height) and whenever the space changes size.
  useLayoutEffect(fit, [fit, refitKey]);
  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, [fit]);

  return (
    <div ref={boxRef} className="relative h-full overflow-hidden">
      <div ref={innerRef} className="absolute left-0 top-0 origin-top-left [&_[data-testid=visualization-canvas]]:min-h-0 [&_[data-testid=visualization-canvas]]:gap-2 [&_[data-testid=visualization-canvas]]:p-3 [&_[data-testid=visualization-canvas]>div:nth-child(2)]:gap-4">
        {children}
      </div>
    </div>
  );
}

/** Real browser fullscreen (hides tabs and address bar). Optional: Focus Mode still works if the browser refuses. */
function useBrowserFullscreen(onLeave: () => void) {
  useEffect(() => {
    const root = document.documentElement;
    let entered = false;
    const onChange = () => {
      if (document.fullscreenElement) entered = true;
      else if (entered) onLeave(); // the browser's own Esc / exit gesture
    };
    document.addEventListener("fullscreenchange", onChange);
    root.requestFullscreen?.().catch(() => {});
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      entered = false;
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [onLeave]);
}

/**
 * Distraction-free view of the SAME running visualization. All state (step, playing, speed, language)
 * lives in the parent, so entering or leaving this view never restarts anything.
 */
export function FocusMode({ title, inputSummary, step, playback, dispatch, languages, langId, onLanguage, code, onExit }: Props) {
  const exitRef = useRef<HTMLButtonElement>(null);
  useBrowserFullscreen(onExit);
  const [tab, setTab] = useState<"code" | "viz">("viz"); // only used below the lg breakpoint

  // Escape leaves Focus Mode; the page behind it does not scroll while it is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onExit();
      }
    };
    window.addEventListener("keydown", onKey, true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    exitRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prev;
    };
  }, [onExit]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-bg" role="dialog" aria-modal="true" aria-label={`${title} in Focus Mode`}>
      {/* Top bar: title on the left, exit on the right */}
      <div className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface px-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <h1 className="truncate text-sm font-semibold">{title}</h1>
          <span className="hidden truncate font-mono text-xs text-muted md:inline">{inputSummary}</span>
        </div>
        <Button ref={exitRef} size="sm" onClick={onExit} aria-label="Exit Focus Mode (Esc)">
          <Minimize2 size={14} aria-hidden="true" /> Exit Focus Mode
          <kbd className="hidden rounded border border-line-strong px-1 font-mono text-[10px] text-muted sm:inline">Esc</kbd>
        </Button>
      </div>

      {/* Below lg: switch between Code and Visualization instead of squeezing both */}
      <div className="flex shrink-0 gap-1 border-b border-line bg-surface px-3 py-1.5 lg:hidden" role="tablist" aria-label="Focus Mode view">
        {(["viz", "code"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("rounded-md px-3 py-1 text-sm", tab === t ? "bg-slate-100 font-medium text-ink" : "text-muted")}
          >
            {t === "viz" ? "Visualization" : "Code"}
          </button>
        ))}
      </div>

      {/* Code ~40%, visualization ~60% */}
      <div className="grid min-h-0 flex-1 gap-3 p-2.5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Panel
          title="Code"
          aside={
            <div className="flex items-center gap-3">
              <span className="font-mono">line {code.activeLine}</span>
              <LanguageSelect implementations={languages} value={langId} onChange={onLanguage} />
            </div>
          }
          className={cn("min-h-0", tab === "code" ? "flex" : "hidden", "lg:flex")}
          bodyClassName="relative min-h-0"
        >
          <div className="absolute inset-0">
            <CodeEditor path={code.path} source={code.source} language={code.editorLanguage} activeLine={code.activeLine} />
          </div>
        </Panel>

        <Panel
          title="Visualization"
          aside={
            <div className="hidden xl:block">
              <ToneLegend />
            </div>
          }
          className={cn("min-h-0", tab === "viz" ? "flex" : "hidden", "lg:flex")}
          bodyClassName="flex min-h-0 flex-col"
        >
          <div className="min-h-0 flex-1">
            <FitToSpace refitKey={step.id}>
              <VisualizationCanvas state={step.state} />
            </FitToSpace>
          </div>
          <div className="shrink-0 border-t border-line px-4 py-2 xl:hidden">
            <ToneLegend />
          </div>
        </Panel>
      </div>

      {/* Fixed control area */}
      <div className="shrink-0 border-t border-line bg-surface px-4 py-2.5">
        <AlgorithmControls state={playback} dispatch={dispatch} />
        <div className="mt-2 border-t border-line pt-2">
          <AlgorithmExplanation step={step} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
