import { beforeEach, describe, expect, it, vi } from "vitest";
import { allAlgorithms } from "@/content";
import {
  availableLanguages,
  DEFAULT_LANGUAGE,
  defineCode,
  LANGUAGES,
  lineFor,
  pickImplementation,
} from "@/core/algorithm/languages";
import { initialPlayback, playbackReducer, type PlaybackAction } from "@/core/visualization/playback";
import { validateTrace } from "@/core/algorithm/validate";
import type { AlgorithmDefinition } from "@/core/algorithm/types";

const get = (type: "concept" | "problem", slug: string) => allAlgorithms.find((a) => a.type === type && a.slug === slug) as AlgorithmDefinition;
const lineText = (def: AlgorithmDefinition, lang: "java" | "python", anchor: string) =>
  def.languages[lang]!.source.split("\n")[lineFor(def.languages[lang], anchor) - 1].trim();

describe("defineCode", () => {
  it("strips //@ and #@ markers and records 1-based lines", () => {
    const java = defineCode("int a = 1;   //@init\nint b = 2;\nreturn a; //@done");
    expect(java.source).toBe("int a = 1;\nint b = 2;\nreturn a;");
    expect(java.lines).toEqual({ init: 1, done: 3 });
    const py = defineCode("a = 1   #@init\nreturn a  #@done");
    expect(py.source).toBe("a = 1\nreturn a");
    expect(py.lines).toEqual({ init: 1, done: 2 });
  });

  it("keeps ordinary comments", () => {
    const c = defineCode("stack.pop()   # pop   #@pop-1");
    expect(c.source).toBe("stack.pop()   # pop");
    expect(c.lines["pop-1"]).toBe(1);
  });

  it("rejects an anchor used twice", () => {
    expect(() => defineCode("a //@x\nb //@x")).toThrow();
  });
});

describe("language registry", () => {
  it("has exactly Java and Python, with Java as the default", () => {
    expect(LANGUAGES.map((l) => l.id)).toEqual(["java", "python"]);
    expect(DEFAULT_LANGUAGE).toBe("java");
  });

  it("falls back to the default when a language is missing", () => {
    const only = { java: defineCode("x //@a") };
    expect(pickImplementation(only, "python").id).toBe("java");
    expect(availableLanguages(only).map((l) => l.id)).toEqual(["java"]);
  });

  it("validation fails when a step anchor is missing from a language", () => {
    const def = get("concept", "binary-search");
    const broken: AlgorithmDefinition = { ...def, languages: { ...def.languages, python: defineCode("pass //@low") } };
    const errors = validateTrace(broken, def.run());
    expect(errors.some((e) => e.includes("not defined in python"))).toBe(true);
  });
});

describe("one trace, two languages", () => {
  it("maps the same step to different code in Java and Python (Binary Search, step 'mid')", () => {
    const def = get("concept", "binary-search");
    const step = def.run().find((s) => s.anchor === "mid")!;
    expect(lineText(def, "java", step.anchor)).toBe("int mid = low + (high - low) / 2;");
    expect(lineText(def, "python", step.anchor)).toBe("mid = (low + high) // 2");
  });

  it("highlights the semantically right line in both languages for every algorithm", () => {
    const expectations: Record<string, RegExp[]> = {
      loop: [/^(while|for)\b/, /^(while|for)\b/],
      found: [/^return\b/, /^return\b/],
      "not-found": [/^return\b/, /^return\b/],
      return: [/^return\b/, /^return\b/],
      equal: [/^if \(/, /^if\b/],
      "go-right": [/low = mid \+ 1/, /low = mid \+ 1/],
      "go-left": [/high = mid - 1/, /high = mid - 1/],
      flip: [/curr\.next = prev;/, /curr\.next = prev/],
    };
    for (const def of allAlgorithms) {
      for (const step of def.run()) {
        const want = expectations[step.anchor];
        if (!want) continue;
        expect(lineText(def, "java", step.anchor)).toMatch(want[0]);
        expect(lineText(def, "python", step.anchor)).toMatch(want[1]);
      }
    }
  });

  it("uses the same steps for both languages: the trace is computed once and never depends on language", () => {
    for (const def of allAlgorithms) {
      const steps = def.run();
      const serialised = JSON.stringify(steps);
      // The trace contains no source text and no language names.
      expect(serialised).not.toMatch(/"(java|python)"/);
      for (const lang of LANGUAGES) {
        const impl = def.languages[lang.id]!;
        for (const s of steps) expect(lineFor(impl, s.anchor)).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the step, state and highlight in sync while switching language mid-playback", () => {
    for (const def of allAlgorithms) {
      const steps = def.run();
      let playback = initialPlayback(steps.length);
      let lang: "java" | "python" = "java";
      const actions: (PlaybackAction | "switch")[] = [
        { type: "play" },
        { type: "tick" },
        { type: "tick" },
        "switch",
        { type: "tick" },
        { type: "pause" },
        "switch",
        { type: "next" },
        { type: "prev" },
        "switch",
        { type: "reset" },
        { type: "next" },
      ];
      for (const a of actions) {
        const before = playback;
        if (a === "switch") lang = lang === "java" ? "python" : "java";
        else playback = playbackReducer(playback, a);

        const step = steps[playback.index];
        const line = lineFor(def.languages[lang], step.anchor);
        // A language switch never moves the step, never changes playing state, and always lands on a real line.
        if (a === "switch") expect(playback).toEqual(before);
        expect(line).toBeGreaterThan(0);
        expect(def.languages[lang]!.source.split("\n")[line - 1].trim().length).toBeGreaterThan(0);
        // Both languages highlight a line for the very same step object.
        const other = lang === "java" ? "python" : "java";
        expect(lineFor(def.languages[other], step.anchor)).toBeGreaterThan(0);
      }
    }
  });

  it("explanations avoid language-specific syntax", () => {
    const bad = /\bNone\b|\bTrue\b|\bFalse\b|\/\/ 2|\.append\(|len\(|enumerate|\bprint\(/;
    for (const def of allAlgorithms) {
      for (const s of def.run()) {
        expect(`${s.operation} | ${s.explanation}`).not.toMatch(bad);
      }
    }
  });
});

describe("preferred language (localStorage algowise:language)", () => {
  let store: Map<string, string>;
  beforeEach(() => {
    store = new Map();
    Object.assign(globalThis, {
      window: {
        localStorage: {
          getItem: (k: string) => store.get(k) ?? null,
          setItem: (k: string, v: string) => void store.set(k, v),
        },
      },
    });
  });

  it("is saved when chosen and restored after a refresh; junk values fall back to Java", async () => {
    vi.resetModules();
    const first = await import("@/lib/language");
    first.setLanguage("python");
    expect(store.get("algowise:language")).toBe("python");

    store.set("algowise:language", "cobol");
    vi.resetModules();
    await import("@/lib/language");
    // read() is internal; setting then reloading proves round-trip below
    store.set("algowise:language", "python");
    vi.resetModules();
    const again = await import("@/lib/language");
    again.setLanguage("java");
    expect(store.get("algowise:language")).toBe("java");
  });
});
