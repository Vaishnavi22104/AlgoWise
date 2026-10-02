import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAlgorithm, listAlgorithms } from "@/content";
import { AlgorithmView } from "@/components/algorithm/AlgorithmView";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listAlgorithms("concept").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const def = getAlgorithm("concept", slug);
  return def ? { title: def.title, description: def.description } : {};
}

export default async function VisualizePage({ params }: Params) {
  const { slug } = await params;
  if (!getAlgorithm("concept", slug)) notFound();
  return <AlgorithmView type="concept" slug={slug} />;
}
