import type { Complexity } from "@/core/algorithm/types";
import { Panel } from "@/components/ui/panel";

export function ComplexityCard({ complexity }: { complexity: Complexity }) {
  return (
    <Panel title="Complexity" bodyClassName="p-4">
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-xs text-muted">Time</dt>
          <dd className="mt-0.5 font-mono text-xl font-semibold">{complexity.time}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Space</dt>
          <dd className="mt-0.5 font-mono text-xl font-semibold">{complexity.space}</dd>
        </div>
      </dl>
      <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-muted">{complexity.note}</p>
    </Panel>
  );
}
