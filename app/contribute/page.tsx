import type { Metadata } from "next";
import { Github } from "lucide-react";
import { ExternalButton, LinkButton } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { CONTRIBUTION_TYPES, FUTURE_OPPORTUNITIES } from "@/content/community";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contribute" };

const STEPS = [
  "Fork the repository and create a branch",
  "Run npm run create-algorithm (or copy algorithms/_template)",
  "Fill in metadata.ts and code.ts (Java and Python)",
  "Write the executor: one step per line that matters",
  "Describe the visual state in visualization.ts",
  "Check that every step's anchor highlights the right line in Java and Python",
  "Add tests for normal input and edge cases",
  "Run npm run lint, npm run test and npm run build",
  "Open a pull request",
];

const VALUE = [
  "Open-source experience",
  "A real GitHub contribution",
  "A portfolio project",
  "Deeper algorithm understanding",
  "Frontend and animation experience",
  "Testing experience",
  "Code review experience",
];

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-accent">Contribute</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Build the visual library with us.</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          {SITE.name} is community-powered. Add a new visualization, improve an explanation, fix a bug, or help make DSA easier to understand.
        </p>
        <p className="mt-4 border-l-2 border-accent pl-4 text-[15px] font-medium">You do not have to build the whole application to contribute.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ExternalButton href={SITE.repoUrl} variant="primary">
            <Github size={16} aria-hidden="true" /> Fork on GitHub
          </ExternalButton>
          <LinkButton href="/github">See open issues</LinkButton>
        </div>
      </header>

      <section className="mt-14">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Ways to help</h2>
        <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {CONTRIBUTION_TYPES.map((c) => (
            <a
              key={c.title}
              href={`${SITE.issuesUrl}?q=is%3Aissue+label%3A%22${encodeURIComponent(c.label)}%22`}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-surface p-5 transition-colors hover:bg-accent-soft"
            >
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted">{c.body}</p>
              <p className="mt-3 font-mono text-[11px] text-accent">{c.label}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Panel title="Your first visualization" bodyClassName="p-5">
          <ol className="space-y-2.5 text-sm">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="w-5 shrink-0 font-mono text-accent">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <pre className="mt-5 overflow-x-auto rounded-lg border border-line bg-slate-50 p-4 font-mono text-[13px] leading-6">
{`npm install
npm run create-algorithm
npm run dev      # open it in the browser
npm run lint && npm run test && npm run build`}
          </pre>
          <p className="mt-4 text-sm text-muted">
            Full walkthrough: <code className="font-mono text-ink">docs/ADDING-ALGORITHM.md</code>
          </p>
        </Panel>

        <div className="space-y-6">
          <Panel title="You provide" bodyClassName="p-5">
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Algorithm metadata</li>
              <li>The code to show</li>
              <li>The execution steps</li>
              <li>The visual state of each step</li>
              <li>Short explanations</li>
            </ul>
          </Panel>
          <Panel title="The framework provides" bodyClassName="p-5">
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Layout and controls</li>
              <li>Code editor and line highlight</li>
              <li>Playback, speed and step counter</li>
              <li>Design tokens and colour language</li>
              <li>My Learning progress and search</li>
            </ul>
          </Panel>
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        <Panel title="The rules that keep it consistent" bodyClassName="p-5">
          <ul className="list-inside list-disc space-y-1 text-sm text-muted">
            <li>Use the shared colour tones, never raw colours</li>
            <li>Use the shared primitives and the same step format</li>
            <li>No extra animation libraries or custom layouts</li>
            <li>TypeScript, lint, format and tests for every algorithm</li>
          </ul>
        </Panel>
        <Panel title="What you get" bodyClassName="p-5">
          <ul className="grid list-inside list-disc gap-1 text-sm text-muted sm:grid-cols-1">
            {VALUE.map((v) => <li key={v}>{v}</li>)}
          </ul>
        </Panel>
      </section>

      <section className="mt-14">
        <Panel title="Future contribution opportunities" bodyClassName="p-5">
          <p className="mb-3 text-sm text-muted">
            My Learning currently saves progress in your browser only. These ideas are not built yet. Open a discussion before you start on one.
          </p>
          <ul className="grid list-inside list-disc gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
            {FUTURE_OPPORTUNITIES.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </Panel>
      </section>
    </div>
  );
}
