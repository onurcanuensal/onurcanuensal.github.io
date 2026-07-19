import type { Metadata } from "next";
import "./globals.css";

const siteName = "veycron";
const siteDescription =
  "veycron automatisiert Büroprozesse mit KI und baut individuelle Software und Webseiten für Handwerks- und Industriebetriebe — DSGVO-konform, zum Festpreis, mit laufender Betreuung.";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://veycron.de";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "veycron — KI-Automatisierung, Software & Webseiten für den Mittelstand",
    template: "%s · veycron",
  },
  description: siteDescription,
  keywords: [
    "KI Automatisierung", "Büroautomatisierung", "Handwerk", "Mittelstand",
    "KI für Handwerker", "Angebotserstellung KI", "Büroprozesse automatisieren",
    "KI Beratung", "Künstliche Intelligenz Mittelstand", "DSGVO KI",
    "Digitalisierung Handwerk", "KI Industriebetrieb", "Büroarbeit automatisieren",
    "Softwareentwicklung Mittelstand", "Webseite Handwerker", "Webentwicklung",
    "individuelle Software", "Webseite erstellen lassen", "Webagentur",
    "veycron", "KI Praxis", "KI Kanzlei",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: "veycron — KI-Automatisierung, Software & Webseiten für den Mittelstand",
    description: siteDescription,
    images: ["/og.png"],
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "veycron — KI-Automatisierung, Software & Webseiten für den Mittelstand",
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
  "@type": "ProfessionalService",
  name: "veycron",
  description: siteDescription,
  url: baseUrl,
  areaServed: { "@type": "Country", name: "DE" },
  serviceType: [
    "KI-Automatisierung",
    "Büroprozess-Optimierung",
    "KI-Beratung für Handwerk und Mittelstand",
    "Softwareentwicklung",
    "Webdesign und Webentwicklung",
  ],
  knowsAbout: [
    "Künstliche Intelligenz",
    "Büroautomatisierung",
    "Angebotserstellung",
    "Dokumentenverarbeitung",
  ],
  priceRange: "Festpreis",
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
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
