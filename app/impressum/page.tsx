// app/impressum/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum · Veycron",
  description:
    "Angaben gemäß § 5 TMG für Veycron. Kontakt, Verantwortlicher, Register, USt-IdNr.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  const updated = new Date().toLocaleDateString("de-DE", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Gradient-Deko wie auf der Landing */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-40 blur-3xl">
        <div className="mx-auto h-full max-w-3xl bg-gradient-to-r from-indigo-300/30 via-violet-300/30 to-fuchsia-300/30" />
      </div>

      {/* Page-Hero */}
      <header className="mb-8">
        <p className="text-xs font-medium tracking-wider text-indigo-600">RECHTLICHES</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Impressum
        </h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Gesetzliche Anbieterkennzeichnung nach § 5 TMG.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-gray-600">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs">
                <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
                Privater Auftritt (kein Gewerbe)
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs">
                <span className="h-2 w-2 rounded-full bg-gray-400" aria-hidden="true" />
                Anbieterkennzeichnung nach §18 MStV / §5 TMG(DDG)
            </span>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <article className="lg:col-span-2 space-y-8 text-indigo-600">
          {[
            ["Anbieter", [
              "Veycron (Arbeitstitel)",
              "Onurcan Ünsal",
              "Steigstraße 26",
              "86505 Münsterhausen",
              "Deutschland",
            ]],
            ["Kontakt", [
              "E-Mail: cetmikli21@gmailcom",
            ]],
            ["Vertretungsberechtigt", ["Onurcan Ünsal"]],
            ["Umsatzsteuer-ID", ["DE000000000 (falls vorhanden)"]],
          ].map(([title, lines]) => (
            <section key={String(title)} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold">{title as string}</h2>
              <ul className="mt-3 space-y-1 text-gray-700">
                {(lines as string[]).map((l) => <li key={l}>{l}</li>)}
              </ul>
            </section>
          ))}

          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Haftung für Inhalte</h2>
            <p className="mt-2 text-gray-700">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen
              Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
              überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-600">Urheberrecht</h2>
            <p className="mt-2 text-gray-700">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke unterliegen dem deutschen
              Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
            </p>
          </section>

          <p className="text-sm text-gray-500">
            Hinweis: Platzhalter – bitte durch echte Firmendaten ersetzen. Keine Rechtsberatung.
          </p>
        </article>

        {/* Rechte Spalte / Karten wie auf der Landing */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sticky top-24">
            <h3 className="text-sm font-medium text-gray-900">Kontakt</h3>
            <p className="mt-1 text-sm text-gray-600">
              Fragen? <span className="underline">hello@veycron.dev</span>
            </p>
            <p className="mt-4 text-xs text-gray-500">Stand: {updated}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
