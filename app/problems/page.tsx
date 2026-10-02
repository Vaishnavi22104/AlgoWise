import type { Metadata } from "next";
import { listAlgorithms, toCatalogMeta } from "@/content";
import { AlgorithmThumbnail } from "@/components/algorithm/AlgorithmThumbnail";
import { CatalogBrowser } from "@/components/algorithm/CatalogBrowser";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Problems" };

export default function ProblemsPage() {
  const items = listAlgorithms("problem").map((def) => ({ ...toCatalogMeta(def), thumbnail: <AlgorithmThumbnail def={def} /> }));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow="Problems" title="Problem visualizations">
        Popular interview problems, explained with original code and animations. Each page restates the problem with examples in our own words and links to the official statement.
      </PageHeader>
      <CatalogBrowser items={items} fixedType="problem" />
    </div>
  );
}
