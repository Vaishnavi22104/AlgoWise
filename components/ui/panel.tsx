import { cn } from "@/lib/cn";

/** Standard bordered surface used for every card and panel. */
export function Panel({
  title,
  aside,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card", className)}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
          <h2 className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted">{title}</h2>
          {aside && <div className="min-w-0 text-xs text-muted">{aside}</div>}
        </header>
      )}
      <div className={cn("flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}
