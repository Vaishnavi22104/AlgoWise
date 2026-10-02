"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md px-4 py-28 text-center">
      <h1 className="text-xl font-semibold">Something went wrong.</h1>
      <p className="mt-2 text-sm text-muted">The page could not be loaded.</p>
      <Button variant="primary" className="mt-6" onClick={reset}>Retry</Button>
    </div>
  );
}
