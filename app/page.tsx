'use client';
import Link from "next/link";

const BETRK_ITEMS = [
  "Grundsteuer", "Wasserversorgung", "Entwässerung", "Heizung", "Warmwasser", "Aufzug",
  "Straßenreinigung & Müll", "Gebäudereinigung", "Gartenpflege", "Beleuchtung", "Schornsteinfeger",
  "Sach-/Haftpflichtvers.", "Hauswart", "Antenne/Kabel", "Wäschepflege", "Gemeinschaftsflächen", "Sonstige Betriebskosten",
];

const BGH_STEPS = [
  ["Gesamtkosten", "Alle Ausgaben je Kostenart"],
  ["Verteilerschlüssel", "Benannt und erklärt"],
  ["Mieteranteil", "Nachvollziehbar berechnet"],
  ["Vorauszahlungen", "Nachzahlung oder Guthaben"],
];

const NOT_ALLOWED = [
  ["Verwaltungskosten", "Hausverwaltung, Kontoführung"],
  ["Instandhaltung", "Reparaturen, Dach, Fassade"],
  ["Leerstand", "Kosten leerstehender Einheiten"],
  ["Kapitalkosten", "Kreditraten, Zinsen"],
];

const Check = ({ c = "var(--green)" }: { c?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

function Mockup() {
  const rows = [["Grundsteuer", "212,40 €"], ["Wasser & Abwasser", "468,00 €"], ["Heizung & Warmwasser", "1.184,75 €"], ["Müll & Reinigung", "236,10 €"]];
  return (
    <div className="relative mx-auto mt-16 w-full max-w-3xl fade-up-4">
      <div className="absolute -inset-x-10 -top-10 bottom-0 -z-10 dot-grid opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]" />
      <div className="surface p-5 sm:p-8 text-left" style={{ boxShadow: '0 40px 80px -30px rgba(79,70,229,0.35), var(--shadow-card)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Nebenkostenabrechnung 2025</p>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>Musterstraße 12 · 2. OG links</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'var(--good-tint)', color: 'var(--green-hover)' }}>BGH-konform</span>
        </div>
        <div className="space-y-3">
          {rows.map(([n, v]) => (
            <div key={n} className="flex justify-between text-sm pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{n}</span>
              <span style={{ fontFamily: 'var(--font-data)', color: 'var(--text)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl p-5 flex items-end justify-between text-white"
          style={{ background: 'radial-gradient(300px 160px at 100% 0%, rgba(219,39,119,0.5), transparent 70%), radial-gradient(300px 160px at 0% 100%, rgba(79,70,229,0.7), transparent 70%), #0b1220' }}>
          <span className="text-sm text-white/70">Guthaben Mieter</span>
          <span className="text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-data)', letterSpacing: '-0.04em' }}>− 143,25 €</span>
        </div>
      </div>
      <div className="surface float hidden sm:flex items-center gap-2 absolute -left-6 top-24 px-4 py-3 text-sm font-medium" style={{ ['--r' as string]: '-4deg' }}>
        <Check /> CO2-Aufteilung
      </div>
      <div className="surface float hidden sm:flex items-center gap-2 absolute -right-6 bottom-28 px-4 py-3 text-sm font-medium" style={{ ['--r' as string]: '3deg', animationDelay: '-3s' }}>
        <Check /> 17 Kostenarten
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── NAV ── */}
      <header className="sticky top-3 z-30 px-4">
        <div className="mx-auto max-w-4xl h-14 rounded-full border glass flex items-center justify-between pl-5 pr-2"
          style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--accent-grad)' }}>v</span>
            <span className="font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>veycron</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/login" className="px-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Anmelden</Link>
            <Link href="/register" className="btn btn-primary" style={{ borderRadius: 999 }}>Registrieren</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 pt-16 sm:pt-24 pb-24">
        {/* ── HERO ── */}
        <section className="mx-auto max-w-4xl text-center">
          <span className="fade-up-1 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-subtle" style={{ background: 'var(--green)' }} />
            Für private Vermieter · Deutschland
          </span>
          <h1 className="fade-up-2 mt-6" style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', lineHeight: 1, letterSpacing: '-0.05em', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Nebenkosten,<br />
            <span className="grad-text">ohne Krampf.</span>
          </h1>
          <p className="fade-up-3 mt-6 mx-auto text-lg leading-relaxed" style={{ color: 'var(--text-secondary)', maxWidth: 540 }}>
            Für alle mit 1–10 Wohnungen: rechtssicher nach BetrKV, in Minuten statt Excel-Abenden.
          </p>
          <div className="fade-up-3 mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn btn-accent" style={{ padding: '0.9rem 1.7rem', fontSize: '0.95rem', borderRadius: 999 }}>Kostenlos starten →</Link>
            <Link href="/login" className="btn btn-ghost" style={{ padding: '0.9rem 1.7rem', fontSize: '0.95rem', borderRadius: 999 }}>Anmelden</Link>
          </div>
          <Mockup />
        </section>

        {/* ── BENTO ── */}
        <section className="mx-auto max-w-5xl mt-32">
          <p className="text-sm font-semibold mb-3 grad-text inline-block">Check 1 · Umlagefähigkeit</p>
          <h2 className="text-3xl sm:text-5xl mb-10" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Was darfst du überhaupt umlegen?</h2>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="surface p-7 md:col-span-3">
              <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Die 17 Betriebskostenarten nach § 2 BetrKV — grundsätzlich umlagefähig:</p>
              <div className="flex flex-wrap gap-2">
                {BETRK_ITEMS.map((n) => (
                  <span key={n} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm" style={{ background: 'var(--good-tint)', color: '#065f46' }}>
                    <Check c="#059669" />{n}
                  </span>
                ))}
              </div>
            </div>
            <div className="surface p-7 md:col-span-2" style={{ background: 'var(--bad-tint)', borderColor: 'transparent' }}>
              <p className="text-sm font-semibold mb-5" style={{ color: 'var(--bad)' }}>Nicht umlagefähig · § 1 Abs. 2 BetrKV</p>
              <ul className="space-y-4">
                {NOT_ALLOWED.map(([t, d]) => (
                  <li key={t}>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{t}</p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{d}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── BGH ── */}
        <section className="mx-auto max-w-5xl mt-32">
          <p className="text-sm font-semibold mb-3 grad-text inline-block">Check 2 · Wirksamkeit</p>
          <h2 className="text-3xl sm:text-5xl mb-4" style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Ist deine Abrechnung wirksam?</h2>
          <p className="mb-10 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Der BGH verlangt vier Pflichtbestandteile (VIII ZR 244/18). Fehlt einer, ist die Abrechnung formell unwirksam — egal wie richtig die Zahlen sind.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BGH_STEPS.map(([t, d], i) => (
              <div key={t} className="surface card-hover p-6">
                <span className="text-5xl grad-text" style={{ fontFamily: 'var(--font-data)', letterSpacing: '-0.06em' }}>0{i + 1}</span>
                <p className="font-semibold mt-6" style={{ color: 'var(--text)' }}>{t}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mx-auto max-w-5xl mt-32">
          <div className="rounded-[32px] p-10 sm:p-16 text-center text-white"
            style={{ background: 'radial-gradient(600px 300px at 100% 0%, rgba(219,39,119,0.55), transparent 70%), radial-gradient(600px 300px at 0% 100%, rgba(79,70,229,0.8), transparent 70%), #0b1220' }}>
            <h2 className="text-4xl sm:text-6xl" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.045em' }}>Leg kostenlos los.</h2>
            <p className="mt-4 text-white/70">Registrieren, anmelden, Abrechnung erstellen.</p>
            <Link href="/register" className="btn mt-8" style={{ background: '#fff', color: 'var(--blue)', padding: '0.9rem 1.8rem', borderRadius: 999 }}>Konto erstellen →</Link>
          </div>
          <p className="mt-10 text-xs max-w-2xl mx-auto text-center" style={{ color: 'var(--text-muted)' }}>
            <b style={{ color: 'var(--text)' }}>Wichtig:</b> Informations- und Berechnungshilfe, keine Rechtsberatung. Ohne Gewähr. Lass deine Abrechnung im Zweifel von einem Mieterverein oder Fachanwalt für Mietrecht prüfen.
          </p>
        </section>
      </main>

      <footer className="border-t py-6 px-5" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>© {new Date().getFullYear()} veycron</span>
          <div className="flex gap-5">
            <a href="/impressum">Impressum</a>
            <a href="/datenschutz">Datenschutz</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
