import Link from "next/link";
import { SITE } from "@/lib/site";

/** Mark: three array cells with a pointer under the middle one. */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1.5" y="3" width="6" height="9" rx="1.8" fill="#fff" stroke="#94a3b8" strokeWidth="1.6" />
      <rect x="9" y="3" width="6" height="9" rx="1.8" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.6" />
      <rect x="16.5" y="3" width="6" height="9" rx="1.8" fill="#fff" stroke="#94a3b8" strokeWidth="1.6" />
      <path d="M12 21 V15.5 M9.6 17.6 L12 15 L14.4 17.6" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-ink">
      <LogoMark />
      {SITE.name}
    </Link>
  );
}
