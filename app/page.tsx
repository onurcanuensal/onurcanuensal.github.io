'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";


/* ── FEATURE MODAL DATA ─────────────────────────────────────────────── */
type FeatureDetail = {
  title: string; subtitle: string; intro: string;
  deliverables: { title: string; desc: string }[];
  usecases: string[]; highlights: string[];
  metrics: { num: string; label: string }[];
  ctaText: string;
};

const featureDetails: Record<string, FeatureDetail> = {
  "Angebotserstellung": {
    title: "Angebotserstellung", subtitle: "Von der Anfrage zur PDF in Minuten.",
    intro: "Ihre Angebote entstehen jetzt halb automatisch. KI versteht Kundenangaben, kalkuliert korrekt, formatiert professionell — Sie kontrollieren und versenden.",
    deliverables: [
      { title: "Automatische Erfassung", desc: "Kundenangaben → KI liest das, versteht die Anforderung → Stundensätze, Materialkosten, Pausen — alles richtig kalkuliert." },
      { title: "Korrekte Kalkulation", desc: "KI kennt Ihre Preislisten, Gewinnspannen, Standardadressen. Keine Rechenfehler, nichts wird vergessen." },
      { title: "Professionelle Formatierung", desc: "Logos, Geschäftsdaten, rechtliche Hinweise — automatisch eingesetzt. Angebote sehen einheitlich und seriös aus." },
      { title: "Ihre Kontrolle", desc: "Vor dem Versand: Sie sehen, was die KI erstellt hat. Änderungen möglich. Sie bleiben die Chefin oder der Chef." },
    ],
    usecases: ["Metallbauer: Angebote von 45 auf 8 Minuten reduziert", "Elektrofirma: 12 Angebote pro Tag statt 4 — bei besserer Qualität", "Malermeister: Keine Rechenfehler mehr — höhere Gewinnmarge"],
    highlights: ["Zeit einsparen", "Keine Fehler", "Professionelle Optik", "Schneller verkaufen"],
    metrics: [{ num: "60%", label: "weniger Zeit pro Angebot" }, { num: "0", label: "Rechenfehler" }, { num: "+15%", label: "schnellere Auftragskonvertierung" }],
    ctaText: "Erstgespräch vereinbaren →",
  },
  "Kundenmails": {
    title: "Kundenmails & Korrespondenz", subtitle: "Mails, die nach Ihrem Haus klingen.",
    intro: "Die KI schreibt Mails für Sie vor — im richtigen Ton, mit Ihren Vorlagen und Ihrem Wissen. Sie überprüfen, unterschreiben, fertig. Keine Tippfehler. Keine unprofessionellen Mails mehr.",
    deliverables: [
      { title: "Tonalität Ihres Unternehmens", desc: "KI lernt, wie Sie schreiben: formal, freundlich, direkt. Mails klingen nach Ihnen, nicht nach Maschinentext." },
      { title: "Terminbestätigung & Rückfragen", desc: "Standardmails entstehen in Sekunden: Termin bestätigt, Material-Frage beantwortet, Rechnung versendet." },
      { title: "Keine Tippfehler & Rechtschreibung", desc: "KI korrigiert, prüft Grammatik, prüft auf Unstimmigkeiten. Sie geben grünes Licht oder ändern in 10 Sekunden." },
      { title: "Batch-Verarbeitung", desc: "10 Kundenfragen gleichzeitig? KI antwortet auf alle. Sie prüfen, senden. Ein Zehntel der Zeit im Vergleich zur Handarbeit." },
    ],
    usecases: ["Kanzlei: 30 Mandantenmails täglich → KI-Vordrucke → Chef unterschreibt nur noch", "Zahnarzt-Praxis: Terminbestätigungen, Nachsorge-Infos — alle automatisch, persönlich", "Handwerksfirma: Kundenanfragen über Formular → KI entwirft Antwort → 2 Min Kontrolle → versenden"],
    highlights: ["Sprache Ihres Unternehmens", "Professionell & verlässlich", "Zeit für echte Kundengespräche", "Null Rechtschreibfehler"],
    metrics: [{ num: "80%", label: "weniger Zeit bei E-Mails" }, { num: "+30%", label: "schnellere Antwortzeit" }, { num: "100%", label: "Professionalität" }],
    ctaText: "Erstgespräch vereinbaren →",
  },
  "Dokumentation": {
    title: "Dokumentation & Prozesse", subtitle: "Wissen aufschreiben — automatisch.",
    intro: "Jede Arbeit, die Ihre Mitarbeiter erledigen, ist implizites Wissen. KI dokumentiert dieses Wissen: Prozessanleitungen, Checklisten, Schulungsmaterial. Alle im gleichen Format. Immer aktuell.",
    deliverables: [
      { title: "Prozess-Dokumentation", desc: "KI schaut dem Meister zu (Beschreibung, Video, Notizen) → erstellt Schritt-für-Schritt-Anleitungen → mit Fotos, Checklisten, Fehlermöglichkeiten." },
      { title: "Schulungsmaterial", desc: "Neue Mitarbeiter lernen schneller: Dokumentation ist klar, illustriert, verständlich. Nicht aus dem Kopf, nicht zufällig — systematisch." },
      { title: "Qualitätskontrolle", desc: "Alle arbeiten nach dem gleichen Standard. KI prüft: Hält Ihre Arbeit die Dokumentation ein? Konsistenz über alle Mitarbeiter." },
      { title: "Digitale Wissensdatenbank", desc: "Alle Prozesse zentral, durchsuchbar, versioniert. Wenn Sie eine Regel ändern, aktualisiert sich die KI automatisch." },
    ],
    usecases: ["Handwerksbetrieb: Alle 12 Standardprozesse dokumentiert — neue Azubis lernen sofort korrekt", "Zahnarzt-Praxis: Hygienestandards, Patientenkommunikation — alle im System, niemand vergisst etwas", "Rechtsanwalt: Mandanten-Checklisten, Dokumentenablage, Fristen — KI prüft ob alles beachtet wird"],
    highlights: ["Wissen nicht verlieren", "Neue Mitarbeiter schneller produktiv", "Höhere Konsistenz", "Weniger Fehler durch fehlende Infos"],
    metrics: [{ num: "3 Tage", label: "Einarbeitung statt 2 Wochen" }, { num: "+25%", label: "weniger Fehler" }, { num: "100%", label: "aller Prozesse dokumentiert" }],
    ctaText: "Erstgespräch vereinbaren →",
  },
  "Dateneingabe & Admin": {
    title: "Dateneingabe & Admin", subtitle: "Papierkram, der sich selbst erledigt.",
    intro: "Rechnungen, Lieferscheine, Stundenzettel, Kundenformulare — Ihre Mitarbeiter füllen diese weiterhin per Hand aus, aber: KI übernimmt die Eingabe ins System. Keine Tippfehler, keine doppelte Arbeit.",
    deliverables: [
      { title: "Optische Erfassung", desc: "Fotos von Papieren (Rechnungen, Belege) → KI erkennt die Informationen → sofort im System. Keine manuelle Übertragung nötig." },
      { title: "Formular-Automation", desc: "Online-Kundenformular ausgefüllt? KI trägt das sofort in Ihre Verwaltung ein — ERP, CRM, Buchhaltung, überall gleichzeitig." },
      { title: "Duplikat-Erkennung", desc: "KI erkennt: Diese Rechnung existiert schon, dieser Kunde ist bekannt, diese Adresse ist ein Tippfehler. Saubere Daten." },
      { title: "Automatische Validierung", desc: "PLZ-Format korrekt? Umsatzsteuer-ID plausibel? KI prüft vor der Speicherung. Fehler früh erkannt, nicht später." },
    ],
    usecases: ["Praxis: Patientenformulare → automatisch in Arztsoftware, Versicherungsdaten validiert", "Handwerk: Stundenzettel eingescannt → sofort in Abrechnung, Lohnabrechnung vorbereitet", "Kanzlei: Rechnungseingangsbuch automatisch gefüllt aus E-Rechnungen"],
    highlights: ["Keine doppelte Dateneingabe", "Weniger Tippfehler", "Schnellere Verarbeitung", "Zeit für wichtigere Aufgaben"],
    metrics: [{ num: "4h", label: "pro Woche Zeit gespart" }, { num: "99%", label: "weniger Eingabefehler" }, { num: "1 Tag", label: "Durchlaufzeit statt 3 Tage" }],
    ctaText: "Erstgespräch vereinbaren →",
  },
  "Software": {
    title: "Individuelle Software", subtitle: "Genau das Tool, das Ihnen noch fehlt.",
    intro: "Nicht jeder Prozess lässt sich mit Standardsoftware abbilden. Wir entwickeln individuelle Anwendungen, Dashboards und interne Tools — zugeschnitten auf Ihre Abläufe, Ihr Team und Ihre Daten.",
    deliverables: [
      { title: "Bedarfsanalyse", desc: "Wir verstehen Ihren Prozess, bevor wir programmieren. Gemeinsam klären wir: Was muss das Tool können, wer nutzt es, wo spart es am meisten?" },
      { title: "Entwicklung & Design", desc: "Moderne Technologie, saubere Oberfläche, schnelle Ladezeiten. Wir bauen Web-Apps, Dashboards, Kalkulatoren oder Verwaltungstools — je nachdem, was gebraucht wird." },
      { title: "Anbindung an Ihre Systeme", desc: "Das neue Tool spricht mit Ihrem ERP, Ihrer Buchhaltung oder Ihrem CRM. Kein Inselbetrieb, keine doppelte Datenpflege." },
      { title: "Wartung & Weiterentwicklung", desc: "Nach dem Go-live betreuen wir die Software: Updates, neue Features, Fehlerbehebung. Sie haben einen festen Ansprechpartner." },
    ],
    usecases: ["Handwerksbetrieb: Internes Auftragsboard ersetzt Zettelwirtschaft und Excel-Listen", "Industrieunternehmen: Produktionskennzahlen live auf einem Dashboard statt in monatlichen Excel-Reports", "Praxis: Patientenportal für Terminbuchung und Dokumentenupload — spart Telefonzeit"],
    highlights: ["Maßgeschneidert", "Moderne Technologie", "Nahtlose Integration", "Laufende Betreuung"],
    metrics: [{ num: "100%", label: "auf Ihren Betrieb zugeschnitten" }, { num: "1", label: "fester Ansprechpartner" }, { num: "∞", label: "erweiterbar" }],
    ctaText: "Erstgespräch vereinbaren →",
  },
  "Webseiten": {
    title: "Webseiten & Webportale", subtitle: "Ihr Auftritt, der Kunden bringt.",
    intro: "Eine Webseite ist heute Ihre digitale Visitenkarte — und oft der erste Eindruck. Wir bauen schnelle, moderne Webseiten, die bei Google gefunden werden und auf jedem Gerät überzeugen.",
    deliverables: [
      { title: "Design & Konzeption", desc: "Wir gestalten Ihren Webauftritt so, dass er zu Ihrem Betrieb passt: seriös, klar, vertrauensbildend. Kein Baukastencharme, sondern individuelles Design." },
      { title: "SEO-Optimierung", desc: "Technik, Struktur und Inhalte werden so aufgebaut, dass Google Sie findet — für die Suchbegriffe, die Ihre Kunden wirklich eingeben." },
      { title: "Mobil & performant", desc: "Über 60% Ihrer Besucher kommen vom Smartphone. Unsere Seiten laden schnell und sehen auf jedem Bildschirm gut aus." },
      { title: "DSGVO-konform", desc: "Cookie-Banner, Datenschutzerklärung, sichere Formulare — alles regelkonform, ohne dass Sie sich darum kümmern müssen." },
    ],
    usecases: ["Malerbetrieb: Neue Webseite bringt 3× mehr Anfragen über Google als die alte Baukastenlösung", "Kanzlei: Mandantenportal mit Login-Bereich für Dokumentenaustausch", "Zahnarztpraxis: Online-Terminbuchung reduziert Telefonanrufe um die Hälfte"],
    highlights: ["Individuelles Design", "SEO-optimiert", "Mobiloptimiert", "DSGVO-konform"],
    metrics: [{ num: "<2s", label: "Ladezeit" }, { num: "100%", label: "mobiloptimiert" }, { num: "+3×", label: "mehr Sichtbarkeit" }],
    ctaText: "Erstgespräch vereinbaren →",
  },
};

