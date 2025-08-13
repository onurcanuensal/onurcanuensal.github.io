import type { Metadata } from "next";
import "./globals.css";

const siteName = "Vectoron";
const siteDescription =
  "Vectoron baut Plattformen, Data- und ML-Lösungen: Cloud Foundations & Landing Zones, Lakehouse/Data Platform, GenAI/LLM-Anwendungen – sicher, skalierbar, messbar.";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Vectoron — Engineering für Cloud, Data & AI",
    template: "%s · Vectoron",
  },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: "Vectoron — Engineering für Cloud, Data & AI",
    description: siteDescription,
    images: ["/og.png"], // Lege /public/og.png ab (1200x630)
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veycron — Engineering für Cloud, Data & AI",
    description: siteDescription,
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
