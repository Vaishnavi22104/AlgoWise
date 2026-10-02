"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CatalogMeta } from "@/core/algorithm/registry";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";
import { SearchDialog } from "./SearchDialog";

const NAV = [
  { href: "/concepts", label: "Concepts", match: ["/concepts", "/visualize"] },
  { href: "/problems", label: "LeetCode", match: ["/problems"] },
  { href: "/learning", label: "My Learning", match: ["/learning"] },
  { href: "/contribute", label: "Contribute", match: ["/contribute"] },
];

export function SiteHeader({ items }: { items: CatalogMeta[] }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-7">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => {
              const active = n.match.some((m) => pathname.startsWith(m));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    active ? "bg-slate-100 font-medium text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <SearchDialog items={items} />
          <a
            href={SITE.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-muted hover:bg-slate-100 hover:text-ink"
            aria-label="AlgoWise on GitHub (opens in a new tab)"
          >
            <Github size={16} aria-hidden="true" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
      <nav aria-label="Main (compact)" className="flex gap-1 overflow-x-auto border-t border-line px-3 py-1.5 md:hidden">
        {NAV.map((n) => {
          const active = n.match.some((m) => pathname.startsWith(m));
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={cn("shrink-0 rounded-md px-3 py-1 text-sm", active ? "bg-slate-100 font-medium text-ink" : "text-muted")}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
