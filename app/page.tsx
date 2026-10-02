import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { allAlgorithms, getAlgorithm, hrefFor, toCatalogMeta } from "@/content";
import { AlgorithmCard } from "@/components/algorithm/AlgorithmCard";
import { AlgorithmThumbnail } from "@/components/algorithm/AlgorithmThumbnail";
import { LivePreview } from "@/components/algorithm/LivePreview";
import { ExternalButton, LinkButton } from "@/components/ui/button";
import { SITE } from "@/lib/site";

const PIPELINE = [
  ["Algorithm", "metadata + code"],
  ["Executor", "trusted trace"],
  ["Step state", "line + state + text"],
  ["Renderer", "shared primitives"],
  ["Controls", "play, step, scrub"],
];

const WHY = [
  ["Synchronized by construction", "The code line, the picture and the explanation all come from the same step object, so they can never drift apart."],
  ["One animation language", "Blue is active, orange is compared, green is correct, red is rejected, purple is a pointer. The same in every algorithm."],
  ["Contributor-first", "Add a folder, fill in five small files, open a PR. Contributors never touch layout, controls or the editor."],
  ["Light enough for any laptop", "Plain SVG and DOM with CSS transitions. No canvas loops, no 3D, and motion respects your system settings."],
];

export default function Home() {
  const featured = ["binary-search:problem", "reverse-linked-list:problem", "two-sum:problem", "valid-parentheses:problem"]
    .map((k) => {
      const [slug, type] = k.split(":");
      return getAlgorithm(type as "problem", slug);
    })
    .filter((d): d is NonNullable<typeof d> => !!d);

  return (
    <>
      <section className="dot-grid border-b border-line">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20">
          <p className="mb-5 font-mono text-xs uppercase tracking-wider text-accent">Open source · Data structures and algorithms</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl">
            Understand the algorithm.
            <br />
            <span className="text-accent">See the logic.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Interactive DSA visualizations synchronized with the code, line by line.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/concepts" variant="primary" className="h-11 px-5">
              Explore Concepts <ArrowRight size={16} aria-hidden="true" />
            </LinkButton>
            <ExternalButton href={SITE.repoUrl} className="h-11 px-5">
              <Github size={16} aria-hidden="true" /> Contribute on GitHub
            </ExternalButton>
          </div>
          <div className="mt-12">
            <LivePreview />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted">How it works</h2>
        <p className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight">Code on the left. State on the right. Every step explained at the bottom.</p>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
          {[
            ["01", "Read the code", "The line that is executing is highlighted in a real editor, so you always know where you are."],
            ["02", "Watch the data change", "Arrays, stacks, pointers and linked lists update to match that exact line. Nothing is decorative."],
            ["03", "Step at your own pace", "Move one step at a time, scrub the timeline, or press play. Every step says what happened and why."],
          ].map(([n, title, body]) => (
            <div key={n} className="bg-surface p-6">
              <p className="font-mono text-sm text-accent">{n}</p>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
        <ol className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs" aria-label="Architecture pipeline">
          {PIPELINE.map(([name, sub], i) => (
            <li key={name} className="flex items-center gap-2">
              <span className="rounded-lg border border-line-strong bg-surface px-3 py-2">
                <span className="block font-semibold text-ink">{name}</span>
                <span className="block text-[11px] text-muted">{sub}</span>
              </span>
              {i < PIPELINE.length - 1 && <ArrowRight size={14} className="text-muted" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Featured visualizations</h2>
              <p className="mt-3 text-2xl font-semibold tracking-tight">Start with a classic.</p>
            </div>
            <Link href="/concepts" className="hidden text-sm text-accent hover:underline sm:block">
              View all {allAlgorithms.length} →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {featured.map((def) => (
              <AlgorithmCard key={hrefFor(def)} item={toCatalogMeta(def)} thumbnail={<AlgorithmThumbnail def={def} />} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Why AlgoWise</h2>
        <p className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight">
          A community-powered framework, not another gallery of animations.
        </p>
        <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {WHY.map(([t, d]) => (
            <div key={t} className="border-t border-line-strong pt-4">
              <dt className="font-semibold">{t}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 rounded-2xl border border-line bg-surface p-8 shadow-card md:grid-cols-2 md:p-10">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Open source</h2>
            <p className="mt-3 text-2xl font-semibold tracking-tight">You do not have to build the whole app to contribute.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Add one algorithm, improve one animation, fix one bug or write one explanation. The framework supplies the layout, controls,
              editor, colours and timing.
            </p>
            <ol className="mt-5 space-y-2 text-sm">
              {["Copy algorithms/_template", "Fill metadata, code and executor", "Describe the state for each step", "Run the tests, open a PR"].map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="font-mono text-accent">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <LinkButton href="/contribute" variant="primary" className="mt-6">Read the contributor guide</LinkButton>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-line bg-slate-50 p-5 font-mono text-[13px] leading-6 text-ink" aria-label="Algorithm folder layout">
{`algorithms/
  binary-search/
    metadata.ts      title, category, complexity
    code.ts          the code shown on the left
    executor.ts      produces the steps
    visualization.ts builds the state per step
    executor.test.ts tests
    index.ts         wires it together

$ npm run create-algorithm`}
          </pre>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="rounded-2xl bg-ink px-8 py-12 text-center text-white md:px-12">
          <p className="text-2xl font-semibold tracking-tight sm:text-3xl">Pick an algorithm. Build its visualization. Open a PR.</p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
            The goal is not to build every visualization ourselves. It is to build the framework that lets the community build them together.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ExternalButton href={SITE.repoUrl} className="border-0 bg-white text-ink hover:bg-slate-100">
              <Github size={16} aria-hidden="true" /> Star on GitHub
            </ExternalButton>
            <LinkButton href="/github" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              Good first issues
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
