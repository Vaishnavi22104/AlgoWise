import type { Tone, VisualizationEvent } from "./types";

export const eventMeta: Record<VisualizationEvent, { label: string; tone: Tone }> = {
  compare: { label: "Compare", tone: "warning" },
  select: { label: "Select", tone: "active" },
  swap: { label: "Swap", tone: "warning" },
  insert: { label: "Insert", tone: "success" },
  delete: { label: "Delete", tone: "error" },
  push: { label: "Push", tone: "success" },
  pop: { label: "Pop", tone: "warning" },
  visit: { label: "Visit", tone: "active" },
  "move-pointer": { label: "Move pointer", tone: "pointer" },
  found: { label: "Found", tone: "success" },
  "not-found": { label: "Not found", tone: "error" },
  "update-variable": { label: "Update variable", tone: "neutral" },
};
