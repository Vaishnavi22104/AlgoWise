import type { Metadata } from "next";
import { CircleDot, CircleCheck, GitMerge, GitPullRequest, GitPullRequestClosed, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tone } from "@/core/visualization/types";
import { ExternalButton } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { ISSUES, LABELS, LEVELS, PULL_REQUESTS, type PrStatus } from "@/content/community";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "GitHub" };

const PR_META: Record<PrStatus, { label: string; tone: "pointer" | "success" | "warning"; Icon: typeof GitMerge }> = {
  merged: { label: "Merged", tone: "pointer", Icon: GitMerge },
  open: { label: "Open · in progress", tone: "success", Icon: GitPullRequest },
  "changes-requested": { label: "Changes requested", tone: "warning", Icon: GitPullRequestClosed },
};

const labelTone = (name: string): Tone => (LABELS.find((l) => l.name === name)?.color ?? "neutral") as Tone;

export default function GithubPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageHeader eyebrow="GitHub" title="How contributions flow">
        Illustrative issues and pull requests that show the workflow. They are examples, not real repository history; the live list is on GitHub.
      </PageHeader>
      <div className="-mt-4 mb-10">
        <ExternalButton href={SITE.repoUrl} variant="primary">
          <Github size={16} aria-hidden="true" /> Open the repository
        </ExternalButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Good first issues and more" bodyClassName="divide-y divide-line">
          {ISSUES.map((i) => (
            <div key={i.n} className="flex items-start gap-3 px-4 py-3">
              {i.closed ? (
                <CircleCheck size={16} className="mt-0.5 shrink-0 text-pointer" aria-label="Closed" />
              ) : (
                <CircleDot size={16} className="mt-0.5 shrink-0 text-success" aria-label="Open" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  <span className="mr-1.5 font-mono text-muted">#{i.n}</span>
                  {i.title}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {i.labels.map((l) => <Badge key={l} tone={labelTone(l)}>{l}</Badge>)}
                  <Badge>{i.level}</Badge>
                </div>
              </div>
            </div>
          ))}
        </Panel>

        <div className="space-y-6">
          <Panel title="Pull requests" bodyClassName="divide-y divide-line">
            {PULL_REQUESTS.map((p) => {
              const m = PR_META[p.status];
              return (
                <div key={p.n} className="px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">
                      <span className="mr-1.5 font-mono text-muted">#{p.n}</span>
                      {p.title}
                    </p>
                    <Badge tone={m.tone} className="shrink-0 gap-1"><m.Icon size={12} aria-hidden="true" />{m.label}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">{p.body}</p>
                  {p.includes && <p className="mt-1.5 text-xs text-muted">Includes: {p.includes.join(", ")}</p>}
                  {p.checklist && (
                    <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono text-xs">
                      {p.checklist.map((c) => (
                        <li key={c.label} className={c.done ? "" : "text-muted"}>[{c.done ? "x" : " "}] {c.label}</li>
                      ))}
                    </ul>
                  )}
                  {p.review && <blockquote className="mt-2 border-l-2 border-warning pl-3 text-sm text-muted">{p.review}</blockquote>}
                </div>
              );
            })}
          </Panel>

          <Panel title="Pick your level" bodyClassName="divide-y divide-line">
            {LEVELS.map((l) => (
              <div key={l.level} className="px-4 py-3">
                <p className="text-sm font-semibold">{l.level}</p>
                <p className="mt-0.5 text-sm text-muted">{l.items.join(" · ")}</p>
              </div>
            ))}
          </Panel>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Labels</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {LABELS.map((l) => <Badge key={l.name} tone={l.color as Tone}>{l.name}</Badge>)}
        </div>
      </section>
    </div>
  );
}
