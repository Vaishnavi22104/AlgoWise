"use client";

import { ArrowRight, GitPullRequest, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAlgorithm, getByKey, hrefFor } from "@/content";
import { languageMeta, lineFor, pickImplementation } from "@/core/algorithm/languages";
import type { AlgorithmType } from "@/core/algorithm/types";
import { usePlayback } from "@/core/visualization/usePlayback";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { LanguageSelect } from "@/components/editor/LanguageSelect";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { Button, ExternalButton, LinkButton } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { VisualizationCanvas } from "@/components/visualization/VisualizationCanvas";
import { ToneLegend } from "@/components/visualization/ToneLegend";
import { setLanguage, usePreferredLanguage } from "@/lib/language";
import { SITE } from "@/lib/site";
import { AlgorithmControls } from "./AlgorithmControls";
import { AlgorithmExplanation } from "./AlgorithmExplanation";
import { AlgorithmHeader } from "./AlgorithmHeader";
import { ComplexityCard } from "./ComplexityCard";
import { ProblemStatementPanel } from "./ProblemStatementPanel";
import { ErrorBoundary } from "./ErrorBoundary";
import { FocusMode } from "./FocusMode";

function Workbench({ type, slug }: { type: AlgorithmType; slug: string }) {
  const def = getAlgorithm(type, slug);
  if (!def) throw new Error(`Unknown algorithm ${type}:${slug}`);

  const steps = useMemo(() => def.run(), [def]);
  const { state, dispatch } = usePlayback(steps.length);
  const step = steps[Math.min(state.index, steps.length - 1)];

  // The trace is shared. Only the code text and the line the step maps to depend on the language.
  const preferred = usePreferredLanguage();
  const { id: langId, impl } = pickImplementation(def.languages, preferred);
  const activeLine = lineFor(impl, step.anchor);

  // Focus Mode is only a different view of this same Workbench: playback, step and language stay where they are.
  const [focus, setFocus] = useState(false);
  const focusButton = useRef<HTMLButtonElement>(null);
  const exitFocus = useCallback(() => {
    setFocus(false);
    requestAnimationFrame(() => focusButton.current?.focus());
  }, []);

  // Keyboard: arrows step, space plays/pauses, R resets, F toggles Focus Mode.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName ?? "";
      if (/input|textarea|select/i.test(tag) || el?.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") dispatch({ type: "next" });
      else if (e.key === "ArrowLeft") dispatch({ type: "prev" });
      else if (e.key === " " && tag !== "BUTTON") {
        e.preventDefault();
        dispatch({ type: "toggle" });
      } else if (e.key.toLowerCase() === "r") dispatch({ type: "reset" });
      else if (e.key.toLowerCase() === "f") setFocus((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  const related = (def.related ?? []).map(getByKey).filter((r): r is NonNullable<typeof r> => !!r);
  const next = related[0];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6">
      <AlgorithmHeader meta={def} />

      {def.problem && <ProblemStatementPanel problem={def.problem} title={def.title} />}

      <div className="mb-3 flex justify-end">
        <Button ref={focusButton} size="sm" onClick={() => setFocus(true)} aria-label="Focus Mode (F)" title="Full-screen code and visualization (F)">
          <Maximize2 size={14} aria-hidden="true" /> Focus Mode
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <Panel
          title="Code"
          aside={
            <div className="flex items-center gap-3">
              <span className="font-mono">line {activeLine}</span>
              <LanguageSelect implementations={def.languages} value={langId} onChange={setLanguage} />
            </div>
          }
          className="min-h-[420px]"
          bodyClassName="min-h-0"
        >
          {!focus && (
            <CodeEditor path={`${def.type}-${def.slug}-${langId}`} source={impl.source} language={languageMeta(langId).editor} activeLine={activeLine} />
          )}
        </Panel>

        <Panel
          title="Visualization"
          aside={<span className="block truncate font-mono">{def.inputSummary}</span>}
          bodyClassName="flex flex-col"
        >
          <div className="flex-1">
            <VisualizationCanvas state={step.state} />
          </div>
          <div className="border-t border-line px-4 py-2.5">
            <ToneLegend />
          </div>
        </Panel>
      </div>

      {focus && (
        <FocusMode
          title={def.title}
          inputSummary={def.inputSummary}
          step={step}
          playback={state}
          dispatch={dispatch}
          languages={def.languages}
          langId={langId}
          onLanguage={setLanguage}
          code={{ path: `${def.type}-${def.slug}-${langId}`, source: impl.source, editorLanguage: languageMeta(langId).editor, activeLine }}
          onExit={exitFocus}
        />
      )}

      <div className="sticky bottom-0 z-20 -mx-4 mt-4 border-t border-line bg-surface px-4 py-3 shadow-[0_-4px_12px_rgb(15_23_42/0.04)] sm:mx-0 sm:rounded-xl sm:border sm:shadow-card">
        <AlgorithmControls state={state} dispatch={dispatch} />
        <div className="mt-3 border-t border-line pt-3">
          <AlgorithmExplanation step={step} />
        </div>
        <p className="mt-2 hidden text-[11px] text-muted md:block">
          Keyboard: <kbd className="font-mono">←</kbd> <kbd className="font-mono">→</kbd> step · <kbd className="font-mono">Space</kbd> play/pause ·{" "}
          <kbd className="font-mono">R</kbd> reset · <kbd className="font-mono">F</kbd> focus mode
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Panel title="How it works" bodyClassName="space-y-3 p-5">
            {def.howItWorks.map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-ink">{p}</p>
            ))}
          </Panel>
          {def.problem && (
            <div className="rounded-xl border border-line bg-surface p-5 text-sm leading-relaxed text-muted shadow-card">
              <p className="font-medium text-ink">Original content vs. third-party problem</p>
              <p className="mt-1">
                The problem itself is LeetCode #{def.problem.number}. We restate it above in our own words; the official statement is on{" "}
                <a className="text-accent underline-offset-2 hover:underline" href={def.problem.url} target="_blank" rel="noreferrer noopener">
                  leetcode.com
                </a>
                . The code, step-by-step explanations, example input and animation on this page are original AlgoWise content.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ComplexityCard complexity={def.complexity} />
          {related.length > 0 && (
            <Panel title="Related" bodyClassName="divide-y divide-line">
              {related.map((r) => (
                <Link key={`${r.type}:${r.slug}`} href={hrefFor(r)} className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-slate-50">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{r.title}</span>
                    <span className="block text-xs text-muted">{r.type === "concept" ? "Concept" : "Problem"} · {r.category}</span>
                  </span>
                  <DifficultyBadge difficulty={r.difficulty} />
                </Link>
              ))}
            </Panel>
          )}
          <Panel bodyClassName="p-4">
            <p className="text-sm font-medium">Improve this visualization</p>
            <p className="mt-1 text-sm text-muted">Spot a confusing step or a better way to show it? Every visualization lives in one small folder.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <ExternalButton size="sm" href={`${SITE.repoUrl}/tree/main/${def.type === "concept" ? "algorithms" : "problems"}`}>
                <GitPullRequest size={14} aria-hidden="true" /> GitHub
              </ExternalButton>
              <LinkButton size="sm" href="/contribute" variant="ghost">Contribute</LinkButton>
            </div>
          </Panel>
        </div>
      </div>

      {next && (
        <div className="mt-8 flex items-center justify-between rounded-xl border border-line bg-accent-soft px-5 py-4">
          <div className="flex items-center gap-3">
            <Badge tone="active">Next</Badge>
            <span className="text-sm">Try <strong>{next.title}</strong></span>
          </div>
          <LinkButton href={hrefFor(next)} variant="primary" size="sm">
            Open <ArrowRight size={14} aria-hidden="true" />
          </LinkButton>
        </div>
      )}
    </div>
  );
}

export function AlgorithmView({ type, slug }: { type: AlgorithmType; slug: string }) {
  const [attempt, setAttempt] = useState(0);
  return (
    <ErrorBoundary key={attempt} onRetry={() => setAttempt((a) => a + 1)}>
      <Workbench type={type} slug={slug} />
    </ErrorBoundary>
  );
}
