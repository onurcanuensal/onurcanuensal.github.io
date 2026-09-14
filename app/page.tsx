'use client';
import Link from "next/link";

const BETRK_ITEMS = [
  ["Grundsteuer", "Nr. 1"], ["Wasserversorgung", "Nr. 2"], ["Entwässerung", "Nr. 3"],
  ["Heizung", "Nr. 4a"], ["Warmwasser", "Nr. 4b"], ["Aufzug", "Nr. 5"],
  ["Straßenreinigung & Müll", "Nr. 6"], ["Gebäudereinigung", "Nr. 7"], ["Gartenpflege", "Nr. 8"],
  ["Beleuchtung", "Nr. 9"], ["Schornsteinfeger", "Nr. 10"], ["Sach-/Haftpflichtvers.", "Nr. 11"],
  ["Hauswart", "Nr. 12"], ["Antenne/Kabel", "Nr. 13"], ["Wäschepflege", "Nr. 14"],
  ["Gemeinschaftsflächen", "Nr. 15"], ["Sonstige Betriebskosten", "Nr. 16"],
];

const BGH_STEPS = [
  ["Gesamtkosten je Kostenart", "Alle Ausgaben aufgeschlüsselt nach den 17 Betriebskostenarten"],
  ["Verteilerschlüssel benannt & erklärt", "Nach welchem Maßstab wird umgelegt (Wohnfläche, Personen, Verbrauch)?"],
  ["Anteil des Mieters berechnet", "Die konkrete Rechnung, wie der Anteil zustande kommt"],
  ["Vorauszahlungen abgezogen", "Geleistete Vorauszahlungen gegengerechnet — Nachzahlung oder Guthaben"],
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── NAV ── */}
      <header className="w-full border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-3xl flex items-center justify-between px-5 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'var(--blue)' }}>v</div>
            <span className="font-semibold tracking-tight" style={{ color: 'var(--text)' }}>veycron</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Anmelden
            </Link>
            <Link href="/register" className="rounded-md px-3 py-1.5 text-sm font-semibold text-white"
              style={{ background: 'var(--green)' }}>
              Registrieren
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <main className="flex-1 flex flex-col items-center px-5 py-16 sm:py-24">
        <div className="w-full max-w-xl">

          <div className="fade-up-1 mb-8">
            <span className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Für private Vermieter · Deutschland
            </span>
          </div>

          <h1 className="fade-up-2 font-bold leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 3.2rem)', letterSpacing: '-0.025em', color: 'var(--text)' }}>
            Nebenkostenabrechnung,<br />
            <span style={{ color: 'var(--text-secondary)' }}>ohne den Jahres-Krampf.</span>
          </h1>

          <p className="fade-up-3 mt-5 text-lg leading-relaxed" style={{ color: 'var(--text-secondary)', maxWidth: '520px' }}>
            Für alle, die 1–10 Wohnungen vermieten und keine Hausverwaltung brauchen wollen —
            rechtssicher nach BetrKV, in Minuten statt Excel-Abenden.
          </p>

          <div className="fade-up-3 mt-8 space-y-3">
            {[
              "17 Betriebskostenarten schon vorausgefüllt, inklusive CO2-Kostenaufteilung",
              "Mehrere Wohneinheiten & Eigennutzung werden korrekt berücksichtigt",
              "Erfüllt automatisch die vier BGH-Pflichtbestandteile einer Abrechnung",
            ].map((text) => (
              <div key={text} className="flex items-start gap-3">
                <svg className="mt-1 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</span>
              </div>
            ))}
          </div>

          <div className="fade-up-4 mt-10 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors"
              style={{ background: 'var(--green)' }}>
              Kostenlos registrieren →
            </Link>
            <Link href="/login" className="rounded-lg px-6 py-3 text-sm font-semibold border transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              Bereits registriert? Anmelden
            </Link>
          </div>
        </div>

        {/* ── WAS DARFST DU UMLEGEN ── */}
        <section className="w-full max-w-xl mt-20">
          <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: 'var(--blue)' }}>Kostenloser Check 1/2</p>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Was darfst du überhaupt umlegen?</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Die 17 Betriebskostenarten nach § 2 BetrKV — alles, was grundsätzlich auf deinen Mieter umlagefähig ist.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BETRK_ITEMS.map(([name, nr]) => (
              <div key={name} className="rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: 'var(--green)', background: 'var(--good-tint)', color: 'var(--text)' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓ </span>{name}
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{nr}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border px-4 py-3 text-sm"
            style={{ borderColor: 'var(--bad)', background: 'var(--bad-tint)', color: 'var(--text)' }}>
            <p className="text-xs font-mono uppercase tracking-wide mb-2" style={{ color: 'var(--bad)' }}>
              Nicht umlagefähig (§ 1 Abs. 2 BetrKV)
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Verwaltungskosten</strong> — Hausverwaltung, Kontoführung, Eigentümerversammlungen</li>
              <li><strong>Instandhaltung & Instandsetzung</strong> — Reparaturen, Dach, Fassade, defekte Geräte</li>
              <li><strong>Leerstandskosten</strong> — Kosten für leerstehende Einheiten</li>
              <li><strong>Kapitalkosten</strong> — Kreditraten, Zinsen, Finanzierungskosten</li>
            </ul>
          </div>
        </section>

        {/* ── BGH ── */}
        <section className="w-full max-w-xl mt-16">
          <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: 'var(--blue)' }}>Kostenloser Check 2/2</p>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Ist deine Abrechnung überhaupt wirksam?</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Der BGH verlangt vier Pflichtbestandteile (Urteil VIII ZR 244/18) — fehlt einer, ist die
            ganze Abrechnung formell unwirksam, egal wie richtig die Zahlen sind.
          </p>
          <div className="rounded-lg border p-5 space-y-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
            {BGH_STEPS.map(([title, desc], i) => (
              <div key={title} className="flex gap-3 items-start">
                <span className="shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-mono font-semibold"
                  style={{ borderColor: 'var(--blue)', color: 'var(--blue)' }}>{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{title}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── REGISTER CTA ── */}
        <section className="w-full max-w-xl mt-16">
          <div className="rounded-lg p-6 sm:p-8" style={{ background: 'var(--blue)' }}>
            <h2 className="text-xl font-semibold text-white mb-2">Leg kostenlos los</h2>
            <p className="text-sm mb-5" style={{ color: '#d7e2ec' }}>
              Registrieren, anmelden, Abrechnung erstellen — der Rechner ist direkt nutzbar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="rounded-lg px-6 py-3 text-sm font-semibold"
                style={{ background: '#fdfcf8', color: 'var(--blue)' }}>
                Konto erstellen
              </Link>
              <Link href="/login" className="rounded-lg px-6 py-3 text-sm font-semibold border"
                style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fdfcf8' }}>
                Anmelden
              </Link>
            </div>
          </div>
        </section>

        <div className="w-full max-w-xl mt-14 p-4 rounded-md border border-dashed text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <b style={{ color: 'var(--text)' }}>Wichtig:</b> Diese Seite und der Rechner sind eine
          Informations- und Berechnungshilfe, keine Rechtsberatung. Ohne Gewähr. Lass deine konkrete
          Abrechnung im Zweifel von einem Mieterverein oder Fachanwalt für Mietrecht prüfen.
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t py-6 px-5" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-between gap-4 text-xs"
          style={{ color: 'var(--text-muted)' }}>
          <span>© {new Date().getFullYear()} veycron</span>
          <div className="flex gap-5">
            <a href="/impressum" className="no-underline transition-colors" style={{ color: 'var(--text-muted)' }}>Impressum</a>
            <a href="/datenschutz" className="no-underline transition-colors" style={{ color: 'var(--text-muted)' }}>Datenschutz</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
