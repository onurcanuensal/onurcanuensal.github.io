import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung · Veycron",
  description: "Informationen zur Verarbeitung personenbezogener Daten bei Veycron gemäß DSGVO.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  const updated = new Date().toLocaleDateString("de-DE", {
    year: "numeric", month: "long", day: "numeric",
  });

  const toc = [
    ["verantwortlicher", "Verantwortlicher"],
    ["daten", "Datenkategorien"],
    ["zwecke", "Zwecke & Rechtsgrundlagen"],
    ["hosting", "Hosting & Logfiles"],
    ["cookies", "Cookies & Einwilligungen"],
    ["analytics", "Analytics"],
    ["kontakt", "Kontaktformular"],
    ["rechte", "Ihre Rechte"],
    ["speicherdauer", "Speicherdauer & Löschung"],
  ] as const;

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Gradient-Deko wie Landing */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-40 blur-3xl">
        <div className="mx-auto h-full max-w-3xl bg-gradient-to-r from-indigo-300/30 via-violet-300/30 to-fuchsia-300/30" />
      </div>

      {/* Page-Hero */}
      <header className="mb-8">
        <p className="text-xs font-medium tracking-wider text-indigo-600">RECHTLICHES</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Datenschutzerklärung</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Diese Erklärung informiert über Art, Umfang und Zwecke der Verarbeitung personenbezogener Daten
          innerhalb dieses Online-Angebots.
        </p>

        {/* Chips/Badges */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-indigo-600">
          {[
            ["Zuletzt aktualisiert", updated],
            ["Rechtsgrundlage", "DSGVO (EU)"],
            ["Einwilligung", "Opt-In für optionale Dienste"],
          ].map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              <span className="font-medium">{k}:</span> {v}
            </span>
          ))}
        </div>
      </header>

      {/* Content + Sticky TOC (gleiche Karten-/Section-Optik wie Landing) */}
      <div className="grid gap-8 lg:grid-cols-3">
        <article className="lg:col-span-2 space-y-8">
          <section id="verantwortlicher" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Verantwortlicher</h2>
            <p className="mt-2 text-gray-700">
              Veycron, Onurcan Ünsal, Musterstraße 1, 12345 Musterstadt, Deutschland ·
              E-Mail: privacy@veycron.dev
            </p>
          </section>

          <section id="daten" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Kategorien verarbeiteter Daten</h2>
            <ul className="mt-2 list-disc pl-5 text-gray-700">
              <li>Bestands- und Kontaktdaten (z. B. Name, E-Mail)</li>
              <li>Nutzungsdaten (z. B. besuchte Seiten, Zugriffszeiten)</li>
              <li>Meta-/Kommunikationsdaten (z. B. IP-Adresse, User-Agent)</li>
            </ul>
          </section>

          <section id="zwecke" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Zwecke &amp; Rechtsgrundlagen</h2>
            <ul className="mt-2 list-disc pl-5 text-gray-700">
              <li>Bereitstellung des Online-Angebots (Art. 6 Abs. 1 lit. b/f DSGVO)</li>
              <li>Beantwortung von Kontaktanfragen (Art. 6 Abs. 1 lit. b/f DSGVO)</li>
              <li>Reichweitenmessung/Statistik mit Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</li>
            </ul>
          </section>

          <section id="hosting" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Hosting &amp; Logfiles</h2>
            <p className="mt-2 text-gray-700">
              Server-Logfiles (IP-Adresse, Zeitpunkt, Referrer, User-Agent) werden zur Sicherstellung
              des Betriebs und zur Abwehr von Angriffen verarbeitet und nur solange gespeichert, wie
              es für den Zweck erforderlich ist.
            </p>
          </section>

          <section id="cookies" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Cookies &amp; Einwilligungen</h2>
            <p className="mt-2 text-gray-700">
              Technisch notwendige Cookies werden eingesetzt. Für optionale Dienste (z. B. Analytics)
              wird eine Einwilligung über ein Consent-Banner eingeholt (Opt-In, widerrufbar).
            </p>
          </section>

          <section id="analytics" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Analytics</h2>
            <p className="mt-2 text-gray-700">
              Optional datenschutzfreundliche Reichweitenmessung (z. B. Plausible) ohne personenbezogene
              Profile. Rechtsgrundlage: Ihre Einwilligung.
            </p>
          </section>

          <section id="kontakt" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Kontaktformular</h2>
            <p className="mt-2 text-gray-700">
              Anfragen werden zur Bearbeitung verarbeitet und anschließend gemäß gesetzlichen Vorgaben gelöscht.
            </p>
          </section>

          <section id="rechte" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Ihre Rechte</h2>
            <ul className="mt-2 list-disc pl-5 text-gray-700">
              <li>Auskunft, Berichtigung, Löschung, Einschränkung</li>
              <li>Widerspruch gegen Verarbeitung</li>
              <li>Datenübertragbarkeit</li>
              <li>Beschwerde bei einer Aufsichtsbehörde</li>
            </ul>
          </section>

          <section id="speicherdauer" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Speicherdauer &amp; Löschung</h2>
            <p className="mt-2 text-gray-700">
              Löschung nach gesetzlichen Vorgaben, sobald Einwilligungen widerrufen wurden oder
              sonstige Erlaubnisse entfallen.
            </p>
          </section>

          <p className="text-sm text-gray-500">
            Hinweis: Platzhalter – bitte an eure tatsächlichen Prozesse/Dienstleister anpassen. Keine Rechtsberatung.
          </p>
        </article>

        {/* Sticky TOC – identische Kartengestaltung */}
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
