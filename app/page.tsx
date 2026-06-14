'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

/* ── FEATURE MODAL DATA ─────────────────────────────────────────────── */
type FeatureDetail = {
  title: string; subtitle: string; intro: string;
  deliverables: { title: string; desc: string }[];
  usecases: string[]; techBadges: string[];
  metrics: { num: string; label: string }[];
  ctaText: string;
};

const featureDetails: Record<string, FeatureDetail> = {
  "Cloud & Platform Engineering": {
    title: "Cloud & Platform Engineering", subtitle: "Solide Fundamente. Reibungslose Entwicklung.",
    intro: "Eine Cloud-Plattform ist mehr als Infrastruktur — sie ist das Betriebssystem Eurer Organisation. Wir designen und bauen Cloud Foundations, die Teams schnell, sicher und eigenständig liefern lassen.",
    deliverables: [
      { title: "Landing Zones & Multi-Account-Setup", desc: "Skalierbare AWS/Azure-Landingzones mit Netzwerk, Identitäten, Guardrails und Policy-as-Code — reproduzierbar und auditierbar." },
      { title: "Internal Developer Portals (IDP)", desc: "Self-Service-Plattformen mit Backstage, GitOps-Workflows und Golden Paths. Entwickler deployen eigenständig — ohne Ops-Flaschenhals." },
      { title: "Infrastructure as Code", desc: "Vollständig automatisierte Infrastruktur mit Terraform und Ansible. Kein Snowflake-Server, keine manuelle Konfiguration." },
      { title: "Observability & Kostenkontrolle", desc: "Zentrales Monitoring, Alerting und FinOps-Dashboards. Teams sehen Kosten, Latenz und Fehlerraten in Echtzeit." },
    ],
    usecases: ["Multi-Account-Landingzone für wachsendes SaaS-Unternehmen aufgebaut", "On-Premise-Workloads ohne Betriebsunterbrechung in die Cloud migriert", "Internal Developer Portal mit Self-Service-Deployments eingeführt", "Cloud-Kosten um 40 % reduziert durch Rightsizing & FinOps"],
    techBadges: ["AWS", "Azure", "Terraform", "Pulumi", "Kubernetes", "ArgoCD", "Backstage", "GitHub Actions", "Grafana", "Prometheus", "OPA / Kyverno"],
    metrics: [{ num: "–50%", label: "Cloud-Kosten durch FinOps" }, { num: "10×", label: "schnellere Deployments" }, { num: "99,99%", label: "Verfügbarkeit" }],
    ctaText: "Cloud-Architektur besprechen →",
  },
  "Data Platform & Lakehouse": {
    title: "Data Platform & Lakehouse", subtitle: "Daten, die Entscheidungen antreiben.",
    intro: "Wer Daten nicht versteht, verliert. Wir bauen Data Platforms, die Rohdaten in verlässliche, zugängliche und messbare Assets verwandeln — von der Ingest-Pipeline bis zum Self-Service Analytics Layer.",
    deliverables: [
      { title: "Lakehouse-Architektur", desc: "Offene Tabellenformate (Iceberg, Delta Lake), entkoppelte Storage- und Compute-Layer, ACID-Transaktionen — skalierbar von GB bis PB." },
      { title: "Batch & Streaming Pipelines", desc: "Resiliente Datenpipelines mit Apache Spark, Flink und dbt. SLAs, Data Quality Gates und automatisches Alerting." },
      { title: "Data Governance & Catalog", desc: "Zentraler Data Catalog, Lineage-Tracking, Klassifizierung und Access Controls. Teams wissen, wo Daten herkommen." },
      { title: "Reverse ETL & ML-Features", desc: "Aktivierung von Daten direkt in operative Systeme. Feature Store für konsistente ML-Features in Training und Inference." },
    ],
    usecases: ["Lakehouse als Single Source of Truth für 5 Geschäftsbereiche", "Legacy-Data-Warehouse zu modernem Open-Table-Format migriert", "Echtzeit-Streaming-Pipeline für Fraud Detection < 500ms", "Self-Service Analytics für Business-Teams ohne SQL"],
    techBadges: ["Apache Spark", "Apache Flink", "dbt", "Iceberg / Delta Lake", "Kafka", "Airflow", "Great Expectations", "Unity Catalog", "Snowflake", "BigQuery", "Databricks"],
    metrics: [{ num: "1 Quelle", label: "statt 12 Datensilos" }, { num: "<500ms", label: "Streaming-Latenz" }, { num: "–80%", label: "manuelle Aufbereitung" }],
    ctaText: "Data Platform besprechen →",
  },
  "Applied AI/ML & GenAI": {
    title: "Applied AI/ML & GenAI", subtitle: "KI, die im Unternehmen wirklich funktioniert.",
    intro: "GenAI-Demos gibt es genug. Wir bauen KI-Systeme, die in der Produktion stabil laufen, messbare Ergebnisse liefern und in bestehende Prozesse integriert werden — vom RAG-Service bis zum Computer-Vision-System.",
    deliverables: [
      { title: "RAG-Systeme & LLM-Applikationen", desc: "Firmeninterne KI auf Basis eigener Daten. Keine Datenweitergabe, keine Halluzinationen ohne Quellenangabe, DSGVO-konform." },
      { title: "Computer Vision & NLP", desc: "Objekterkennung, Klassifizierung, OCR, Textzusammenfassung — maßgeschneidert, Training auf eigenen Daten." },
      { title: "Feature Stores & Online Inference", desc: "Konsistente Features für Training und Produktion. Low-Latency Inference mit sub-100ms Response-Zeiten." },
      { title: "Evaluations & Guardrails", desc: "Systematisches Evaluations-Framework für LLM-Outputs. Guardrails gegen Jailbreaks und Datenlecks — before production." },
    ],
    usecases: ["KI-Assistent für interne Wissensdatenbank — 80 % weniger Suchzeit", "Automatisierte Vertragsprüfung für Legal-Teams", "Computer-Vision für Qualitätskontrolle in der Produktion", "Kundensupport-Bot löst 70 % der Anfragen ohne Eskalation"],
    techBadges: ["LangChain / LangGraph", "OpenAI / Anthropic", "Hugging Face", "PyTorch", "RAG / Vector DB", "Pinecone / Weaviate", "Fine-Tuning", "Triton Inference", "BentoML", "MLflow"],
    metrics: [{ num: "–80%", label: "Bearbeitungszeit" }, { num: "<100ms", label: "Inference-Latenz" }, { num: "6–10 Wo.", label: "bis Produktiveinsatz" }],
    ctaText: "KI-Projekt anfragen →",
  },
  "MLOps & LLMOps": {
    title: "MLOps & LLMOps", subtitle: "Modelle, die in der Produktion liefern.",
    intro: "Ein Modell, das nur im Notebook funktioniert, hat keinen Wert. Wir bauen die Infrastruktur, die ML- und LLM-Modelle zuverlässig in die Produktion bringt — mit vollständiger Reproduzierbarkeit, Monitoring und CI/CD.",
    deliverables: [
      { title: "ML-Pipelines & CI/CD für Modelle", desc: "Automatisierte Trainings-, Test- und Deployment-Pipelines. Jede Modellversion ist reproduzierbar und rollback-fähig." },
      { title: "Model Monitoring & Drift Detection", desc: "Kontinuierliche Überwachung von Modellqualität und Concept Drift. Alerting bevor die Genauigkeit stilll sinkt." },
      { title: "Prompt Engineering & Guardrails", desc: "Systematisches Prompt-Management, Versionierung und A/B-Testing. Guardrails gegen unerwünschte Ausgaben." },
      { title: "Model Registry & Governance", desc: "Zentrale Registry mit Metadaten, Lineage und Genehmigungsworkflows. Compliance-gerechte Dokumentation." },
    ],
    usecases: ["Vollständige MLOps-Plattform für Team von 10 Data Scientists", "Automatisiertes Retraining bei Drift ohne manuelle Intervention", "LLMOps-Stack für RAG-App mit 100k+ täglichen Anfragen", "Manuelle Modell-Deployments durch CI/CD-Pipeline abgelöst"],
    techBadges: ["MLflow", "Kubeflow", "ZenML", "Evidently AI", "Arize", "W&B", "DVC", "Seldon / BentoML", "Argo Workflows", "Feast", "Prometheus / Grafana"],
    metrics: [{ num: "–90%", label: "Deployment-Aufwand" }, { num: "Echtzeit", label: "Drift-Erkennung" }, { num: "100%", label: "Reproduzierbarkeit" }],
    ctaText: "MLOps-Infrastruktur aufbauen →",
  },
  "Modernisierung & Microservices": {
    title: "Modernisierung & Microservices", subtitle: "Legacy überwinden. Zukunft bauen.",
    intro: "Monolithen bremsen. Aber ein Big-Bang-Rewrite ist riskant. Wir modernisieren schrittweise nach dem Strangler-Fig-Muster — ohne Betriebsunterbrechung, ohne verlorene Daten.",
    deliverables: [
      { title: "Domain-Driven Design (DDD)", desc: "Klare Bounded Contexts, Ubiquitous Language und saubere Service-Boundaries. Software, die die Sprache des Unternehmens spricht." },
      { title: "Event-Driven Architecture", desc: "Entkoppelte Microservices über Kafka. Services kommunizieren asynchron und tolerieren Ausfälle anderer Services." },
      { title: "API-Design & Strangler-Fig", desc: "Schrittweise Migration: neue Features als Microservices, alter Monolith läuft parallel. Kein Risiko, kein einmaliger Cutover." },
      { title: "Skalierbare Backend-Systeme", desc: "Hochperformante APIs in TypeScript, Go oder Rust. CQRS, Event Sourcing für komplexe Domänen mit Audit-Anforderungen." },
    ],
    usecases: ["PHP-Monolith in unabhängige Microservices migriert", "Event-Driven Architecture für komplexes E-Commerce-System", "API-Modernisierung REST → GraphQL mit voller Abwärtskompatibilität", "Strangler-Fig mit parallelem Betrieb und schrittweiser Umstellung"],
    techBadges: ["TypeScript / Node.js", "Go", "Rust", "Apache Kafka", "gRPC / GraphQL", "Kubernetes", "Postgres / Redis", "CQRS / Event Sourcing", "OpenAPI", "Protobuf"],
    metrics: [{ num: "10×", label: "Performance vs. Legacy" }, { num: "–70%", label: "Deployment-Zeit" }, { num: "0", label: "Ausfälle während Migration" }],
    ctaText: "Modernisierung planen →",
  },
  "Security & Compliance": {
    title: "Security & Compliance", subtitle: "Sicherheit, die von Anfang an eingebaut ist.",
    intro: "Security ist kein nachträgliches Audit. Wir integrieren Zero-Trust-Prinzipien, Secrets-Management und Compliance-Anforderungen von Tag 1 in Architektur und Entwicklungsprozess.",
    deliverables: [
      { title: "Zero-Trust-Architektur", desc: "Kein implizites Vertrauen — weder intern noch extern. Mikrosegmentierung, identitätsbasierter Zugriff, kontinuierliche Verifikation." },
      { title: "Secrets & IAM Management", desc: "Vault oder AWS Secrets Manager für zentrales Secrets-Management. Least-Privilege-IAM, automatisierte Rotation, Audit-Logging." },
      { title: "Threat Modeling & Shift-Left", desc: "STRIDE-Threat-Modeling in der Design-Phase. SAST/DAST in der CI/CD-Pipeline. Security als Teil des Dev-Workflows." },
      { title: "DSGVO & Compliance-as-Code", desc: "Privacy-by-Design, Datenklassifizierung und automatisierte Compliance-Checks mit OPA/Kyverno. Audit-Trails für Behörden." },
    ],
    usecases: ["Zero-Trust für reguliertes Finanzunternehmen (BaFin-konform)", "DSGVO-konforme Datenplattform mit Audit-Trail und On-demand-Löschung", "Shift-Left Security: SAST, Container-Scanning, IaC-Checks in CI/CD", "Secrets-Management mit automatischer Rotation für 50+ Microservices"],
    techBadges: ["HashiCorp Vault", "AWS IAM / STS", "OPA / Kyverno", "Trivy / Snyk", "Falco", "CIS Benchmarks", "STRIDE", "ISO 27001", "DSGVO / BDSG", "SOC 2", "NIS-2"],
    metrics: [{ num: "0", label: "kritische CVEs durch Shift-Left" }, { num: "100%", label: "DSGVO-konforme Verarbeitung" }, { num: "Echtzeit", label: "Bedrohungserkennung" }],
    ctaText: "Security-Assessment anfragen →",
  },
};

