import type { Metadata } from "next";
import { Panel } from "@/components/ui/panel";
import { PageHeader } from "@/components/ui/page-header";
import { ToneLegend } from "@/components/visualization/ToneLegend";
import { ROADMAP } from "@/content/community";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "About" };

const PRINCIPLES = [
  ["Visual first", "Every algorithm communicates its logic visually."],
  ["Code and animation are synchronized", "The picture is the current execution state, never a separate movie."],
  ["Step by step", "Pause, go back, scrub: understanding comes from controlling the pace."],
  ["Consistency", "The same animation language in every algorithm."],
  ["Contributors should not reinvent the UI", "They supply knowledge; the framework supplies everything else."],
  ["Lightweight", "SVG and DOM only. Runs smoothly on a normal student laptop."],
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <PageHeader eyebrow="About" title="A community-powered visualization framework">
        Code execution, algorithm state and animation are synchronized through one standardized, open-source architecture. Contributors add one
        visualization at a time and the library grows together.
      </PageHeader>

      <section className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
        {PRINCIPLES.map(([t, d]) => (
          <div key={t} className="bg-surface p-5">
            <h2 className="font-semibold">{t}</h2>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <Panel title="One colour language" bodyClassName="space-y-3 p-5">
          <ToneLegend />
          <p className="text-sm text-muted">
            These meanings never change between algorithms. If blue means “currently active” in Binary Search, it means the same in Linked List.
            Contributors choose a tone, not a colour.
          </p>
        </Panel>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Roadmap</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {ROADMAP.map((p) => (
            <Panel key={p.phase} title={`${p.phase} · ${p.name}`} aside={<Badge tone={p.status === "Shipped" ? "success" : p.status === "In progress" ? "active" : undefined}>{p.status}</Badge>} bodyClassName="p-5">
              <ul className="list-inside list-disc space-y-1 text-sm">
                {p.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </Panel>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <Panel title="Original content" bodyClassName="p-5 text-sm leading-relaxed text-muted">
          Explanations, code, example inputs and animations are written for AlgoWise and released under the MIT license.
        </Panel>
        <Panel title="Third-party problems" bodyClassName="p-5 text-sm leading-relaxed text-muted">
          Problem pages restate each problem (task, examples, constraints) in our own words and link to the official statement. We never copy the
          original text. Trademarks belong to their owners.
        </Panel>
      </section>

      <section className="mt-10">
        <Panel title="Security" bodyClassName="p-5 text-sm leading-relaxed text-muted">
          Version 1 never runs user-written code. Every trace comes from a trusted, reviewed executor function. Future editable code will run in an
          isolated worker with time and memory limits.
        </Panel>
      </section>
    </div>
  );
}
