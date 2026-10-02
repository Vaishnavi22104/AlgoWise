import type { AlgorithmDefinition, AlgorithmMeta, AlgorithmType } from "./types";

const store = new Map<string, AlgorithmDefinition>();

const keyOf = (type: AlgorithmType, slug: string) => `${type}:${slug}`;

export function registerAlgorithm(def: AlgorithmDefinition): void {
  store.set(keyOf(def.type, def.slug), def);
}

export function getAlgorithm(type: AlgorithmType, slug: string): AlgorithmDefinition | undefined {
  return store.get(keyOf(type, slug));
}

export function getByKey(key: string): AlgorithmDefinition | undefined {
  return store.get(key);
}

export function listAlgorithms(type?: AlgorithmType): AlgorithmDefinition[] {
  const all = [...store.values()];
  return type ? all.filter((a) => a.type === type) : all;
}

export const keyFor = (a: Pick<AlgorithmMeta, "type" | "slug">) => keyOf(a.type, a.slug);

/** Strips the executor so the result can cross the server/client boundary. */
export function toMeta(def: AlgorithmDefinition): AlgorithmMeta {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { run, ...meta } = def;
  return meta;
}

/** Every query word must match the title, category, difficulty, tags or description. */
export type Searchable = Pick<AlgorithmMeta, "title" | "category" | "difficulty" | "type" | "tags" | "description">;

export function searchAlgorithms<T extends Searchable>(query: string, items: T[]): T[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return items;
  return items.filter((a) => {
    const haystack = [a.title, a.category, a.difficulty, a.type, ...a.tags, a.description]
      .join(" ")
      .toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

/** Light-weight metadata for lists and search (no code, no long text). */
export type CatalogMeta = Pick<
  AlgorithmMeta,
  "id" | "slug" | "type" | "title" | "category" | "difficulty" | "description" | "tags"
>;

export function toCatalogMeta(def: AlgorithmMeta): CatalogMeta {
  const { id, slug, type, title, category, difficulty, description, tags } = def;
  return { id, slug, type, title, category, difficulty, description, tags };
}

export function hrefFor(a: Pick<AlgorithmMeta, "type" | "slug">): string {
  return a.type === "concept" ? `/visualize/${a.slug}` : `/problems/${a.slug}`;
}
