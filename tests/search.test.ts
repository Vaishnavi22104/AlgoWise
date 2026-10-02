import { describe, expect, it } from "vitest";
import { allAlgorithms, searchAlgorithms } from "@/content";

describe("global search", () => {
  it("finds every linked list item", () => {
    const titles = searchAlgorithms("linked list", allAlgorithms).map((a) => a.title);
    expect(titles).toContain("Reverse Linked List");
    expect(titles).toContain("Merge Two Sorted Lists");
    expect(titles).toContain("Singly Linked List");
  });

  it("searches by category, difficulty and tag", () => {
    expect(searchAlgorithms("searching", allAlgorithms).length).toBeGreaterThan(1);
    expect(searchAlgorithms("easy", allAlgorithms)).toHaveLength(allAlgorithms.length);
    expect(searchAlgorithms("lifo", allAlgorithms).map((a) => a.slug)).toContain("stack");
  });

  it("returns everything for an empty query and nothing for gibberish", () => {
    expect(searchAlgorithms("", allAlgorithms)).toHaveLength(allAlgorithms.length);
    expect(searchAlgorithms("zzzzqq", allAlgorithms)).toHaveLength(0);
  });
});
