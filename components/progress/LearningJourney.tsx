"use client";

import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/cn";
import { resetProgress, setCheckpoint, setProblemCompleted, useProgress } from "@/lib/progress";
import { computeLearning, XP, type ConceptProgress, type LearningConcept } from "@/lib/progress-stats";

function Bar({ pct, label }: { pct: number; label: string }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

function Tick({
  checked,
  onChange,
  children,
  hint,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
        checked ? "border-[var(--viz-success-border)] bg-[var(--viz-success-bg)]" : "border-line bg-surface hover:bg-slate-50",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 shrink-0 cursor-pointer accent-[var(--color-success)]"
      />
      <span className={cn("min-w-0 flex-1", checked && "text-[var(--viz-success-text)]")}>{children}</span>
      {hint && <span className="shrink-0 font-mono text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

function ConceptCard({ c }: { c: ConceptProgress }) {
  return (
    <Panel
      title={c.title}
      aside={
        <span className="font-mono">
          {c.done}/{c.total} checkpoints
        </span>
      }
      bodyClassName="grid gap-6 p-5 md:grid-cols-2"
    >
      <div>
        <h3 className="mb-2 text-sm font-medium">Checkpoints</h3>
        <div className="space-y-2">
          {c.checkpoints.map((cp) => (
            <Tick
              key={cp.id}
              checked={cp.done}
              onChange={(next) => setCheckpoint(c.slug, cp.id, next)}
              hint={XP[cp.id] ? `+${XP[cp.id]} XP` : undefined}
            >
              {cp.label}
            </Tick>
          ))}
        </div>
        <Link href={`/visualize/${c.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline">
          Open the {c.title} visualization <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Recommended Practice</h3>
        <div className="space-y-2">
          {c.problemStatus.map((p) => (
            <Tick key={p.slug} checked={p.done} onChange={(next) => setProblemCompleted(p.slug, next)} hint={`+${XP.problem} XP`}>
              <span className="font-mono text-xs text-muted">#{p.number}</span> {p.title}
              <span className="sr-only">{p.done ? " completed" : " not completed"}</span>
            </Tick>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {c.problemStatus.map((p) => (
            <Link key={p.slug} href={`/problems/${p.slug}`} className="inline-flex items-center gap-1 text-accent hover:underline">
              Walkthrough: {p.title} <ArrowRight size={12} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export function LearningJourney({ path }: { path: LearningConcept[] }) {
  const data = useProgress();
  const summary = useMemo(() => computeLearning(data, path), [data, path]);
  const { focus } = summary;
  const [confirmReset, setConfirmReset] = useState(false);
  const started = summary.checkpointsDone > 0 || summary.problemsDone > 0;

  return (
    <div className="space-y-6">
      {/* Headline */}
      <section className="rounded-xl border border-line bg-surface p-6 shadow-card" aria-labelledby="your-progress">
        <h2 id="your-progress" className="sr-only">
          Your Learning Progress
        </h2>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm text-muted">Your XP</p>
            <p className="font-mono text-5xl font-semibold tabular-nums" data-testid="xp">
              {summary.xp} <span className="text-2xl text-muted">XP</span>
            </p>
          </div>
          <div className="min-w-[220px] flex-1 sm:max-w-md">
            <p className="mb-2 text-sm">
              <span className="font-semibold tabular-nums">
                {summary.checkpointsDone} / {summary.checkpointsTotal}
              </span>{" "}
              checkpoints completed
              <span className="text-muted"> · {summary.problemsDone} / {summary.problemsTotal} practice problems</span>
            </p>
            <Bar pct={summary.overallPct} label="Overall checkpoints completed" />
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">
          You tick each step yourself, so this is self-reported progress. XP records learning activity, not DSA mastery.
        </p>
      </section>

      {/* Current focus */}
      <section className="rounded-xl border border-accent/30 bg-accent-soft p-6" aria-labelledby="current-focus">
        <p id="current-focus" className="font-mono text-[11px] font-medium uppercase tracking-wider text-accent">
          Current Focus
        </p>
        {focus ? (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xl font-semibold">{focus.title}</p>
              <p className="text-sm text-muted">
                {focus.done} / {focus.total} checkpoints completed
                {!started && " · a good place to begin"}
              </p>
            </div>
            <LinkButton href={`/visualize/${focus.slug}`} variant="primary">
              Continue Learning <ArrowRight size={16} aria-hidden="true" />
            </LinkButton>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-3">
            <Sparkles size={20} className="text-accent" aria-hidden="true" />
            <div>
              <p className="text-lg font-semibold">Every checkpoint is marked complete</p>
              <p className="text-sm text-muted">Revisit a visualization any time, or help add the next one on the Contribute page.</p>
            </div>
          </div>
        )}
      </section>

      {/* Concept progress */}
      <Panel title="Concept Progress" bodyClassName="space-y-4 p-5">
        {summary.concepts.map((c) => (
          <div key={c.slug}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="flex items-center gap-1.5">
                {c.title}
                {c.pct === 100 && <Check size={14} className="text-success" aria-label="All checkpoints complete" />}
              </span>
              <span className="font-mono text-xs text-muted tabular-nums">{c.pct}%</span>
            </div>
            <Bar pct={c.pct} label={`${c.title} checkpoints completed`} />
          </div>
        ))}
      </Panel>

      {/* Checkpoints + recommended practice */}
      <div className="space-y-6">
        {summary.concepts.map((c) => (
          <ConceptCard key={c.slug} c={c} />
        ))}
      </div>

      {/* Storage note */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-line-strong p-4 text-sm text-muted">
        <div>
          <p>Your progress is saved on this browser.</p>
          <p>Account sync will be available in a future version.</p>
        </div>
        {confirmReset ? (
          <span className="flex items-center gap-2">
            <span className="text-ink">Clear all progress on this browser?</span>
            <Button
              size="sm"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
            >
              Yes, clear it
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          </span>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => setConfirmReset(true)} disabled={!started}>
            Reset progress
          </Button>
        )}
      </div>
    </div>
  );
}