/* ── FEATURE MODAL ───────────────────────────────────────────────────── */
function FeatureModal({ featureKey, onClose }: { featureKey: string; onClose: () => void }) {
  const d = featureDetails[featureKey];
  if (!d) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label={d.title}
        className="modal-slide fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl">
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-600">veycron / {d.title}</span>
          <button onClick={onClose} aria-label="Schließen"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 transition">✕</button>
        </div>
        {/* body */}
        <div className="flex-1 px-6 py-8 sm:px-10">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-zinc-950">{d.title}</h2>
          <p className="mt-1 font-semibold text-violet-600">{d.subtitle}</p>
          <p className="mt-5 border-l-2 border-violet-500 pl-4 text-zinc-600 leading-relaxed">{d.intro}</p>
          {/* deliverables */}
          <div className="mt-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Was wir konkret liefern</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {d.deliverables.map((item) => (
                <div key={item.title} className="rounded-xl border border-zinc-200 p-4">
                  <h4 className="font-semibold text-zinc-900 text-sm">{item.title}</h4>
                  <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* usecases */}
          <div className="mt-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Typische Einsatzszenarien</p>
            <ul className="space-y-2">
              {d.usecases.map((u) => (
                <li key={u} className="flex gap-3 text-sm text-zinc-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />{u}
                </li>
              ))}
            </ul>
          </div>
          {/* tech */}
          <div className="mt-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Technologien</p>
            <div className="flex flex-wrap gap-2">
              {d.techBadges.map((b) => (
                <span key={b} className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">{b}</span>
              ))}
            </div>
          </div>
          {/* metrics */}
          <div className="mt-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Typische Ergebnisse</p>
            <div className="grid grid-cols-3 gap-3">
              {d.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-zinc-200 p-4 text-center">
                  <div className="text-xl font-black tracking-tight text-zinc-950">{m.num}</div>
                  <div className="mt-1 text-xs text-zinc-500 leading-tight">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* cta */}
          <div className="mt-10 rounded-2xl bg-zinc-950 p-6 text-center">
            <p className="text-zinc-400 text-sm mb-4">Bereit loszulegen? Wir antworten innerhalb von 24&nbsp;Stunden.</p>
            <a href="#contact" onClick={onClose}
              className="inline-block rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500 transition">
              {d.ctaText}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── BENTO CARD ──────────────────────────────────────────────────────── */
