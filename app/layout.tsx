import type { Metadata } from "next";
import "./globals.css";

const siteDescription =
  "XRechnung und ZUGFeRD in 2 Minuten erstellen — ohne Buchhaltungssoftware, ohne Steuerberater. Für Freelancer und Kleinunternehmer, die die E-Rechnungspflicht einfach erfüllen wollen.";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://veycron.de";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "veycron — XRechnung in 2 Minuten. Ohne Steuerberater.",
  description: siteDescription,
  keywords: [
    "XRechnung", "ZUGFeRD", "E-Rechnung", "E-Rechnungspflicht",
    "Freelancer", "Kleinunternehmer", "Rechnung erstellen",
    "XRechnung erstellen", "E-Rechnung Pflicht 2025",
    "GoBD", "elektronische Rechnung", "veycron",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "veycron",
    title: "veycron — XRechnung in 2 Minuten. Ohne Steuerberater.",
    description: siteDescription,
    images: ["/og.png"],
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "veycron — XRechnung in 2 Minuten.",
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
    availability: "https://schema.org/PreOrder",
    areaServed: { "@type": "Country", name: "DE" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
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
