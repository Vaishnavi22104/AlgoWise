import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-28 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-2xl font-semibold">This page is not in the array.</h1>
      <p className="mt-2 text-sm text-muted">Binary search checked every possibility. Try the library instead.</p>
      <LinkButton href="/concepts" variant="primary" className="mt-6">Browse concepts</LinkButton>
    </div>
  );
}
