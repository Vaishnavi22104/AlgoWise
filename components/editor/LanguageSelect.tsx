"use client";

import { availableLanguages, type Implementations, type LanguageId } from "@/core/algorithm/languages";

/** "Language: [Java ▼]". Changing it swaps the code only; playback and visualization are untouched. */
export function LanguageSelect({
  implementations,
  value,
  onChange,
}: {
  implementations: Implementations;
  value: LanguageId;
  onChange: (id: LanguageId) => void;
}) {
  const options = availableLanguages(implementations);
  return (
    <label className="flex items-center gap-2 text-xs normal-case tracking-normal text-muted">
      <span>Language:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as LanguageId)}
        className="h-7 rounded-md border border-line-strong bg-surface px-2 text-[13px] text-ink outline-none focus:border-accent"
        aria-label="Programming language"
      >
        {options.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
