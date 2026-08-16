import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung · veycron",
  description: "Informationen zur Verarbeitung personenbezogener Daten bei veycron gemäß DSGVO.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  const updated = new Date().toLocaleDateString("de-DE", {
    year: "numeric", month: "long", day: "numeric",
  });

  const toc = [
    ["verantwortlicher", "Verantwortlicher"],
    ["daten", "Welche Daten wir verarbeiten"],
    ["zwecke", "Zweck & Rechtsgrundlage"],
    ["empfaenger", "Empfänger & Auftragsverarbeiter"],
    ["hosting", "Hosting & Logfiles"],
    ["cookies", "Cookies & Tracking"],
    ["speicherdauer", "Speicherdauer & Löschung"],
    ["rechte", "Ihre Rechte"],
  ] as const;

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-40 blur-3xl">
        <div className="mx-auto h-full max-w-3xl bg-gradient-to-r from-indigo-300/30 via-violet-300/30 to-fuchsia-300/30" />
      </div>

      <header className="mb-8">
        <p className="text-xs font-medium tracking-wider text-indigo-600">RECHTLICHES</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Datenschutzerklärung</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Diese Erklärung informiert darüber, welche Daten wir auf dieser Seite verarbeiten,
          zu welchem Zweck und auf welcher Rechtsgrundlage.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-indigo-600">
          {[
            ["Zuletzt aktualisiert", updated],
            ["Rechtsgrundlage", "DSGVO (EU)"],
            ["Datenerhebung", "Nur bei freiwilliger Eintragung"],
          ].map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              <span className="font-medium">{k}:</span> {v}
            </span>
          ))}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <article className="lg:col-span-2 space-y-8">
          <section id="verantwortlicher" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Verantwortlicher</h2>
            <p className="mt-2 text-gray-700">
              [Vollständiger Name], [Straße Hausnummer], [PLZ Ort], Deutschland ·
              E-Mail: kontakt@veycron.de
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Hinweis: Bitte hier eure vollständigen Kontaktdaten eintragen (siehe auch Impressum).
            </p>
          </section>

          <section id="daten" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Welche Daten wir verarbeiten</h2>
            <p className="mt-2 text-gray-700">
              Diese Seite bewirbt ein Produkt in Entwicklung und sammelt Interessent:innen für den
              Frühzugang. Wir verarbeiten ausschließlich:
            </p>
            <ul className="mt-2 list-disc pl-5 text-gray-700">
              <li>Ihre E-Mail-Adresse, wenn Sie diese freiwillig über das Formular eintragen</li>
              <li>Technische Zugriffsdaten beim Seitenaufruf (z. B. IP-Adresse, Zeitpunkt, User-Agent) durch unser Hosting</li>
            </ul>
            <p className="mt-2 text-gray-700">
              Wir erheben keine weiteren Daten (kein Name, keine Zahlungsdaten, keine sonstigen Angaben).
            </p>
          </section>

          <section id="zwecke" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Zweck &amp; Rechtsgrundlage</h2>
            <p className="mt-2 text-gray-700">
              Ihre E-Mail-Adresse verwenden wir ausschließlich, um Sie zu kontaktieren, sobald das
              Produkt startet. Rechtsgrundlage ist Ihre Einwilligung durch das aktive Absenden des
              Formulars (Art. 6 Abs. 1 lit. a DSGVO). Eine Weitergabe zu Werbe- oder sonstigen Zwecken
              findet nicht statt.
            </p>
          </section>

          <section id="empfaenger" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Empfänger &amp; Auftragsverarbeiter</h2>
            <ul className="mt-2 list-disc pl-5 text-gray-700">
              <li>
                <strong>Resend</strong> (E-Mail-Zustelldienst) übermittelt die eingetragene Adresse als
                Benachrichtigung an uns. Der Versand erfolgt über Infrastruktur in der EU (Region
                eu-west-1). Mit Resend besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO.
              </li>
              <li>
                <strong>Vercel Inc.</strong> (USA) hostet diese Webseite. Da es sich um einen Anbieter
                außerhalb der EU handelt, erfolgt die Übermittlung auf Grundlage der von der
                EU-Kommission genehmigten Standardvertragsklauseln (Art. 46 DSGVO).
              </li>
            </ul>
          </section>

          <section id="hosting" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Hosting &amp; Logfiles</h2>
            <p className="mt-2 text-gray-700">
              Beim Aufruf dieser Seite verarbeitet unser Hosting-Anbieter automatisch technische
              Zugriffsdaten (Server-Logfiles) zur Sicherstellung des Betriebs und zur Abwehr von
              Angriffen. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und
              stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </section>

          <section id="cookies" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Cookies &amp; Tracking</h2>
            <p className="mt-2 text-gray-700">
              Diese Seite setzt keine Cookies, keine Analyse- oder Marketing-Tools und kein Tracking
              ein. Es ist daher kein Cookie-Consent-Banner erforderlich.
            </p>
          </section>

          <section id="speicherdauer" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Speicherdauer &amp; Löschung</h2>
            <p className="mt-2 text-gray-700">
              Ihre E-Mail-Adresse speichern wir, bis Sie der Speicherung widersprechen, den
              Frühzugang nicht mehr wünschen oder das Produkt eingestellt wird. Eine Löschung können
              Sie jederzeit formlos per E-Mail an kontakt@veycron.de verlangen.
            </p>
          </section>

          <section id="rechte" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Ihre Rechte</h2>
            <ul className="mt-2 list-disc pl-5 text-gray-700">
              <li>Auskunft über die zu Ihnen gespeicherten Daten</li>
              <li>Berichtigung unrichtiger Daten</li>
              <li>Löschung Ihrer Daten</li>
              <li>Einschränkung der Verarbeitung</li>
              <li>Widerruf Ihrer Einwilligung mit Wirkung für die Zukunft</li>
              <li>Datenübertragbarkeit</li>
              <li>Beschwerde bei einer Datenschutz-Aufsichtsbehörde</li>
            </ul>
            <p className="mt-2 text-gray-700">
              Für alle Anliegen wenden Sie sich an: kontakt@veycron.de
            </p>
          </section>

          <p className="text-sm text-gray-500">
            Hinweis: Diese Erklärung beschreibt den tatsächlichen Datenfluss dieser Seite (Stand: {updated}).
            Sie ersetzt keine individuelle Rechtsberatung.
          </p>
        </article>

        <aside className="space-y-4">
          <nav className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900">Inhaltsverzeichnis</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a className="hover:text-gray-900" href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sticky top-[calc(24rem)]">
            <h3 className="text-sm font-medium text-gray-900">Zuletzt aktualisiert</h3>
            <p className="mt-1 text-sm text-gray-600">{updated}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
