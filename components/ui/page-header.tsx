export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="mb-8 max-w-2xl">
      {eyebrow && <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
      {children && <div className="mt-2 text-[15px] leading-relaxed text-muted">{children}</div>}
    </header>
  );
}
