import { ExternalLink } from "lucide-react";
import type { ProblemReference } from "@/core/algorithm/types";
import { Panel } from "@/components/ui/panel";

/** The full problem: task, examples and limits, written in AlgoWise's own words. */
export function ProblemStatementPanel({ problem, title }: { problem: ProblemReference; title: string }) {
  const { statement } = problem;
  return (
    <Panel
      title={`Problem · #${problem.number} ${title}`}
      aside={
        <a
          href={problem.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-accent hover:underline"
        >
          Official statement <ExternalLink size={12} aria-hidden="true" />
        </a>
      }
      className="mb-4"
      bodyClassName="grid gap-6 p-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
    >
      <div className="space-y-4">
        <div className="space-y-2 text-[15px] leading-relaxed text-ink">
          {statement.description.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Examples</h3>
          <div className="space-y-3">
            {statement.examples.map((ex, i) => (
              <div key={i} className="rounded-lg border border-line bg-bg p-3 text-sm">
                <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-muted">Example {i + 1}</p>
                <p>
                  <span className="text-muted">Input: </span>
                  <code className="font-mono">{ex.input}</code>
                </p>
                <p>
                  <span className="text-muted">Output: </span>
                  <code className="font-mono font-semibold">{ex.output}</code>
                </p>
                {ex.explanation && (
                  <p className="mt-1 text-muted">
                    <span className="font-medium text-ink">Explanation: </span>
                    {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <h3 className="mb-2 font-semibold">Constraints</h3>
          <ul className="list-inside list-disc space-y-1 font-mono text-[13px] text-muted">
            {statement.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        {statement.followUp && (
          <div>
            <h3 className="mb-1 font-semibold">Follow-up</h3>
            <p className="text-muted">{statement.followUp}</p>
          </div>
        )}
        <p className="border-t border-line pt-3 text-xs text-muted">
          Restated in our own words. The original wording belongs to LeetCode; open the official statement to submit a solution.
        </p>
      </div>
    </Panel>
  );
}
