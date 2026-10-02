import type { Metadata } from "next";
import { buildLearningPath } from "@/content/learning";
import { LearningJourney } from "@/components/progress/LearningJourney";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "My Learning" };

export default function LearningPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow="My Learning" title="Your Learning Progress">
        Work through each concept at your own pace and tick off what you have done. No account needed.
      </PageHeader>
      <LearningJourney path={buildLearningPath()} />
    </div>
  );
}
