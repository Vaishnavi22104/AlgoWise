import type { Metadata } from "next";
import { listAlgorithms, toCatalogMeta } from "@/content";
import { AlgorithmThumbnail } from "@/components/algorithm/AlgorithmThumbnail";
import { CatalogBrowser } from "@/components/algorithm/CatalogBrowser";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Concepts" };

export default function ConceptsPage() {
  const items = listAlgorithms("concept").map((def) => ({ ...toCatalogMeta(def), thumbnail: <AlgorithmThumbnail def={def} /> }));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow="Concepts" title="Data structures and algorithms">
        Start with the idea. Every card opens a step-by-step visualization synchronized with its code.
      </PageHeader>
      <CatalogBrowser items={items} fixedType="concept" />
    </div>
  );
}
