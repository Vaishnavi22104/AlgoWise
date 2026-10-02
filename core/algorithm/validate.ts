import { TONES } from "../visualization/types";
import { DEFAULT_LANGUAGE, LANGUAGES } from "./languages";
import type { AlgorithmDefinition, AlgorithmStep } from "./types";

/**
 * Returns a list of problems with a trace. An empty list means the trace is
 * structurally valid: every step anchor resolves to a real line in EVERY language the
 * algorithm offers, ids are sequential, and every pointer or link refers to something
 * that is actually on screen.
 */
export function validateTrace(def: AlgorithmDefinition, steps: AlgorithmStep[]): string[] {
  const errors: string[] = [];
  if (steps.length === 0) errors.push("trace is empty");

  if (!def.languages[DEFAULT_LANGUAGE]) errors.push(`missing the default language (${DEFAULT_LANGUAGE})`);
  const offered = LANGUAGES.filter((l) => def.languages[l.id]);
  for (const lang of offered) {
    const impl = def.languages[lang.id]!;
    const lines = impl.source.split("\n");
    for (const [anchor, line] of Object.entries(impl.lines)) {
      if (line < 1 || line > lines.length || !lines[line - 1].trim())
        errors.push(`${lang.id}: anchor "${anchor}" points at a missing or blank line (${line})`);
    }
  }

  steps.forEach((step, i) => {
    const at = `step ${i + 1}`;
    if (step.id !== i + 1) errors.push(`${at}: id should be ${i + 1}`);
    if (!step.anchor) errors.push(`${at}: missing anchor`);
    for (const lang of offered) {
      if (step.anchor && !def.languages[lang.id]!.lines[step.anchor])
        errors.push(`${at}: anchor "${step.anchor}" is not defined in ${lang.id}`);
    }
    if (!step.operation) errors.push(`${at}: missing operation`);
    if (!step.explanation) errors.push(`${at}: missing explanation`);

    for (const s of step.state.structures) {
      if (s.kind === "array") {
        s.cells.forEach((c) => {
          if (c.tone && !TONES.includes(c.tone)) errors.push(`${at}: unknown tone ${c.tone}`);
        });
        s.pointers?.forEach((p) => {
          if (p.index < 0 || p.index >= s.cells.length)
            errors.push(`${at}: pointer ${p.label} index ${p.index} out of range`);
        });
        if (s.range && (s.range.from < 0 || s.range.to >= s.cells.length))
          errors.push(`${at}: range out of bounds`);
      }
      if (s.kind === "linked-list") {
        const ids = new Set(s.nodes.map((n) => n.id));
        s.nodes.forEach((n) => {
          if (n.next !== null && !ids.has(n.next)) errors.push(`${at}: ${n.id}.next -> missing ${n.next}`);
        });
        s.pointers?.forEach((p) => {
          if (p.target !== null && !ids.has(p.target))
            errors.push(`${at}: pointer ${p.label} -> missing ${p.target}`);
        });
      }
    }
  });
  return errors;
}
