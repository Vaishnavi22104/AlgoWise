"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_LANGUAGE, isLanguageId, type LanguageId } from "@/core/algorithm/languages";

/** The learner's preferred language, remembered in this browser. Java until they choose otherwise. */
const KEY = "algowise:language";

let current: LanguageId | null = null;
const listeners = new Set<() => void>();

function read(): LanguageId {
  if (current) return current;
  try {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
    current = isLanguageId(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    current = DEFAULT_LANGUAGE;
  }
  return current;
}

export function setLanguage(id: LanguageId) {
  current = id;
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function usePreferredLanguage(): LanguageId {
  return useSyncExternalStore(subscribe, read, () => DEFAULT_LANGUAGE);
}
