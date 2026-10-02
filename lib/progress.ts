"use client";

import { useSyncExternalStore } from "react";
import {
  emptyProgress,
  sanitizeProgress,
  withCheckpoint,
  withProblem,
  type CheckpointId,
  type ProgressData,
} from "./progress-stats";

/** Same key as the first prototype; old page-view data is discarded by `sanitizeProgress`. */
export const STORAGE_KEY = "algowise:progress:v1";
const EMPTY = emptyProgress();

let cache: ProgressData | null = null;
const listeners = new Set<() => void>();

function load(): ProgressData {
  if (cache) return cache;
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    cache = raw ? sanitizeProgress(JSON.parse(raw)) : emptyProgress();
  } catch {
    cache = emptyProgress();
  }
  return cache;
}

function save(next: ProgressData) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: keep progress in memory for this session */
  }
  listeners.forEach((l) => l());
}

export const setCheckpoint = (concept: string, id: CheckpointId, done: boolean) =>
  save(withCheckpoint(load(), concept, id, done));

export const setProblemCompleted = (problem: string, done: boolean) => save(withProblem(load(), problem, done));

export const resetProgress = () => save(emptyProgress());

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  // Keep other tabs of the same browser in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};

export function useProgress(): ProgressData {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}
