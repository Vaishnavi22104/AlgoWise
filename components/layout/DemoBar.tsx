"use client";

import { ChevronLeft, ChevronRight, Presentation, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const STEPS = [
  { href: "/visualize/binary-search", label: "Binary Search" },
  { href: "/problems/reverse-linked-list", label: "Reverse Linked List" },
  { href: "/problems/two-sum", label: "Two Sum" },
  { href: "/contribute", label: "Contribute" },
];

const STORAGE = "algowise:demo";

/** Optional presenter strip. Toggle with the button bottom-right or press D. */
export function DemoBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [on, setOn] = useState(false);

  useEffect(() => {
    try {
      setOn(window.localStorage.getItem(STORAGE) === "1");
    } catch {
      // Storage unavailable: keep demo mode off.
    }
  }, []);

  const set = useCallback((v: boolean) => {
    setOn(v);
    try {
      window.localStorage.setItem(STORAGE, v ? "1" : "0");
    } catch {
      // Storage can be unavailable (private mode); demo mode then just resets on reload.
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement)?.tagName ?? "");
      if (!typing && !e.metaKey && !e.ctrlKey && e.key.toLowerCase() === "d") set(!on);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on, set]);

  const index = STEPS.findIndex((s) => pathname === s.href);
  const go = (delta: number) => {
    const next = STEPS[(Math.max(index, 0) + delta + STEPS.length) % STEPS.length];
    router.push(next.href);
  };

  if (!on) {
    return (
      <button
        type="button"
        onClick={() => set(true)}
        className="fixed bottom-4 right-4 z-30 hidden h-9 items-center gap-2 rounded-full border border-line-strong bg-surface px-3 text-xs text-muted shadow-card hover:text-ink md:inline-flex"
        aria-label="Open demo mode"
      >
        <Presentation size={14} aria-hidden="true" /> Demo
      </button>
    );
  }

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line-strong bg-ink px-2 py-1.5 text-white shadow-pop" aria-label="Demo mode">
      <button type="button" onClick={() => go(-1)} className="rounded-full p-1.5 hover:bg-white/10" aria-label="Previous demo page">
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
      {STEPS.map((s, i) => (
        <Link
          key={s.href}
          href={s.href}
          className={cn("rounded-full px-3 py-1 text-xs", index === i ? "bg-white text-ink" : "text-white/70 hover:text-white")}
        >
          <span className="mr-1.5 font-mono opacity-60">{i + 1}</span>
          {s.label}
        </Link>
      ))}
      <button type="button" onClick={() => go(1)} className="rounded-full p-1.5 hover:bg-white/10" aria-label="Next demo page">
        <ChevronRight size={16} aria-hidden="true" />
      </button>
      <button type="button" onClick={() => set(false)} className="ml-1 rounded-full p-1.5 hover:bg-white/10" aria-label="Close demo mode">
        <X size={14} aria-hidden="true" />
      </button>
    </nav>
  );
}
