import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { AlgorithmMeta } from "@/core/algorithm/types";
import { Badge, DifficultyBadge } from "@/components/ui/badge";

export function AlgorithmHeader({ meta }: { meta: AlgorithmMeta }) {
  return (
    <header className="mb-6">
      <nav aria-label="Breadcrumb" className="mb-3 text-[13px] text-muted">
        <Link href={meta.type === "concept" ? "/concepts" : "/problems"} className="hover:text-ink">
          {meta.type === "concept" ? "Concepts" : "LeetCode"}
        </Link>
        <span className="mx-1.5">/</span>
        <span>{meta.category}</span>
      </nav>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
        {meta.problem && (
          <a
            href={meta.problem.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 rounded-md border border-line-strong bg-surface px-2 py-0.5 font-mono text-xs text-muted hover:text-accent"
          >
            LeetCode #{meta.problem.number} <ExternalLink size={12} aria-hidden="true" />
          </a>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={meta.difficulty} />
        <Badge>{meta.category}</Badge>
        {meta.tags.slice(0, 3).map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{meta.problem?.summary ?? meta.description}</p>
    </header>
  );
}
