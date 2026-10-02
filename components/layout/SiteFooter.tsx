import Link from "next/link";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

const LINKS = [
  { title: "Learn", items: [["Concepts", "/concepts"], ["LeetCode", "/problems"], ["My Learning", "/learning"]] },
  { title: "Open source", items: [["Contribute", "/contribute"], ["Issues and PRs", "/github"], ["About", "/about"]] },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">{SITE.description}</p>
        </div>
        {LINKS.map((col) => (
          <div key={col.title}>
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-muted">{col.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {col.items.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-ink hover:text-accent">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted sm:px-6">
          MIT licensed. Explanations, code and animations are original AlgoWise content. Problem names and numbers refer to third-party
          sites such as LeetCode; AlgoWise is not affiliated with them.
        </p>
      </div>
    </footer>
  );
}
