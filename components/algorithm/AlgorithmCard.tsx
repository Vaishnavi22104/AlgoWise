import { Check } from "lucide-react";
import Link from "next/link";
import { hrefFor, type CatalogMeta } from "@/core/algorithm/registry";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export function AlgorithmCard({ item, thumbnail, completed }: { item: CatalogMeta; thumbnail?: React.ReactNode; completed?: boolean }) {
  const href = hrefFor(item);
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-shadow hover:shadow-pop">
      {thumbnail}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge>{item.category}</Badge>
            <span className="font-mono text-[11px] text-muted">{item.type === "concept" ? "concept" : "problem"}</span>
          </div>
          <DifficultyBadge difficulty={item.difficulty} />
        </div>
        <h3 className="mt-3 flex items-center gap-2 text-[17px] font-semibold tracking-tight">
          <Link href={href} className="hover:text-accent">{item.title}</Link>
          {completed && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success text-white" title="Completed" aria-label="Completed">
              <Check size={12} strokeWidth={3} aria-hidden="true" />
            </span>
          )}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</p>
        <div className="mt-auto pt-4">
          <LinkButton href={href} variant="secondary" size="sm">Visualize</LinkButton>
        </div>
      </div>
    </article>
  );
}
