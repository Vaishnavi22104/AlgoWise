import { beforeEach, describe, expect, it, vi } from "vitest";
import { computeLearning } from "@/lib/progress-stats";
import { buildLearningPath } from "@/content/learning";

/** A fake browser: one storage object that survives "page refreshes" (module reloads). */
function installBrowser() {
  const data = new Map<string, string>();
  const localStorage = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
  Object.assign(globalThis, { window: { localStorage, addEventListener() {}, removeEventListener() {} } });
  return data;
}

/** Simulates a refresh: fresh module state, same storage. */
async function refresh() {
  vi.resetModules();
  return import("@/lib/progress");
}

describe("progress persistence (localStorage key algowise:progress:v1)", () => {
  let storage: Map<string, string>;
  beforeEach(() => {
    storage = installBrowser();
  });

  it("keeps checkpoints, problems and XP after a refresh", async () => {
    const first = await refresh();
    first.setCheckpoint("binary-search", "understand", true);
    first.setCheckpoint("binary-search", "explore", true);
    first.setProblemCompleted("binary-search", true);
    expect(storage.has("algowise:progress:v1")).toBe(true);

    const second = await refresh();
    // useProgress is a hook; the same snapshot it returns comes from the store's load().
    const raw = JSON.parse(storage.get("algowise:progress:v1")!);
    expect(raw.version).toBe(2);
    expect(raw.checkpoints["binary-search"]).toMatchObject({ understand: expect.any(Number), explore: expect.any(Number) });
    expect(raw.completedProblems["binary-search"]).toEqual(expect.any(Number));

    const summary = computeLearning(raw, buildLearningPath());
    expect(summary.xp).toBe(40);
    expect(summary.checkpointsDone).toBe(2);
    expect(summary.problemsDone).toBe(1);

    // The reloaded store starts from the saved copy: a new tick keeps the old ones, and unticking updates it.
    second.setCheckpoint("stack", "understand", true);
    second.setCheckpoint("binary-search", "explore", false);
    const after = JSON.parse(storage.get("algowise:progress:v1")!);
    expect(computeLearning(after, buildLearningPath()).xp).toBe(10 + 20 + 10);
  });

  it("survives corrupted storage", async () => {
    storage.set("algowise:progress:v1", "{not json");
    const store = await refresh();
    expect(() => store.setCheckpoint("stack", "understand", true)).not.toThrow();
    expect(JSON.parse(storage.get("algowise:progress:v1")!).checkpoints.stack.understand).toEqual(expect.any(Number));
  });

  it("reset clears everything", async () => {
    const store = await refresh();
    store.setProblemCompleted("two-sum", true);
    store.resetProgress();
    expect(JSON.parse(storage.get("algowise:progress:v1")!)).toEqual({ version: 2, checkpoints: {}, completedProblems: {} });
  });
});