/* ── FEATURE MODAL ───────────────────────────────────────────────────── */
function FeatureModal({ featureKey, onClose }: { featureKey: string; onClose: () => void }) {
  const d = featureDetails[featureKey];
  if (!d) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label={d.title}
        className="modal-slide fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl">
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur" style={{ borderColor: '#e0dbd5', background: 'rgba(255,255,255,0.95)' }}>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1a3d52' }}>Leistungen / {d.title}</span>
          <button onClick={onClose} aria-label="Schließen"
            className="flex h-8 w-8 items-center justify-center rounded-lg border transition" style={{ borderColor: '#e0dbd5', color: '#999' }}>✕</button>
        </div>
        {/* body */}
        <div className="flex-1 px-6 py-8 sm:px-10">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl" style={{ color: '#1a1a1a' }}>{d.title}</h2>
          <p className="mt-1 font-semibold" style={{ color: '#157d5a' }}>{d.subtitle}</p>
          <p className="mt-5 text-base leading-relaxed pl-4 border-l-2" style={{ borderColor: '#157d5a', color: '#555' }}>{d.intro}</p>
          {/* deliverables */}
          <div className="mt-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#999' }}>Was Sie konkret bekommen</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {d.deliverables.map((item) => (
                <div key={item.title} className="rounded-lg p-4 border" style={{ borderColor: '#e0dbd5', background: '#f8f7f5' }}>
                  <h4 className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: '#666' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* usecases */}
          <div className="mt-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#999' }}>Echte Beispiele</p>
            <ul className="space-y-2">
              {d.usecases.map((u) => (
                <li key={u} className="flex gap-3 text-sm" style={{ color: '#555' }}>
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#157d5a' }} />{u}
                </li>
              ))}
            </ul>
          </div>
          {/* highlights */}
          <div className="mt-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#999' }}>Die Vorteile</p>
            <div className="flex flex-wrap gap-2">
              {d.highlights.map((h) => (
                <span key={h} className="rounded-lg border px-3 py-1 text-xs font-semibold" style={{ borderColor: '#157d5a', background: 'rgba(21, 125, 90, 0.08)', color: '#157d5a' }}>{h}</span>
              ))}
            </div>
          </div>
          {/* metrics */}
          <div className="mt-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: '#999' }}>Typische Ergebnisse</p>
            <div className="grid grid-cols-3 gap-3">
              {d.metrics.map((m) => (
                <div key={m.label} className="rounded-lg p-4 text-center border" style={{ borderColor: '#e0dbd5', background: '#f8f7f5' }}>
                  <div className="text-xl font-black tracking-tight" style={{ color: '#1a3d52' }}>{m.num}</div>
                  <div className="mt-1 text-xs" style={{ color: '#999' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* cta */}
          <div className="mt-10 rounded-lg p-6 text-center border" style={{ borderColor: '#e0dbd5', background: '#f8f7f5' }}>
            <p className="text-sm mb-4" style={{ color: '#666' }}>Bereit zum Gespräch? Wir antworten innerhalb von 24&nbsp;Stunden.</p>
            <a href="#contact" onClick={onClose}
              className="inline-block rounded-lg px-6 py-3 text-sm font-semibold text-white transition"
              style={{ background: '#157d5a' }}
              onMouseEnter={e=>(e.currentTarget.style.background='#126b4b')} onMouseLeave={e=>(e.currentTarget.style.background='#157d5a')}>
              {d.ctaText}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── FEATURE CARD ──────────────────────────────────────────────────── */
function FeatureCard({
  title, desc, icon, onClick,
}: { title: string; desc: string; icon: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="feature-card group relative cursor-pointer overflow-hidden rounded-xl p-8 sm:p-10 flex flex-col gap-2 border transition"
      style={{ borderColor: '#e0dbd5', background: '#fff', borderWidth: '1px' }}
      onMouseEnter={e=>(e.currentTarget.style.borderColor='#157d5a')} onMouseLeave={e=>(e.currentTarget.style.borderColor='#e0dbd5')}
    >
      <div className="text-4xl">{icon}</div>
      <h3 className="text-2xl font-bold" style={{ color: '#1a1a1a', marginTop: '0.75rem' }}>{title}</h3>
      <p className="text-base leading-relaxed" style={{ color: '#666' }}>{desc}</p>
      <span className="mt-3 text-sm font-semibold" style={{ color: '#157d5a' }}>Details ansehen →</span>
    </div>
  );
}

/* ── MAIN PAGE ───────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // contact form
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const closeModal = useCallback(() => setActiveFeature(null), []);

  useEffect(() => {
    document.body.style.overflow = activeFeature ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeFeature]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [closeModal]);

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormStatus('loading'); setFormError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, email: formEmail, message: formMessage }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? 'Fehler beim Senden.'); setFormStatus('error'); }
      else { setFormStatus('success'); setFormName(''); setFormEmail(''); setFormMessage(''); }
    } catch { setFormError('Netzwerkfehler — bitte prüfen Sie Ihre Verbindung.'); setFormStatus('error'); }
  }

  const features: { title: string; desc: string; icon: string }[] = [
    { title: "Angebote", desc: "Aus der Kundenanfrage wird in Minuten ein fertiges Angebot. Wir hinterlegen Ihre Preislisten und Kalkulationslogik — die KI erstellt, Sie prüfen und versenden. Keine Rechenfehler, einheitliche Optik.", icon: "📋" },
    { title: "Mails", desc: "Terminbestätigungen, Rückfragen, Mandanten- und Patientenpost: Die KI entwirft jede Antwort im Ton Ihres Hauses, mit Ihren Daten. Sie geben in Sekunden frei — statt selbst zu tippen.", icon: "✉️" },
    { title: "Dokumentation", desc: "Arbeitsanweisungen, Checklisten und Schulungsmaterial entstehen automatisch aus dem Wissen Ihrer erfahrenen Mitarbeiter. Neue Kollegen sind in Tagen produktiv statt in Wochen.", icon: "📚" },
    { title: "Dateneingabe", desc: "Rechnungen, Lieferscheine, Stundenzettel und Formulare landen ohne Abtippen im richtigen System — geprüft, validiert, ohne Duplikate. Ihr Büro arbeitet mit sauberen Daten.", icon: "🗂️" },
    { title: "Software", desc: "Individuelle Tools, Dashboards und interne Anwendungen — genau auf Ihren Betrieb zugeschnitten. Wir entwickeln, was es nicht von der Stange gibt: schnell, modern, wartbar.", icon: "⚙️" },
    { title: "Webseiten", desc: "Professionelle Webauftritte, die Kunden überzeugen und bei Google gefunden werden. Von der Visitenkarte im Netz bis zum vollständigen Kundenportal — performant, mobiloptimiert, DSGVO-konform.", icon: "🌐" },
  ];

  const faqs = [
    ["Wie läuft der erste Termin ab?", "Wir schauen uns Ihren Betrieb an: Welche Büroprozesse kosten Zeit? Wo entstehen Fehler? Dann zeigen wir konkret, wie KI das ändern kann."],
    ["Muss Ihr Team technisch fit sein?", "Nein. Sie schreiben wie immer — die KI macht die Arbeit schneller und besser. Keine Programmierung, keine Technik nötig."],
    ["Wann sparen Sie wirklich Zeit?", "In den ersten zwei Wochen merken Sie den Unterschied: Angebote schneller, Mails ohne Tippfehler, weniger Papierkram nach Feierabend."],
    ["Wie sieht die Betreuung aus?", "Wir richten die KI für Ihre Prozesse ein, schulen Ihr Team, und bleiben erreichbar. Regelmäßig prüfen wir: Wo läuft es? Wo optimieren wir?"],
    ["Was passiert mit Ihren Daten?", "Ihre Daten bleiben bei Ihnen. Wir nutzen die Daten nur, um die KI besser für Sie einzustellen — keine Weitergabe an Dritte, DSGVO-konform."],
    ["Was kostet die Zusammenarbeit?", "Die Einrichtung erfolgt zum Festpreis, danach zahlen Sie eine monatliche Betreuungspauschale — abhängig von Umfang und Teamgröße. Im Erstgespräch nennen wir Ihnen eine konkrete Zahl. Keine versteckten Kosten, keine offenen Beratungsprojekte."],
    ["Wie lange dauert die Einführung?", "Typisch sind zwei bis vier Wochen vom Erstgespräch bis zum Produktivbetrieb. Ihr Tagesgeschäft läuft währenddessen normal weiter — wir richten im Hintergrund ein und schulen Ihr Team in kurzen Terminen."],
    ["Funktioniert das mit unserer Software?", "In der Regel ja. Wir arbeiten mit Ihren bestehenden Tools — E-Mail, Office, ERP, CRM oder Branchensoftware. Ein Systemwechsel ist nicht nötig; die KI wird um Ihre Abläufe herum aufgebaut."],
    ["Gibt es eine Vertragsbindung?", "Die Betreuung ist monatlich kündbar. Wir überzeugen lieber durch Ergebnisse als durch Laufzeiten — deshalb berichten wir regelmäßig, was die Automatisierung konkret einspart."],
  ];

  return (
    <div className="antialiased" style={{ background: '#f8f7f5', color: '#1a1a1a' }}>

      {/* ── NAVIGATION ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b"
        style={{ background: 'rgba(248,247,245,0.95)', borderColor: '#e0dbd5', backdropFilter: 'blur(10px)' }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3 no-underline">
            <div className="h-8 w-8 rounded-lg" style={{ background: '#1a3d52' }} aria-hidden="true" />
            <span className="font-black tracking-tight text-base" style={{ color: '#1a1a1a' }}>veycron</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {[["Leistungen","#features"],["Branchen","#branchen"],["Ergebnisse","#cases"],["Ablauf","#ablauf"],["Häufige Fragen","#faq"],["Kontakt","#contact"]].map(([l,h])=>(
              <a key={l} href={h} className="transition-colors no-underline" style={{ color: '#666' }}
                onMouseEnter={e=>(e.currentTarget.style.color='#1a1a1a')} onMouseLeave={e=>(e.currentTarget.style.color='#666')}>{l}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href="#contact" className="rounded-lg px-5 py-2 text-sm font-semibold no-underline border transition"
              style={{ borderColor: '#e0dbd5', color: '#1a1a1a' }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background='#f0f0f0'; }} onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='transparent'; }}>
              Kostenlos anfragen
            </a>
            <a href="#contact" className="rounded-lg px-5 py-2 text-sm font-semibold text-white no-underline transition"
              style={{ background: '#157d5a' }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background='#126b4b'; }} onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='#157d5a'; }}>
              Termin vereinbaren
            </a>
          </div>
          <button onClick={() => setMobileOpen(v => !v)} aria-label="Menü"
            className="md:hidden rounded-lg border p-2 transition" style={{ borderColor: '#e0dbd5', color: '#666' }}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t px-4 py-4 flex flex-col gap-1" style={{ borderColor: '#e0dbd5', background: '#f8f7f5' }}>
            {[["Leistungen","#features"],["Branchen","#branchen"],["Ergebnisse","#cases"],["Ablauf","#ablauf"],["Häufige Fragen","#faq"],["Kontakt","#contact"]].map(([l,h])=>(
              <a key={l} href={h} onClick={()=>setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm no-underline transition" style={{ color: '#666' }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background='#f0f0f0'; }} onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='transparent'; }}>
                {l}
              </a>
            ))}
            <a href="#contact" onClick={()=>setMobileOpen(false)}
              className="mt-3 block rounded-lg px-5 py-2.5 text-center text-sm font-semibold text-white no-underline" style={{ background: '#157d5a' }}>
              Termin vereinbaren
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative py-32 sm:py-40 flex items-center" style={{ background: '#f8f7f5', minHeight: '88vh' }}>
        <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          {/* kicker */}
          <p className="fade-up-2 mb-6 text-xs font-bold uppercase tracking-widest" style={{ color: '#157d5a' }}>
            KI-Automatisierung für den Mittelstand
          </p>
          {/* headline */}
          <h1 className="fade-up-2 font-black tracking-tight leading-tight"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', letterSpacing: '-0.03em', color: '#1a1a1a', maxWidth: '95%' }}>
            Ihr Büro.<br />Automatisiert.
          </h1>
          {/* subline */}
          <p className="fade-up-3 mt-8 font-medium leading-relaxed" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: '#666', maxWidth: '720px' }}>
            Wir automatisieren Büroarbeit und bauen die Software, die Ihr Betrieb wirklich braucht —
            von KI-gestützten Prozessen über Webseiten bis zu individuellen Anwendungen.
            Ihr Team gewinnt bis zu 23 Stunden pro Woche zurück, ohne neue Software lernen zu müssen.
          </p>
          {/* CTAs */}
          <div className="fade-up-4 mt-12 flex flex-wrap gap-3">
            <a href="#contact" className="rounded-lg px-7 py-3.5 text-sm font-bold text-white no-underline transition"
              style={{ background: '#157d5a' }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background='#126b4b'; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='#157d5a'; }}>
              Kostenloses Erstgespräch
            </a>
            <a href="#features" className="rounded-lg px-7 py-3.5 text-sm font-bold no-underline border transition"
              style={{ borderColor: '#e0dbd5', color: '#1a1a1a' }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background='#f0f0f0'; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='transparent'; }}>
              Leistungen ansehen
            </a>
          </div>
          <p className="fade-up-4 mt-8 text-sm" style={{ color: '#999' }}>
            DSGVO-konform &nbsp;·&nbsp; Festpreis statt Tagessätze &nbsp;·&nbsp; Betreuung inklusive
          </p>
        </div>
      </section>

      {/* ── LOGOS ───────────────────────────────────────────────────── */}
      <section aria-label="Referenzen" className="py-12"
        style={{ background: '#f8f7f5', borderTop: '1px solid #e0dbd5', borderBottom: '1px solid #e0dbd5' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-center mb-8" style={{ color: '#999' }}>
            Unsere Standards
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16">
            {["DSGVO-konform", "Server in der EU", "Festpreis-Garantie", "Monatlich kündbar", "Made in Germany"].map((t) => (
              <span key={t} className="text-base font-bold tracking-tight" style={{ color: '#b0aba5' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section id="features" className="py-32 sm:py-40" style={{ background: '#f0f0f0' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#157d5a' }}>Leistungen</p>
          <h2 className="font-black tracking-tight mb-20" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em', color: '#1a1a1a' }}>
            Was wir für<br />Sie tun.
          </h2>
          <p className="text-base leading-relaxed -mt-14 mb-20" style={{ color: '#666', maxWidth: '640px' }}>
            Von der KI-Automatisierung Ihrer Büroprozesse bis zur individuellen Software —
            wir liefern alles aus einer Hand. Klicken Sie auf eine Leistung für Details,
            Beispiele und typische Ergebnisse.
          </p>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} title={f.title} desc={f.desc} icon={f.icon}
                onClick={() => setActiveFeature(f.title)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WARUM WIR ───────────────────────────────────────────────── */}
      <section id="warum" className="py-32 sm:py-40" style={{ background: '#f8f7f5' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#157d5a' }}>Warum wir</p>
          <h2 className="font-black tracking-tight mb-20" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em', color: '#1a1a1a' }}>
            Warum Betriebe<br />mit uns arbeiten.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["Festpreis statt Tagessätze", "Sie wissen vor dem Start, was die Einrichtung kostet und was die monatliche Betreuung. Keine offenen Beratungsprojekte, keine Nachträge."],
              ["DSGVO & Datenhoheit", "Ihre Daten bleiben Ihre Daten. Auftragsverarbeitung nach DSGVO, keine Weitergabe an Dritte, kein Training fremder Modelle mit Ihren Informationen."],
              ["Mittelstand statt Konzern-IT", "Wir sprechen die Sprache von Werkstatt, Praxis und Kanzlei — nicht die von IT-Abteilungen. Kein Projektjargon, keine 200-Seiten-Konzepte."],
              ["Läuft mit Ihren Tools", "E-Mail, Office, Ihr ERP oder Ihre Branchensoftware bleiben. Wir bauen die KI um Ihre bestehenden Systeme herum — kein Umstieg, keine Migration."],
              ["Ein fester Ansprechpartner", "Sie haben eine direkte Nummer und ein Team, das Ihren Betrieb kennt. Keine Hotline, keine Ticketsysteme, keine wechselnden Berater."],
              ["Messbare Ergebnisse", "Wir definieren vor dem Start, was sich verbessern soll — Stunden, Durchlaufzeiten, Fehlerquoten — und berichten regelmäßig, ob es eintritt."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl p-8 border" style={{ borderColor: '#e0dbd5', background: '#fff' }}>
                <h3 className="font-bold" style={{ color: '#1a1a1a' }}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#666' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRANCHEN ────────────────────────────────────────────────── */}
      <section id="branchen" className="py-32 sm:py-40" style={{ background: '#f0f0f0' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#157d5a' }}>Branchen</p>
          <h2 className="font-black tracking-tight mb-20" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em', color: '#1a1a1a' }}>
            Für wen wir arbeiten.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ["🔧", "Handwerk", "Metallbau, Elektro, SHK, Maler: Angebote, Stundenzettel und Baustellendokumentation — automatisiert, ohne dass jemand abends im Büro sitzt."],
              ["🏭", "Industrie & Produktion", "Auftragsabwicklung, Lieferscheine, Qualitätsdokumentation: Wir nehmen der Verwaltung die Routinearbeit ab, die Produktion läuft weiter wie bisher."],
              ["🩺", "Praxen", "Terminbestätigungen, Patientenformulare, Abrechnungsvorbereitung — DSGVO-konform und im Ton, den Ihre Patienten von Ihnen kennen."],
              ["⚖️", "Kanzleien", "Mandantenkorrespondenz, Fristen-Checklisten, Rechnungseingang: Die KI entlastet das Sekretariat, die inhaltliche Arbeit bleibt bei Ihnen."],
            ].map(([icon, title, desc]) => (
              <div key={title} className="rounded-xl p-8 border" style={{ borderColor: '#e0dbd5', background: '#fff' }}>
                <div className="text-3xl">{icon}</div>
                <h3 className="mt-3 font-bold" style={{ color: '#1a1a1a' }}>{title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#666' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS ──────────────────────────────────────────────── */}
      <section id="cases" className="py-32 sm:py-40" style={{ background: '#f8f7f5' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#157d5a' }}>Ergebnisse</p>
          <h2 className="font-black tracking-tight mb-20" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em', color: '#1a1a1a' }}>
            Ergebnisse, die zählen.
          </h2>
          <p className="text-sm -mt-14 mb-20" style={{ color: '#999' }}>
            Durchschnittliche Einsparungen aus KI-Implementierungen in Handwerks- und Industriebetrieben.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[['23h','Büroarbeit pro Woche gespart'],['–60%','Angebotserstellung schneller'],['+15%','schnellere Auftragsannahme']].map(([n,l])=>(
              <div key={l} className="text-center">
                <div className="font-black" style={{ fontSize: 'clamp(4rem, 7vw, 5.5rem)', color: '#157d5a', lineHeight: '1.1', marginBottom: '1rem' }}>{n}</div>
                <p className="text-lg" style={{ color: '#666', fontWeight: '500' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section id="faq" className="py-32 sm:py-40" style={{ background: '#f8f7f5' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#157d5a' }}>FAQ</p>
          <h2 className="font-black tracking-tight mb-20" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em', color: '#1a1a1a' }}>
            Häufige Fragen.
          </h2>
          <div className="space-y-2">
            {faqs.map(([q, a], i) => (
              <div key={i} className="rounded-lg overflow-hidden border" style={{ borderColor: '#e0dbd5' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition"
                  style={{ background: openFaq === i ? '#f0f0f0' : 'transparent' }}
                  onMouseEnter={e=>{ if(openFaq!==i)(e.currentTarget as HTMLElement).style.background='#f0f0f0'; }}
                  onMouseLeave={e=>{ if(openFaq!==i)(e.currentTarget as HTMLElement).style.background='transparent'; }}>
                  <span className="font-semibold" style={{ color: '#1a1a1a' }}>{q}</span>
                  <span className="ml-4 shrink-0 text-xl font-light transition-transform" style={{ color: '#157d5a', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
                </button>
                <div className={`faq-body${openFaq === i ? ' open' : ''}`}>
                  <div className="faq-body-inner px-6 pb-5 pt-0">
                    <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABLAUF ──────────────────────────────────────────────────── */}
      <section id="ablauf" className="py-32 sm:py-40" style={{ background: '#f0f0f0' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: '#157d5a' }}>Ablauf</p>
          <h2 className="font-black tracking-tight mb-20" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em', color: '#1a1a1a' }}>
            So arbeiten wir.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {[
              ["01", "Erstgespräch", "Wir analysieren Ihren Bürobetrieb — kostenlos, 45 Minuten, remote oder vor Ort."],
              ["02", "Einrichtung", "Wir konfigurieren die KI für Ihre Prozesse. Ihr Team arbeitet wie gewohnt — nur schneller."],
              ["03", "Betrieb & Betreuung", "Wir bleiben. Monatliche Anpassungen, direkter Ansprechpartner, keine versteckten Kosten."],
            ].map(([num, title, desc]) => (
              <div key={num}>
                <div className="font-black" style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', lineHeight: '1', color: '#d5d0ca', letterSpacing: '-0.02em' }}>{num}</div>
                <h3 className="mt-6 text-lg font-bold" style={{ color: '#1a1a1a' }}>{title}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#666' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────── */}
      <section id="contact" className="py-32 sm:py-40" style={{ background: '#f8f7f5' }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: '#e0dbd5', background: '#fff' }}>
            <div className="grid lg:grid-cols-2">
              {/* left */}
              <div className="p-10 lg:p-14 border-r" style={{ borderColor: '#e0dbd5' }}>
                <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', letterSpacing: '-0.02em', color: '#1a1a1a' }}>
                  Erste Stunde kostenlos.
                </h2>
                <p className="mt-4 text-base leading-relaxed" style={{ color: '#555' }}>
                  Wir analysieren Ihren Bürobetrieb und zeigen konkret, wo die KI Zeit spart.
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    "Antwort innerhalb von 24 Stunden",
                    "Keine versteckten Kosten",
                    "Sie kontrollieren alles — wir passen an.",
                  ].map((text) => (
                    <div key={text} className="flex items-center gap-3 text-sm" style={{ color: '#555' }}>
                      <span style={{ color: '#157d5a' }}>✓</span>{text}
                    </div>
                  ))}
                </div>
              </div>
              {/* right - form */}
              <div className="p-8 lg:p-10" style={{ background: '#f8f7f5' }}>
                <form ref={formRef} onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                  {formStatus === 'success' ? (
                    <div className="flex flex-col items-center gap-4 py-12 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold" style={{ background: 'rgba(21, 125, 90, 0.1)', color: '#157d5a' }}>✓</div>
                      <p className="font-bold" style={{ color: '#1a1a1a' }}>Danke! Wir melden uns bald.</p>
                      <p className="text-sm" style={{ color: '#999' }}>Wir passen den Termin auf Ihren Kalender an.</p>
                      <button type="button" onClick={() => setFormStatus('idle')} className="mt-2 text-sm no-underline" style={{ color: '#157d5a' }}>Andere Nachricht</button>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="cf-name" className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#999' }}>Name</label>
                          <input id="cf-name" required value={formName} onChange={e=>setFormName(e.target.value)}
                            className="rounded-lg border px-4 py-2.5 text-sm outline-none transition"
                            style={{ borderColor: '#e0dbd5', color: '#1a1a1a' }}
                            onFocus={e=>(e.currentTarget.style.borderColor='#157d5a')}
                            onBlur={e=>(e.currentTarget.style.borderColor='#e0dbd5')}
                            placeholder="Ihr Name" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="cf-email" className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#999' }}>E-Mail</label>
                          <input id="cf-email" type="email" required value={formEmail} onChange={e=>setFormEmail(e.target.value)}
                            className="rounded-lg border px-4 py-2.5 text-sm outline-none transition"
                            style={{ borderColor: '#e0dbd5', color: '#1a1a1a' }}
                            onFocus={e=>(e.currentTarget.style.borderColor='#157d5a')}
                            onBlur={e=>(e.currentTarget.style.borderColor='#e0dbd5')}
                            placeholder="name@firma.de" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="cf-msg" className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#999' }}>Kurze Nachricht</label>
                        <textarea id="cf-msg" rows={4} required value={formMessage} onChange={e=>setFormMessage(e.target.value)}
                          className="rounded-lg border px-4 py-2.5 text-sm outline-none transition resize-none"
                          style={{ borderColor: '#e0dbd5', color: '#1a1a1a' }}
                          onFocus={e=>(e.currentTarget.style.borderColor='#157d5a')}
                          onBlur={e=>(e.currentTarget.style.borderColor='#e0dbd5')}
                          placeholder="z.B.: Haben Sie Zeit für eine Beratung zur Angebotserstellung?" />
                      </div>
                      {formStatus === 'error' && (
                        <p className="rounded-lg border px-4 py-2.5 text-sm" style={{ borderColor: '#f5d5d5', background: 'rgba(220, 38, 38, 0.05)', color: '#c92a2a' }}>{formError}</p>
                      )}
                      <button type="submit" disabled={formStatus === 'loading'}
                        className="rounded-lg py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60"
                        style={{ background: '#157d5a' }}
                        onMouseEnter={e=>{ if(formStatus!=='loading')(e.currentTarget as HTMLElement).style.background='#126b4b'; }}
                        onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='#157d5a'; }}>
                        {formStatus === 'loading' ? 'Wird gesendet…' : 'Termin anfragen'}
                      </button>
                      <p className="text-xs text-center" style={{ color: '#999' }}>
                        Mit dem Absenden akzeptieren Sie die{' '}
                        <a href="/datenschutz" className="no-underline" style={{ color: '#157d5a' }}>Datenschutzhinweise</a>.
                      </p>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="py-10" style={{ background: '#f0f0f0', borderTop: '1px solid #e0dbd5' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg" style={{ background: '#1a3d52' }} />
                <span className="font-black tracking-tight" style={{ color: '#1a1a1a' }}>veycron</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: '#999', maxWidth: '280px' }}>
                Wir automatisieren Büroprozesse in Handwerks- und Industriebetrieben — DSGVO-konform, zum Festpreis, mit laufender Betreuung.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#999' }}>Navigation</p>
              <div className="flex flex-col gap-2 text-sm">
                {[["Leistungen","#features"],["Branchen","#branchen"],["Ergebnisse","#cases"],["Ablauf","#ablauf"],["Häufige Fragen","#faq"],["Kontakt","#contact"]].map(([l,h])=>(
                  <a key={l} href={h} className="no-underline transition-colors" style={{ color: '#999' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#1a1a1a')} onMouseLeave={e=>(e.currentTarget.style.color='#999')}>{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#999' }}>Rechtliches</p>
              <div className="flex flex-col gap-2 text-sm">
                {[["Impressum","/impressum"],["Datenschutz","/datenschutz"]].map(([l,h])=>(
                  <a key={l} href={h} className="no-underline transition-colors" style={{ color: '#999' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#1a1a1a')} onMouseLeave={e=>(e.currentTarget.style.color='#999')}>{l}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t" style={{ borderColor: '#e0dbd5' }}>
            <p className="text-sm" style={{ color: '#999' }}>© {new Date().getFullYear()} veycron. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>

      {/* ── MODAL ───────────────────────────────────────────────────── */}
      {activeFeature && <FeatureModal featureKey={activeFeature} onClose={closeModal} />}
    </div>
  );
}
