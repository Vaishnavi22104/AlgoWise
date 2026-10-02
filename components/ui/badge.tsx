import type { Difficulty } from "@/core/algorithm/types";
import type { Tone } from "@/core/visualization/types";
import { toneColors } from "@/core/visualization/tokens";
import { cn } from "@/lib/cn";

export function Badge({ children, tone, className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  const c = tone ? toneColors(tone) : null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        !c && "border-line bg-slate-50 text-muted",
        className,
      )}
      style={c ? { background: c.bg, borderColor: c.border, color: c.text } : undefined}
    >
      {children}
    </span>
  );
}

const DIFFICULTY_TONE: Record<Difficulty, Tone> = { Easy: "success", Medium: "warning", Hard: "error" };

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <Badge tone={DIFFICULTY_TONE[difficulty]}>{difficulty}</Badge>;
}
