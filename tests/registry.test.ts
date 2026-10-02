import { describe, expect, it } from "vitest";
import { allAlgorithms, getByKey, keyFor } from "@/content";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/core/algorithm/languages";
import { validateTrace } from "@/core/algorithm/validate";
import { CATEGORIES, DIFFICULTIES } from "@/core/algorithm/types";

describe("every registered algorithm", () => {
  it("has unique keys and the expected demo dataset", () => {
    const keys = allAlgorithms.map(keyFor);
    expect(new Set(keys).size).toBe(keys.length);
    expect(allAlgorithms.filter((a) => a.type === "concept").length).toBeGreaterThan(3);
    expect(allAlgorithms.filter((a) => a.type === "problem").length).toBeGreaterThan(4);
  });

  for (const def of allAlgorithms) {
    describe(`${def.type}:${def.slug}`, () => {
      const steps = def.run();

      it("has complete metadata", () => {
        expect(CATEGORIES).toContain(def.category);
        expect(DIFFICULTIES).toContain(def.difficulty);
        expect(def.description.length).toBeGreaterThan(10);
        expect(def.complexity.time).toBeTruthy();
        expect(def.complexity.space).toBeTruthy();
        expect(def.howItWorks.length).toBeGreaterThan(0);
        expect(def.tags.length).toBeGreaterThan(0);
        if (def.type === "problem") {
          expect(def.problem?.url).toContain("leetcode.com");
          const st = def.problem!.statement;
          expect(st.description.length).toBeGreaterThan(0);
          expect(st.examples.length).toBeGreaterThan(0);
          expect(st.constraints.length).toBeGreaterThan(0);
          for (const ex of st.examples) {
            expect(ex.input.length).toBeGreaterThan(0);
            expect(ex.output.length).toBeGreaterThan(0);
          }
        }
      });

      it("produces a structurally valid trace", () => {
        expect(validateTrace(def, steps)).toEqual([]);
      });

      it("is deterministic", () => {
        expect(JSON.stringify(def.run())).toBe(JSON.stringify(steps));
      });

      it("maps every step to a non-empty line of code in every language", () => {
        for (const lang of LANGUAGES) {
          const impl = def.languages[lang.id];
          if (!impl) continue;
          const lines = impl.source.split("\n");
          for (const s of steps) expect(lines[(impl.lines[s.anchor] ?? 0) - 1]?.trim().length).toBeGreaterThan(0);
        }
      });

      it("offers Java (default) and Python, and nothing else yet", () => {
        expect(Object.keys(def.languages).sort()).toEqual(["java", "python"]);
        expect(DEFAULT_LANGUAGE).toBe("java");
      });

      it("hides anchor markers from the displayed code", () => {
        for (const impl of Object.values(def.languages)) expect(impl!.source).not.toMatch(/(?:\/\/|#)\s*@[A-Za-z]/);
      });

      it("uses the same anchors in every language (one trace, many languages)", () => {
        const sets = Object.values(def.languages).map((impl) => Object.keys(impl!.lines).sort().join(","));
        expect(new Set(sets).size).toBe(1);
      });

      it("has resolvable related links", () => {
        for (const key of def.related ?? []) expect(getByKey(key)).toBeTruthy();
      });
    });
  }
});
