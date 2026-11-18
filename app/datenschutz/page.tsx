import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Datenschutzerklärung · veycron",
  description: "Informationen zur Verarbeitung personenbezogener Daten bei veycron gemäß DSGVO.",
  alternates: { canonical: "/datenschutz" },
};

const list = "list-disc pl-5 space-y-1";

export default function DatenschutzPage() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      sections={[
        {
          title: "Verantwortlicher",
          body: <p>noreply, noreply, 86505 noreply, Deutschland · E-Mail: noreply@googlemail.com</p>,
        },
        {
          title: "Was im Browser bleibt",
          body: (
            <>
              <p>Der Rechner arbeitet vollständig in Ihrem Browser. Folgende Daten werden dort im lokalen Speicher (localStorage) abgelegt und <strong>nicht an uns oder Dritte übertragen</strong>:</p>
              <ul className={list}>
                <li>Ihr Konto: E-Mail-Adresse und ein Hash Ihres Passworts</li>
                <li>Ihre Eingaben im Rechner: Namen, Adressen, Beträge, Zählerstände — auch Daten Ihrer Mieter, die Sie selbst eintragen</li>
              </ul>
              <p>Dadurch gilt ein Konto nur in diesem Browser auf diesem Gerät. Sie löschen die Daten über &bdquo;Alles zurücksetzen&ldquo; im Rechner oder indem Sie die Websitedaten Ihres Browsers löschen. Rechtsgrundlage ist die von Ihnen gewünschte Nutzung der Funktion (Art. 6 Abs. 1 lit. b DSGVO).</p>
            </>
          ),
        },
        {
          title: "Hosting und Logfiles",
          body: (
            <p>Diese Seite wird von Vercel Inc. (USA) ausgeliefert. Dabei verarbeitet der Hosting-Anbieter automatisch technische Zugriffsdaten (IP-Adresse, Zeitpunkt, angeforderte Seite, User-Agent), um den Betrieb sicherzustellen und Angriffe abzuwehren (Art. 6 Abs. 1 lit. f DSGVO). Die Übermittlung in die USA erfolgt auf Grundlage von Standardvertragsklauseln (Art. 46 DSGVO).</p>
          ),
        },
        {
          title: "Cookies und Tracking",
          body: <p>Wir setzen keine Cookies, keine Analyse- und keine Marketing-Werkzeuge ein. Der lokale Speicher wird ausschließlich für die von Ihnen ausdrücklich genutzte Funktion verwendet (§ 25 Abs. 2 Nr. 2 TDDDG); ein Einwilligungsbanner ist daher nicht nötig.</p>,
        },
        {
          title: "Ihre Rechte",
          body: (
            <>
              <ul className={list}>
                <li>Auskunft, Berichtigung und Löschung Ihrer Daten</li>
                <li>Einschränkung der Verarbeitung und Datenübertragbarkeit</li>
                <li>Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen</li>
                <li>Beschwerde bei einer Datenschutz-Aufsichtsbehörde</li>
              </ul>
              <p>Wenden Sie sich dafür an noreply@googlemail.com. Da wir Ihre Konto- und Rechnerdaten nicht erhalten, können wir dazu keine Auskunft geben — sie liegen allein bei Ihnen.</p>
            </>
          ),
        },
      ]}
    />
  );
}
