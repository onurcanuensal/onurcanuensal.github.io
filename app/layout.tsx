import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-body" });
const geistDisplay = Geist({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-data" });

const siteDescription =
  "Nebenkostenabrechnung für private Vermieter in Minuten statt Excel-Abenden — rechtssicher nach BetrKV, inklusive CO2-Kostenaufteilung und BGH-Pflichtbestandteilen.";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://veycron.de";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "veycron — Nebenkostenabrechnung ohne den Jahres-Krampf.",
  description: siteDescription,
  keywords: [
    "Nebenkostenabrechnung", "Betriebskostenabrechnung", "BetrKV",
    "Vermieter", "Nebenkostenrechner", "Heizkostenabrechnung",
    "CO2-Kostenaufteilungsgesetz", "Nebenkosten Vorlage", "veycron",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "veycron",
    title: "veycron — Nebenkostenabrechnung ohne den Jahres-Krampf.",
    description: siteDescription,
    locale: "de_DE",
  },
  twitter: {
    card: "summary",
    title: "veycron — Nebenkostenabrechnung ohne den Jahres-Krampf.",
    description: siteDescription,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "veycron",
  description: siteDescription,
  url: baseUrl,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    areaServed: { "@type": "Country", name: "DE" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geist.variable} ${geistDisplay.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