function BentoCard({
  title, desc, accent, wide, onClick,
}: { title: string; desc: string; accent: string; wide?: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bento-card group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 flex flex-col gap-4${wide ? ' lg:col-span-4' : ' lg:col-span-2'}`}
    >
      {/* accent line */}
      <div className="h-0.5 w-10 rounded-full" style={{ background: accent }} />
      {/* icon letter */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-sm font-black"
        style={{ background: accent }}>
        {title.slice(0, 1)}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-zinc-950 leading-snug">{title}</h3>
        <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{desc}</p>
      </div>
      <button className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
        style={{ color: accent }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}>
        Mehr erfahren
        <span className="transition-transform group-hover:translate-x-1 inline-block">→</span>
      </button>
      {/* hover glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-15"
        style={{ background: accent }} />
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
    } catch { setFormError('Netzwerkfehler — bitte prüfe deine Verbindung.'); setFormStatus('error'); }
  }

  const features: { title: string; desc: string; accent: string; wide?: boolean }[] = [
    { title: "Cloud & Platform Engineering", desc: "Foundations, Landing Zones, IDP/Developer Portals, GitOps, IaC.", accent: "#7c3aed", wide: true },
    { title: "Data Platform & Lakehouse", desc: "Batch/Streaming, Governance, Quality, Catalog, Reverse ETL.", accent: "#2563eb" },
    { title: "Applied AI/ML & GenAI", desc: "LLMs/RAG, CV/NLP, Feature Stores, Online Inference, Evaluation.", accent: "#8b5cf6" },
    { title: "MLOps & LLMOps", desc: "Pipelines, CI/CD für Modelle, Monitoring, Prompt/Guardrails.", accent: "#a855f7" },
    { title: "Modernisierung & Microservices", desc: "Domain-Driven Design, Eventing, API-Design, Strangler-Figur.", accent: "#ec4899" },
    { title: "Security & Compliance", desc: "Zero Trust, Secrets/KMS, IAM, Threat Modeling, DSGVO-by-default.", accent: "#f59e0b", wide: true },
  ];

  const faqs = [
    ["Welche Clouds unterstützt ihr?", "AWS und Azure — Cloud-neutral, mit IaC und GitOps für reproduzierbare Umgebungen."],
    ["Wie startet ein Projekt?", "Mit einem Discovery-Sprint: Ziele, Architektur, Roadmap und messbare Outcomes. Typisch 2–4 Wochen."],
    ["Wie integriert ihr AI/ML?", "Über MLOps/LLMOps: Datenqualität, Trainings-/Inference-Pipelines, Evaluations, Monitoring & Guardrails."],
    ["Security & Compliance?", "Security-by-Design, Least Privilege/IAM, Secrets/KMS, Audit-Trails, DSGVO-Konformität von Tag 1."],
    ["Übernehmt ihr den Betrieb?", "Ja — SRE-Modell mit SLOs/Error Budgets und kontinuierlicher Kosten- und Leistungsoptimierung."],
  ];

  return (
    <div className="antialiased" style={{ background: '#09090b', color: '#fafafa' }}>

      {/* ── NAVIGATION ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b"
        style={{ background: 'rgba(9,9,11,0.85)', borderColor: '#27272a', backdropFilter: 'blur(16px)' }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3 text-white no-underline">
            <div className="h-8 w-8 rounded-xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)' }} aria-hidden="true" />
            <span className="font-black tracking-tight text-lg">veycron</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {[["Kompetenzen","#features"],["Lösungen","#solutions"],["Referenzen","#cases"],["Kontakt","#contact"]].map(([l,h])=>(
              <a key={l} href={h} className="transition-colors no-underline" style={{ color: '#a1a1aa' }}
                onMouseEnter={e=>(e.currentTarget.style.color='#fafafa')} onMouseLeave={e=>(e.currentTarget.style.color='#a1a1aa')}>{l}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href="#contact" className="rounded-xl px-4 py-2 text-sm font-semibold text-white border transition no-underline"
              style={{ borderColor: '#3f3f46' }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background='#27272a'; }} onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='transparent'; }}>
              Anfragen
            </a>
            <a href="#contact" className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition no-underline"
              style={{ background: '#7c3aed' }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background='#6d28d9'; }} onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='#7c3aed'; }}>
              Projekt starten
            </a>
          </div>
          <button onClick={() => setMobileOpen(v => !v)} aria-label="Menü"
            className="md:hidden rounded-xl border p-2 transition" style={{ borderColor: '#3f3f46', color: '#a1a1aa' }}>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t px-4 py-4 flex flex-col gap-1" style={{ borderColor: '#27272a', background: '#09090b' }}>
            {[["Kompetenzen","#features"],["Lösungen","#solutions"],["Referenzen","#cases"],["Kontakt","#contact"]].map(([l,h])=>(
              <a key={l} href={h} onClick={()=>setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm no-underline transition" style={{ color: '#a1a1aa' }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background='#18181b'; }} onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='transparent'; }}>
                {l}
              </a>
            ))}
            <a href="#contact" onClick={()=>setMobileOpen(false)}
              className="mt-3 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-white no-underline" style={{ background: '#7c3aed' }}>
              Projekt starten
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#09090b' }}>
        {/* gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="orb-a absolute" style={{ top:'10%', left:'15%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)', filter:'blur(48px)' }} />
          <div className="orb-b absolute" style={{ bottom:'15%', right:'10%', width:'450px', height:'450px', borderRadius:'50%', background:'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)', filter:'blur(48px)' }} />
          <div className="orb-c absolute" style={{ top:'55%', left:'55%', width:'320px', height:'320px', borderRadius:'50%', background:'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', filter:'blur(40px)' }} />
        </div>
        {/* dot grid */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage:'radial-gradient(circle, rgba(113,113,122,0.35) 1px, transparent 1px)', backgroundSize:'28px 28px' }} />
        {/* vignette */}
        <div className="pointer-events-none absolute inset-0" style={{ background:'radial-gradient(ellipse at center, transparent 40%, rgba(9,9,11,0.8) 100%)' }} />

        <div className="relative mx-auto max-w-7xl w-full px-4 py-32 sm:px-6 lg:px-8">
          {/* badge */}
          <div className="fade-up-1 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{ borderColor: 'rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.1)' }}>
            <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background:'#a78bfa' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color:'#c4b5fd' }}>Cloud · Data · AI Engineering</span>
          </div>
          {/* headline */}
          <h1 className="fade-up-2 font-black tracking-tight leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.035em' }}>
            Engineering für<br />
            <span style={{ background: 'linear-gradient(90deg, #a78bfa 0%, #f0abfc 50%, #f9a8d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Cloud, Data & AI.
            </span>
          </h1>
          {/* sub */}
          <p className="fade-up-3 mt-6 max-w-2xl leading-relaxed" style={{ color: '#a1a1aa', fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
            Wir bauen Plattformen, Daten- und ML-Lösungen: Cloud Foundations & Landing Zones,
            Lakehouse/Data Platform, GenAI/LLM-Anwendungen — sicher, skalierbar, messbar.
          </p>
          {/* CTAs */}
          <div className="fade-up-4 mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="rounded-xl px-7 py-3.5 text-sm font-bold text-white no-underline transition-all"
              style={{ background: '#7c3aed', boxShadow: '0 0 32px rgba(124,58,237,0.35)' }}
              onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.background='#6d28d9'; el.style.boxShadow='0 0 48px rgba(124,58,237,0.5)'; }}
              onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.background='#7c3aed'; el.style.boxShadow='0 0 32px rgba(124,58,237,0.35)'; }}>
              Projekt besprechen
            </a>
            <a href="#features" className="rounded-xl border px-7 py-3.5 text-sm font-bold no-underline transition-all"
              style={{ borderColor: '#3f3f46', color: '#d4d4d8' }}
              onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.background='#18181b'; el.style.borderColor='#52525b'; }}
              onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.background='transparent'; el.style.borderColor='#3f3f46'; }}>
              Kompetenzen ansehen
            </a>
          </div>
          {/* stats */}
          <div className="fade-up-4 mt-20 flex gap-12 border-t pt-10" style={{ borderColor: '#27272a', maxWidth: '420px' }}>
            {[['50+','Projekte'],['6','Branchen'],['10+','Jahre Expertise']].map(([n,l])=>(
              <div key={l}>
                <div className="text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>{n}</div>
                <div className="mt-1 text-xs font-medium" style={{ color: '#71717a' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOGO BAR ────────────────────────────────────────────────── */}
      <div className="border-y" style={{ background: '#111113', borderColor: '#1c1c1f' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest" style={{ color: '#52525b' }}>
            Vertrauen von führenden Unternehmen
          </p>
          <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-7 rounded-lg" style={{ background: '#27272a' }} aria-hidden="true" />
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES BENTO ──────────────────────────────────────────── */}
      <section id="features" className="bg-white py-24 text-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-violet-600">Kompetenzen</div>
            <h2 className="font-black tracking-tight text-zinc-950" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}>
              Klar. Technisch. Wirksam.
            </h2>
            <p className="mt-4 max-w-lg text-zinc-500" style={{ fontSize: '1.1rem' }}>
              Von Cloud-Fundamenten bis GenAI-Anwendungen — Kompetenzen, die Ergebnisse liefern.
            </p>
          </div>

          {/* Bento grid: 6 cols on lg */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
            {features.map((f) => (
              <BentoCard key={f.title} title={f.title} desc={f.desc} accent={f.accent} wide={f.wide}
                onClick={() => setActiveFeature(f.title)} />
            ))}
            {/* CTA tile */}
            <div className="lg:col-span-2 rounded-2xl p-7 flex flex-col justify-between"
              style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #1a0533 100%)' }}>
              <div>
                <div className="mb-3 h-0.5 w-10 rounded-full" style={{ background: '#a78bfa' }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>Jetzt starten</p>
                <h3 className="mt-3 text-xl font-black text-white leading-tight">Bereit für den nächsten Schritt?</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#c4b5fd' }}>
                  Wir analysieren eure Situation und liefern einen konkreten Technologiefahrplan.
                </p>
              </div>
              <a href="#contact" className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white no-underline transition-all"
                style={{ background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.3)' }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background='rgba(167,139,250,0.3)'; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='rgba(167,139,250,0.2)'; }}>
                Gespräch anfragen <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDY ──────────────────────────────────────────────── */}
      <section id="cases" className="py-24" style={{ background: '#111113' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#7c3aed' }}>Case Study</div>
            <h2 className="font-black tracking-tight text-white" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em' }}>
              Von Monolith zu AI-fähiger Plattform
            </h2>
          </div>
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="leading-relaxed" style={{ color: '#a1a1aa' }}>
                Migration auf Cloud-Foundations, Aufbau einer Data-Plattform und Einführung von MLOps.
                Ergebnis: schnellere Releases, reproduzierbare Modelle, bessere Observability.
              </p>
              <ul className="mt-6 space-y-3">
                {["Platform Engineering: Developer Portal & Golden Paths","Data Platform: Lakehouse, Catalog, Quality Gates","AI: RAG-Service mit Evaluations & Guardrails"].map(item=>(
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#a1a1aa' }}>
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#7c3aed' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[['–60%','Time-to-Market'],['3×','Deployment Freq.'],['99,9%','Uptime SLA']].map(([n,l])=>(
                  <div key={l} className="rounded-xl p-4 text-center" style={{ background: '#1c1c1f', border: '1px solid #27272a' }}>
                    <div className="text-2xl font-black text-white">{n}</div>
                    <div className="mt-1 text-xs" style={{ color: '#71717a' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #27272a' }}>
              <div className="aspect-[16/10] w-full overflow-hidden" style={{ background: '#1c1c1f' }}>
                <img src="/img/img_website.png" alt="Architekturdiagramm" className="h-full w-full object-cover opacity-90" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS ───────────────────────────────────────────────── */}
      <section id="solutions" className="bg-white py-24 text-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-violet-600">Lösungen</div>
            <h2 className="font-black tracking-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.02em' }}>
              End-to-End. Strategie bis Betrieb.
            </h2>
            <p className="mt-3 text-zinc-500">Mit klaren Metriken: Time-to-Market, Zuverlässigkeit, Kosten, Risiko.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Cloud Foundations", "Multi-Account-Setup, Netzwerk, Identitäten, Observability, Kostenkontrolle.", "#7c3aed"],
              ["Data Platform", "Lakehouse, Governance & Lineage, Self-Service Data, Realtime & ML-Features.", "#2563eb"],
              ["GenAI & LLM-Apps", "RAG, Tools/Agents, Evaluations, Guardrails, Kosten/Latency-Optimierung.", "#8b5cf6"],
              ["Platform Engineering", "Interne Dev-Plattform (IDP), Golden Paths, Templates, Self-Service.", "#a855f7"],
              ["SRE & DevOps", "SLIs/SLOs, Error Budgets, Incident Response, Release-Automatisierung.", "#ec4899"],
              ["Security by Design", "Threat Modeling, Shift-Left, Secrets/KMS, DSGVO, Privacy ML.", "#f59e0b"],
            ].map(([t, d, c]) => (
              <div key={t} className="rounded-2xl border border-zinc-200 p-6 transition hover:-translate-y-1 hover:shadow-lg hover:border-zinc-300">
                <div className="mb-4 h-0.5 w-8 rounded-full" style={{ background: c }} />
                <h3 className="font-bold text-zinc-950">{t}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#09090b' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#7c3aed' }}>FAQ</div>
            <h2 className="font-black text-white tracking-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-0.02em' }}>
              Häufige Fragen.
            </h2>
          </div>
          <div className="space-y-2">
            {faqs.map(([q, a], i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border: '1px solid #27272a' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition"
                  style={{ background: openFaq === i ? '#111113' : 'transparent' }}
                  onMouseEnter={e=>{ if(openFaq!==i)(e.currentTarget as HTMLElement).style.background='#111113'; }}
                  onMouseLeave={e=>{ if(openFaq!==i)(e.currentTarget as HTMLElement).style.background='transparent'; }}>
                  <span className="font-semibold text-white">{q}</span>
                  <span className="ml-4 shrink-0 text-xl font-light transition-transform" style={{ color: '#7c3aed', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
                </button>
                <div className={`faq-body${openFaq === i ? ' open' : ''}`}>
                  <div className="faq-body-inner px-6 pb-5 pt-0">
                    <p className="text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────── */}
      <section id="contact" className="py-24" style={{ background: '#09090b' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl" style={{ border: '1px solid #27272a' }}>
            <div className="grid lg:grid-cols-2">
              {/* left */}
              <div className="p-10 lg:p-14" style={{ background: '#111113' }}>
                <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#7c3aed' }}>Kontakt</div>
                <h2 className="font-black text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.025em' }}>
                  Lass uns<br />starten.
                </h2>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>
                  Sag uns kurz, was ihr braucht — wir melden uns mit einem konkreten Vorschlag. Kein unverbindliches Verkaufsgespräch. Substanz von der ersten Nachricht an.
                </p>
                <div className="mt-10 space-y-4">
                  {[
                    ["✓", "#10b981", "Antwort binnen 24h"],
                    ["✓", "#3b82f6", "Technik & Design aus einer Hand"],
                    ["✓", "#a855f7", "Skalierbar auf AWS/Azure"],
                  ].map(([icon, c, text]) => (
                    <div key={text} className="flex items-center gap-3 text-sm" style={{ color: '#a1a1aa' }}>
                      <span className="font-bold" style={{ color: c }}>{icon}</span>{text}
                    </div>
                  ))}
                </div>
                <div className="mt-12 pt-10" style={{ borderTop: '1px solid #27272a' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#52525b' }}>Direktkontakt</p>
                  <a href="mailto:[EMAIL]" className="text-sm no-underline transition-colors" style={{ color: '#a78bfa' }}
                    onMouseEnter={e=>(e.currentTarget.style.color='#c4b5fd')} onMouseLeave={e=>(e.currentTarget.style.color='#a78bfa')}>
                    [EMAIL]
                  </a>
                </div>
              </div>
              {/* right - form */}
              <div className="p-10 lg:p-14 bg-white">
                <form ref={formRef} onSubmit={handleContactSubmit} className="flex flex-col gap-5">
                  {formStatus === 'success' ? (
                    <div className="flex flex-col items-center gap-4 py-12 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl font-bold">✓</div>
                      <p className="font-bold text-zinc-900">Nachricht gesendet!</p>
                      <p className="text-sm text-zinc-500">Wir melden uns innerhalb von 24 Stunden.</p>
                      <button type="button" onClick={() => setFormStatus('idle')} className="mt-2 text-sm text-violet-600 underline">Weitere Nachricht senden</button>
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="cf-name" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Name</label>
                          <input id="cf-name" required value={formName} onChange={e=>setFormName(e.target.value)}
                            className="rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            placeholder="Max Mustermann" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="cf-email" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">E-Mail</label>
                          <input id="cf-email" type="email" required value={formEmail} onChange={e=>setFormEmail(e.target.value)}
                            className="rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                            placeholder="max@firma.de" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="cf-msg" className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Nachricht</label>
                        <textarea id="cf-msg" rows={5} required value={formMessage} onChange={e=>setFormMessage(e.target.value)}
                          className="rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 resize-none"
                          placeholder="Was möchtet ihr erreichen?" />
                      </div>
                      {formStatus === 'error' && (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</p>
                      )}
                      <button type="submit" disabled={formStatus === 'loading'}
                        className="rounded-xl py-3.5 text-sm font-bold text-white transition-all disabled:opacity-60"
                        style={{ background: '#7c3aed' }}
                        onMouseEnter={e=>{ if(formStatus!=='loading')(e.currentTarget as HTMLElement).style.background='#6d28d9'; }}
                        onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background='#7c3aed'; }}>
                        {formStatus === 'loading' ? 'Wird gesendet…' : 'Nachricht senden'}
                      </button>
                      <p className="text-xs text-zinc-400 text-center">
                        Mit dem Absenden bestätigst du die{' '}
                        <a href="/datenschutz" className="underline">Datenschutzhinweise</a>.
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
      <footer className="py-10" style={{ background: '#09090b', borderTop: '1px solid #1c1c1f' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg" style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)' }} />
              <span className="font-black tracking-tight text-white">veycron</span>
            </div>
            <div className="flex flex-wrap gap-8 text-sm" style={{ color: '#71717a' }}>
              {[["Impressum","/impressum"],["Datenschutz","/datenschutz"],["Nutzungsbedingungen","#"]].map(([l,h])=>(
                <a key={l} href={h} className="no-underline transition-colors hover:text-white" style={{ color: '#71717a' }}
                  onMouseEnter={e=>(e.currentTarget.style.color='#fafafa')} onMouseLeave={e=>(e.currentTarget.style.color='#71717a')}>{l}</a>
              ))}
            </div>
            <p className="text-sm" style={{ color: '#52525b' }}>© {new Date().getFullYear()} veycron. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>

      {/* ── MODAL ───────────────────────────────────────────────────── */}
      {activeFeature && <FeatureModal featureKey={activeFeature} onClose={closeModal} />}
    </div>
  );
}
