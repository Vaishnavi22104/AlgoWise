import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

export function buttonClass({ variant = "secondary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-40",
    size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-sm",
    variant === "primary" && "bg-accent text-white shadow-card hover:bg-accent-strong",
    variant === "secondary" && "border border-line-strong bg-surface text-ink shadow-card hover:bg-slate-50",
    variant === "ghost" && "text-muted hover:bg-slate-100 hover:text-ink",
    className,
  );
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type="button" className={buttonClass({ variant, size, className })} {...props} />;
}

export function LinkButton({ variant, size, className, ...props }: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}

export function ExternalButton({ variant, size, className, ...props }: ComponentProps<"a"> & { variant?: Variant; size?: Size }) {
  return <a target="_blank" rel="noreferrer noopener" className={buttonClass({ variant, size, className })} {...props} />;
}
