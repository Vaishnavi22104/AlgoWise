import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { allAlgorithms, toCatalogMeta } from "@/content";
import { DemoBar } from "@/components/layout/DemoBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${SITE.name}: ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: "Interactive DSA visualizations synchronized with the code, line by line. Open source.",
};

export const viewport: Viewport = { themeColor: "#f8fafc" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const items = allAlgorithms.map(toCatalogMeta);
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-bg text-ink">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2">
          Skip to content
        </a>
        <SiteHeader items={items} />
        <main id="main">{children}</main>
        <SiteFooter />
        <DemoBar />
      </body>
    </html>
  );
}
