"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { searchAlgorithms, type CatalogMeta } from "@/core/algorithm/registry";
import { CATEGORIES, DIFFICULTIES, type Category, type Difficulty } from "@/core/algorithm/types";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import { useProgress } from "@/lib/progress";
import { isItemDone } from "@/lib/progress-stats";
import { AlgorithmCard } from "./AlgorithmCard";

export type CatalogItem = CatalogMeta & { thumbnail?: React.ReactNode };

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1 text-[13px] transition-colors",
        active ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-20 shrink-0 font-mono text-[11px] uppercase tracking-wider text-muted">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function CatalogBrowser({ items, fixedType }: { items: CatalogItem[]; fixedType?: "concept" | "problem" }) {
  const progress = useProgress();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [type, setType] = useState<"All" | "concept" | "problem">(fixedType ?? "All");
  const [status, setStatus] = useState<"All" | "done" | "todo">("All");

  const pool = fixedType ? items.filter((i) => i.type === fixedType) : items;

  const results = useMemo(
    () =>
      searchAlgorithms(q, pool).filter(
        (i) =>
          (category === "All" || i.category === category) &&
          (difficulty === "All" || i.difficulty === difficulty) &&
          (type === "All" || i.type === type) &&
          (status === "All" || (status === "done") === isItemDone(progress, i)),
      ),
    [q, pool, category, difficulty, type, status, progress],
  );

  const countIn = (c: Category) => pool.filter((i) => i.category === c).length;

  return (
    <div>
      <div className="space-y-3 rounded-xl border border-line bg-surface p-4 shadow-card">
        <label className="relative block">
          <span className="sr-only">Filter algorithms</span>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by name, category, difficulty or tag, e.g. “linked list”"
            className="h-10 w-full rounded-lg border border-line-strong bg-bg pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
        </label>
        <Group label="Category">
          <Chip active={category === "All"} onClick={() => setCategory("All")}>All</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c} <span className="ml-0.5 font-mono text-[11px] opacity-60">{countIn(c)}</span>
            </Chip>
          ))}
        </Group>
        <Group label="Difficulty">
          {(["All", ...DIFFICULTIES] as const).map((d) => (
            <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>{d}</Chip>
          ))}
        </Group>
        {!fixedType && (
          <Group label="Type">
            {(["All", "concept", "problem"] as const).map((t) => (
              <Chip key={t} active={type === t} onClick={() => setType(t)}>{t === "All" ? "All" : t === "concept" ? "Concept" : "Problem"}</Chip>
            ))}
          </Group>
        )}
        <Group label="Status">
          {([["All", "All"], ["done", "Completed"], ["todo", "Not completed"]] as const).map(([v, label]) => (
            <Chip key={v} active={status === v} onClick={() => setStatus(v)}>{label}</Chip>
          ))}
        </Group>
      </div>

      <p className="mb-3 mt-6 font-mono text-xs text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>

      {results.length === 0 ? (
        <EmptyState
          title={q ? "No matches for that search." : "More visualizations are coming."}
          body={q ? "Try a different keyword, or build the visualization yourself." : "This category is ready for contributors."}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => (
            <AlgorithmCard key={`${item.type}:${item.slug}`} item={item} thumbnail={item.thumbnail} completed={isItemDone(progress, item)} />
          ))}
        </div>
      )}
    </div>
  );
}
