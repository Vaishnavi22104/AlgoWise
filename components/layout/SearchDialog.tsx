"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { hrefFor, searchAlgorithms, type CatalogMeta } from "@/core/algorithm/registry";
import { Badge, DifficultyBadge } from "@/components/ui/badge";

export function SearchDialog({ items }: { items: CatalogMeta[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchAlgorithms(query, items).slice(0, 8), [query, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const go = (item: CatalogMeta) => {
    setOpen(false);
    router.push(hrefFor(item));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-line-strong bg-surface px-3 text-[13px] text-muted shadow-card hover:bg-slate-50"
        aria-label="Search algorithms"
      >
        <Search size={15} aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-line bg-slate-50 px-1.5 font-mono text-[10px] sm:inline">Ctrl K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/30 px-4 pt-[14vh]" onMouseDown={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search algorithms"
            className="w-full max-w-lg overflow-hidden rounded-xl border border-line bg-surface shadow-pop"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-line px-4">
              <Search size={16} className="text-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter" && results[active]) {
                    go(results[active]);
                  }
                }}
                placeholder="Search by name, category, difficulty or tag"
                className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
                aria-label="Search"
              />
            </div>
            <ul className="max-h-80 overflow-y-auto p-1.5" role="listbox">
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No matches. This could be your contribution.</li>}
              {results.map((r, i) => (
                <li key={`${r.type}:${r.slug}`} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm ${i === active ? "bg-accent-soft" : ""}`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{r.title}</span>
                      <span className="block truncate text-xs text-muted">{r.category}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <Badge>{r.type === "concept" ? "Concept" : "Problem"}</Badge>
                      <DifficultyBadge difficulty={r.difficulty} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
