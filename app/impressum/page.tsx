import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Impressum · veycron",
  description: "Anbieterkennzeichnung nach § 5 DDG für veycron.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      sections={[
        {
          title: "Anbieter",
          body: <p>veycron<br />noreply<br />noreply<br />noreply noreply<br />Deutschland</p>,
        },
        {
          title: "Kontakt",
          body: <p>E-Mail: noreply@googlemail.com</p>,
        },
        {
          title: "Haftung",
          body: (
            <>
              <p>Der Rechner ist eine Berechnungshilfe und ersetzt keine Rechtsberatung. Die Ergebnisse erfolgen ohne Gewähr; lassen Sie Ihre Abrechnung im Zweifel von einem Mieterverein oder Fachanwalt für Mietrecht prüfen.</p>
              <p>Für eigene Inhalte sind wir nach den allgemeinen Gesetzen verantwortlich. Fremde Inhalte sind als solche gekennzeichnet.</p>
            </>
          ),
        },
      ]}
    />
  );
}
