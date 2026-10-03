import type { Metadata } from "next";
import { ArrowUpRight, Check, ChevronRight, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { ISSUES, LABELS, LEVELS, PULL_REQUESTS, type PrStatus } from "@/content/community";
import type { Tone } from "@/core/visualization/types";
import { toneColors } from "@/core/visualization/tokens";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Issues and pull requests" };

const WORKFLOW = ["Issue", "Branch", "Pull request", "Review", "Merge"];

/** Subtle status: a small dot plus a text label, so meaning never depends on colour alone. */
const PR_STATUS: Record<PrStatus, { label: string; dot: string }> = {
  merged: { label: "Merged", dot: "var(--viz-pointer-solid)" },
  open: { label: "Open · in progress", dot: "var(--viz-success-solid)" },
  "changes-requested": { label: "Changes requested", dot: "var(--viz-warning-solid)" },
};

const labelTone = (name: string): Tone => (LABELS.find((l) => l.name === name)?.color ?? "neutral") as Tone;

function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="font-mono text-xs uppercase tracking-wider text-muted">{children}</h2>
      {aside && <p className="text-xs text-muted">{aside}</p>}
    </div>
  );
}

function StatusPill({ status }: { status: PrStatus }) {
  const s = PR_STATUS[status];
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-ink">
      <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

export default function GithubPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageHeader eyebrow="Open source" title="Contribute to AlgoWise">
        Pick an issue. Build something. Open a PR.
      </PageHeader>

      <div className="-mt-3 mb-10 space-y-6">
        <ol aria-label="How a contribution moves" className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm">
          {WORKFLOW.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span className="rounded-md border border-line bg-surface px-2.5 py-1 font-medium text-ink">{step}</span>
              {i < WORKFLOW.length - 1 && <ChevronRight size={14} aria-hidden="true" className="text-muted" />}
            </li>
          ))}
        </ol>
        <a
          href={SITE.repoUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-strong hover:underline"
        >
          Contribute on GitHub <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
        <section aria-labelledby="issues-title">
          <SectionTitle aside="Examples">
            <span id="issues-title">Things to work on</span>
          </SectionTitle>
          <ul className="divide-y divide-line border-y border-line">
            {ISSUES.map((i) => (
              <li key={i.n} className="flex gap-3 py-3.5">
                <span className="w-10 shrink-0 pt-0.5 font-mono text-xs text-muted">#{i.n}</span>
                <div className="min-w-0">
                  <p className={i.closed ? "text-[15px] font-medium leading-snug text-muted" : "text-[15px] font-medium leading-snug text-ink"}>
                    {i.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
                    {i.labels.map((l) => (
                      <span key={l} style={{ color: toneColors(labelTone(l)).text }} className="font-medium">
                        {l}
                      </span>
                    ))}
                    <span aria-hidden="true">·</span>
                    <span>{i.level}</span>
                    {i.closed && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Check size={12} aria-hidden="true" /> Done
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-12">
          <section aria-labelledby="prs-title">
            <SectionTitle aside="Examples">
              <span id="prs-title">Pull requests</span>
            </SectionTitle>
            <ul className="divide-y divide-line border-y border-line">
              {PULL_REQUESTS.map((p) => (
                <li key={p.n} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                    <p className="min-w-0 text-[15px] font-medium leading-snug text-ink">
                      <span className="mr-2 font-mono text-xs font-normal text-muted">#{p.n}</span>
                      {p.title}
                    </p>
                    <StatusPill status={p.status} />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
                  {p.includes && <p className="mt-2 text-xs text-muted">Includes {p.includes.join(", ")}</p>}
                  {p.checklist && (
                    <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-xs min-[420px]:grid-cols-2">
                      {p.checklist.map((c) => (
                        <li key={c.label} className={c.done ? "flex items-center gap-1.5 text-ink" : "flex items-center gap-1.5 text-muted"}>
                          {c.done ? <Check size={13} aria-hidden="true" className="text-success" /> : <Circle size={11} aria-hidden="true" />}
                          <span>
                            {c.label}
                            <span className="sr-only">{c.done ? ": done" : ": not done yet"}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.review && (
                    <blockquote className="mt-3 border-l-2 border-line-strong pl-3 text-sm leading-relaxed text-muted">
                      <span className="mb-0.5 block text-xs font-medium text-ink">Reviewer note</span>
                      {p.review}
                    </blockquote>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="levels-title">
            <SectionTitle>
              <span id="levels-title">Pick your level</span>
            </SectionTitle>
            <dl className="divide-y divide-line border-y border-line">
              {LEVELS.map((l) => (
                <div key={l.level} className="py-3">
                  <dt className="text-sm font-semibold text-ink">{l.level}</dt>
                  <dd className="mt-0.5 text-sm text-muted">{l.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <section aria-labelledby="labels-title" className="mt-12">
        <SectionTitle>
          <span id="labels-title">Labels</span>
        </SectionTitle>
        <ul className="flex flex-wrap gap-2">
          {LABELS.map((l) => (
            <li key={l.name}>
              <Badge>{l.name}</Badge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
