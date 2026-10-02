import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAlgorithm, listAlgorithms } from "@/content";
import { AlgorithmView } from "@/components/algorithm/AlgorithmView";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return listAlgorithms("problem").map((a) => ({ id: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const def = getAlgorithm("problem", id);
  return def ? { title: def.title, description: def.description } : {};
}

export default async function ProblemPage({ params }: Params) {
  const { id } = await params;
  if (!getAlgorithm("problem", id)) notFound();
  return <AlgorithmView type="problem" slug={id} />;
}
