"use client";

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import type { Dispatch } from "react";
import type { PlaybackAction, PlaybackState } from "@/core/visualization/playback";
import { speeds } from "@/core/visualization/timing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function AlgorithmControls({ state, dispatch }: { state: PlaybackState; dispatch: Dispatch<PlaybackAction> }) {
  const last = state.total - 1;
  const atEnd = state.index >= last;
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3" role="group" aria-label="Playback controls">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => dispatch({ type: "prev" })} disabled={state.index === 0} aria-label="Previous step">
          <ChevronLeft size={16} aria-hidden="true" /> Previous
        </Button>
        <Button variant="primary" onClick={() => dispatch({ type: "toggle" })} className="min-w-[92px]" aria-label={state.playing ? "Pause" : atEnd ? "Replay" : "Play"}>
          {state.playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          {state.playing ? "Pause" : atEnd ? "Replay" : "Play"}
        </Button>
        <Button onClick={() => dispatch({ type: "next" })} disabled={atEnd} aria-label="Next step">
          Step <ChevronRight size={16} aria-hidden="true" />
        </Button>
        <Button variant="ghost" onClick={() => dispatch({ type: "reset" })} aria-label="Reset">
          <RotateCcw size={15} aria-hidden="true" /> Reset
        </Button>
      </div>

      <div className="flex min-w-[220px] flex-1 items-center gap-3">
        <span className="whitespace-nowrap font-mono text-sm tabular-nums" aria-live="polite">
          Step <strong>{state.index + 1}</strong> / {state.total}
        </span>
        <input
          type="range"
          min={0}
          max={Math.max(last, 0)}
          value={state.index}
          onChange={(e) => dispatch({ type: "goto", index: Number(e.target.value) })}
          className="h-1.5 flex-1 cursor-pointer accent-[var(--color-accent)]"
          aria-label="Scrub through steps"
          aria-valuetext={`Step ${state.index + 1} of ${state.total}`}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">Speed</span>
        <div className="inline-flex rounded-lg border border-line-strong bg-surface p-0.5" role="group" aria-label="Playback speed">
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={state.speed === s}
              onClick={() => dispatch({ type: "speed", speed: s })}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs capitalize transition-colors",
                state.speed === s ? "bg-ink text-white" : "text-muted hover:text-ink",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
