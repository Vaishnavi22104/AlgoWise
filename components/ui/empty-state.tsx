import { SITE } from "@/lib/site";
import { LinkButton } from "./button";

export function EmptyState({ title = "More visualizations are coming.", body = "This category is ready for contributors." }: { title?: string; body?: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      <div aria-hidden="true" className="mb-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-9 w-9 rounded-lg border-2 border-dashed border-line-strong" />
        ))}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>
      <div className="mt-5 flex gap-2">
        <LinkButton href="/contribute" variant="primary">
          Contribute this visualization
        </LinkButton>
        <a className="inline-flex h-10 items-center px-3 text-sm text-muted underline-offset-4 hover:underline" href={`${SITE.issuesUrl}/new/choose`} target="_blank" rel="noreferrer noopener">
          Open an issue
        </a>
      </div>
    </div>
  );
}
