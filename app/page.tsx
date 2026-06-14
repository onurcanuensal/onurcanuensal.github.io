'use client';
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

// veycron – Engineering Landing (Next.js/React + Tailwind)
// Fokus: Cloud & Platform Engineering, Data Platform/Lakehouse, Applied AI/ML, MLOps/LLMOps

/* ── MODAL CONTENT ───────────────────────────────────────────────────── */
type FeatureDetail = {
  title: string;
  subtitle: string;
  intro: string;
  deliverables: { title: string; desc: string }[];
  usecases: string[];
  techBadges: string[];
  metrics: { num: string; label: string }[];
  ctaText: string;
};

const featureDetails: Record<string, FeatureDetail> = {
  "Cloud & Platform Engineering": {
    title: "Cloud & Platform Engineering",
    subtitle: "Solide Fundamente. Reibungslose Entwicklung.",
    intro:
      "Eine Cloud-Plattform ist mehr als Infrastruktur — sie ist das Betriebssystem Eurer Organisation. Wir designen und bauen Cloud Foundations, die Teams schnell, sicher und eigenständig liefern lassen.",
    deliverables: [
      { title: "Landing Zones & Multi-Account-Setup", desc: "Skalierbare AWS/Azure-Landingzones mit Netzwerk, Identitäten, Guardrails und Policy-as-Code — reproduzierbar und auditierbar." },
      { title: "Internal Developer Portals (IDP)", desc: "Self-Service-Plattformen mit Backstage, GitOps-Workflows und Golden Paths. Entwickler deployen eigenständig — ohne Ops-Flaschenhals." },
      { title: "Infrastructure as Code", desc: "Vollständig automatisierte Infrastruktur mit Terraform und Ansible. Kein Snowflake-Server, keine manuelle Konfiguration — alles versioniert und nachvollziehbar." },
      { title: "Observability & Kostenkontrolle", desc: "Zentrales Monitoring, Alerting und FinOps-Dashboards. Teams sehen Kosten, Latenz und Fehlerraten in Echtzeit — und können selbst handeln." },
    ],
    usecases: [
      "Aufbau einer skalierbaren Multi-Account-Landingzone für ein wachsendes SaaS-Unternehmen",
      "Migration von On-Premise-Workloads in die Cloud ohne Betriebsunterbrechung",
      "Einführung eines Internal Developer Portals mit Self-Service-Deployments",
      "Kostenoptimierung bestehender Cloud-Umgebungen — typisch 30–50 % Einsparung",
    ],
    techBadges: ["AWS", "Azure", "Terraform", "Pulumi", "Kubernetes", "ArgoCD", "Backstage", "GitHub Actions", "Grafana", "Prometheus", "OPA / Kyverno"],
    metrics: [
      { num: "–50%", label: "Cloud-Kosten durch Rightsizing & FinOps" },
      { num: "10×", label: "schnellere Deployments durch Self-Service" },
      { num: "99,99%", label: "Verfügbarkeit durch redundante Architektur" },
    ],
    ctaText: "Cloud-Architektur besprechen →",
  },
  "Data Platform & Lakehouse": {
    title: "Data Platform & Lakehouse",
    subtitle: "Daten, die Entscheidungen antreiben.",
    intro:
      "Wer Daten nicht versteht, verliert. Wir bauen Data Platforms, die Rohdaten in verlässliche, zugängliche und messbare Assets verwandeln — von der Ingest-Pipeline bis zum Self-Service Analytics Layer.",
    deliverables: [
      { title: "Lakehouse-Architektur", desc: "Offene Tabellenformate (Iceberg, Delta Lake), entkoppelte Storage- und Compute-Layer, ACID-Transaktionen — skalierbar von Gigabytes bis Petabytes." },
      { title: "Batch & Streaming Pipelines", desc: "Resiliente Datenpipelines mit Apache Spark, Flink und dbt. SLAs, Data Quality Gates und automatisches Alerting bei Anomalien." },
      { title: "Data Governance & Catalog", desc: "Zentraler Data Catalog, Lineage-Tracking, Klassifizierung und Access Controls. Teams wissen, wo Daten herkommen und wer sie nutzen darf." },
      { title: "Reverse ETL & ML-Features", desc: "Aktivierung von Daten direkt in operative Systeme (CRM, Ads, CDP). Feature Store für konsistente ML-Features in Training und Inference." },
    ],
    usecases: [
      "Aufbau eines Lakehouses als Single Source of Truth für 5 Geschäftsbereiche",
      "Migration von einem Legacy-Data-Warehouse zu einem modernen Open-Table-Format",
      "Echtzeit-Streaming-Pipeline für Fraud Detection mit unter 500ms Latenz",
      "Self-Service Analytics Portal für Business-Teams ohne SQL-Kenntnisse",
    ],
    techBadges: ["Apache Spark", "Apache Flink", "dbt", "Iceberg / Delta Lake", "Kafka", "Airflow", "Great Expectations", "Unity Catalog", "dbt Cloud", "Snowflake", "BigQuery", "Databricks"],
    metrics: [
      { num: "1 Quelle", label: "statt 12 Datensilos" },
      { num: "<500ms", label: "Streaming-Latenz in Echtzeit" },
      { num: "–80%", label: "manuelle Datenaufbereitung" },
    ],
    ctaText: "Data Platform besprechen →",
  },
  "Applied AI/ML & GenAI": {
    title: "Applied AI/ML & GenAI",
    subtitle: "KI, die im Unternehmen wirklich funktioniert.",
    intro:
      "GenAI-Demos gibt es genug. Wir bauen KI-Systeme, die in der Produktion stabil laufen, messbare Ergebnisse liefern und in bestehende Prozesse integriert werden — vom RAG-Service bis zum Computer-Vision-System.",
    deliverables: [
      { title: "RAG-Systeme & LLM-Applikationen", desc: "Firmeninterne KI auf Basis eigener Daten — Dokumente, Wikis, Datenbanken. Keine Datenweitergabe, keine Halluzinationen ohne Quellenangabe, DSGVO-konform." },
      { title: "Computer Vision & NLP", desc: "Objekterkennung, Klassifizierung, OCR, Textzusammenfassung — maßgeschneidert für Euren Anwendungsfall. Training auf eigenen Daten, Deployment on-premise oder cloud." },
      { title: "Feature Stores & Online Inference", desc: "Konsistente Features für Training und Produktion. Low-Latency Inference mit sub-100ms Response-Zeiten, skalierbar auf Millionen von Anfragen." },
      { title: "Evaluations & Guardrails", desc: "Systematisches Evaluations-Framework für LLM-Outputs. Guardrails gegen Jailbreaks, Off-Topic-Antworten und Datenlecks — bevor sie in der Produktion auftreten." },
    ],
    usecases: [
      "KI-Assistent für interne Wissensdatenbank — 80 % weniger Zeit für Informationssuche",
      "Automatisierte Vertragsprüfung und Klassifizierung für Legal-Teams",
      "Computer-Vision-System für Qualitätskontrolle in der Produktion",
      "Intelligenter Kundensupport-Bot, der 70 % der Anfragen ohne Eskalation beantwortet",
    ],
    techBadges: ["LangChain / LangGraph", "OpenAI / Anthropic APIs", "Hugging Face", "PyTorch", "RAG / Vector DB", "Pinecone / Weaviate", "RLHF / Fine-Tuning", "Triton Inference Server", "BentoML", "MLflow"],
    metrics: [
      { num: "–80%", label: "manuelle Bearbeitungszeit durch KI-Automatisierung" },
      { num: "<100ms", label: "Inference-Latenz in der Produktion" },
      { num: "6–10 Wo.", label: "bis zum ersten produktiven KI-System" },
    ],
    ctaText: "KI-Projekt anfragen →",
  },
  "MLOps & LLMOps": {
    title: "MLOps & LLMOps",
    subtitle: "Modelle, die in der Produktion liefern.",
    intro:
      "Ein Modell, das nur im Notebook funktioniert, hat keinen Wert. Wir bauen die Infrastruktur, die ML- und LLM-Modelle zuverlässig in die Produktion bringt — mit vollständiger Reproduzierbarkeit, Monitoring und CI/CD.",
    deliverables: [
      { title: "ML-Pipelines & CI/CD für Modelle", desc: "Automatisierte Trainings-, Test- und Deployment-Pipelines. Jede Modellversion ist nachvollziehbar, reproduzierbar und rollback-fähig — wie Software-Releases." },
      { title: "Model Monitoring & Drift Detection", desc: "Kontinuierliche Überwachung von Modellqualität, Data Drift und Concept Drift in der Produktion. Alerting bevor die Genauigkeit des Modells stillschweigend sinkt." },
      { title: "Prompt Engineering & Guardrails", desc: "Systematisches Prompt-Management, Versionierung und A/B-Testing für LLM-Outputs. Guardrails gegen unerwünschte Ausgaben — regelbasiert und ML-gestützt." },
      { title: "Model Registry & Governance", desc: "Zentrale Registry mit Metadaten, Lineage und Genehmigungsworkflows. Compliance-gerechte Dokumentation, welches Modell wann in der Produktion war und warum." },
    ],
    usecases: [
      "Aufbau einer vollständigen MLOps-Plattform für ein Team von 10 Data Scientists",
      "Automatisiertes Retraining bei Drift-Erkennung ohne manuelle Intervention",
      "LLMOps-Stack für eine produktive RAG-Anwendung mit 100k+ täglichen Anfragen",
      "Ablösung manueller Modell-Deployments durch vollautomatische CI/CD-Pipeline",
    ],
    techBadges: ["MLflow", "Kubeflow", "ZenML", "Evidently AI", "Arize", "Weights & Biases", "DVC", "Seldon / BentoML", "Argo Workflows", "Feature Store (Feast)", "Prometheus / Grafana"],
    metrics: [
      { num: "–90%", label: "Deployment-Aufwand durch Automatisierung" },
      { num: "Echtzeit", label: "Drift-Erkennung statt manueller Reports" },
      { num: "100%", label: "Reproduzierbarkeit jedes Modell-Trainings" },
    ],
    ctaText: "MLOps-Infrastruktur aufbauen →",
  },
  "Modernisierung & Microservices": {
    title: "Modernisierung & Microservices",
    subtitle: "Legacy überwinden. Zukunft bauen.",
    intro:
      "Monolithen bremsen. Aber ein Big-Bang-Rewrite ist riskant. Wir modernisieren schrittweise nach dem Strangler-Fig-Muster — ohne Betriebsunterbrechung, ohne verlorene Daten, mit klarem Technologiefahrplan.",
    deliverables: [
      { title: "Domain-Driven Design (DDD)", desc: "Klare Bounded Contexts, Ubiquitous Language und saubere Service-Boundaries. Software, die die Sprache des Unternehmens spricht — und damit wartbar bleibt." },
      { title: "Event-Driven Architecture", desc: "Entkoppelte Microservices über Kafka oder NATS. Services kommunizieren asynchron, sind unabhängig deploybar und tolerieren Ausfälle anderer Services." },
      { title: "API-Design & Strangler-Fig-Migration", desc: "Schrittweise Migration: neue Features als Microservices, alter Monolith bleibt vorerst in Betrieb. Kein Risiko, kein einmaliger Cutover, kein Schlafentzug." },
      { title: "Skalierbare Backend-Systeme", desc: "Hochperformante APIs in TypeScript, Go oder Rust. CQRS, Event Sourcing und read-optimierte Projektionen für komplexe Domänen mit Audit-Anforderungen." },
    ],
    usecases: [
      "Migration eines 10 Jahre alten PHP-Monolithen in unabhängige Microservices",
      "Einführung von Event-Driven Architecture für ein komplexes E-Commerce-System",
      "API-Modernisierung: REST → GraphQL mit vollständiger Abwärtskompatibilität",
      "Strangler-Fig-Migration mit parallelem Betrieb und schrittweiser Umstellung",
    ],
    techBadges: ["TypeScript / Node.js", "Go", "Rust", "Apache Kafka", "gRPC / GraphQL", "Kubernetes", "Postgres / Redis", "CQRS / Event Sourcing", "OpenAPI", "Avro / Protobuf"],
    metrics: [
      { num: "10×", label: "Performance gegenüber Legacy-Monolithen" },
      { num: "–70%", label: "Deployment-Zeit durch CI/CD und Entkopplung" },
      { num: "0", label: "ungeplante Ausfälle während Migration" },
    ],
    ctaText: "Modernisierung planen →",
  },
  "Security & Compliance": {
    title: "Security & Compliance",
    subtitle: "Sicherheit, die von Anfang an eingebaut ist.",
    intro:
      "Security ist kein nachträgliches Audit. Wir integrieren Zero-Trust-Prinzipien, Secrets-Management und Compliance-Anforderungen von Tag 1 in Architektur und Entwicklungsprozess — nicht als Checkbox, sondern als Qualitätsmerkmal.",
    deliverables: [
      { title: "Zero-Trust-Architektur", desc: "Kein implizites Vertrauen — weder intern noch extern. Mikrosegmentierung, identitätsbasierter Zugriff und kontinuierliche Verifikation auf Netzwerk- und Anwendungsebene." },
      { title: "Secrets & IAM Management", desc: "Vault oder AWS Secrets Manager für zentrales Secrets-Management. Least-Privilege-IAM-Policies, automatisierte Rotation und Audit-Logging jedes Zugriffs." },
      { title: "Threat Modeling & Shift-Left Security", desc: "STRIDE-basiertes Threat Modeling in der Design-Phase. SAST/DAST in der CI/CD-Pipeline. Security Reviews als Teil des Development-Workflows — nicht als Nacharbeit." },
      { title: "DSGVO & Compliance-as-Code", desc: "Privacy-by-Design, Datenklassifizierung und automatisierte Compliance-Checks mit OPA oder Kyverno. Audit-Trails, die vor Behörden und Prüfern standhalten." },
    ],
    usecases: [
      "Zero-Trust-Umstrukturierung für ein reguliertes Finanzunternehmen (BaFin-konform)",
      "DSGVO-konforme Datenplattform mit vollständigem Audit-Trail und Datenlöschung on-demand",
      "Einführung von Shift-Left Security: SAST, Container-Scanning, IaC-Checks in CI/CD",
      "Implementierung von Secrets-Management mit automatischer Rotation für 50+ Microservices",
    ],
    techBadges: ["HashiCorp Vault", "AWS IAM / STS", "OPA / Kyverno", "Trivy / Snyk", "Falco", "CIS Benchmarks", "STRIDE Threat Modeling", "ISO 27001", "DSGVO / BDSG", "SOC 2", "NIS-2"],
    metrics: [
      { num: "0", label: "kritische CVEs in Produktion durch Shift-Left" },
      { num: "100%", label: "DSGVO-konforme Datenverarbeitung" },
      { num: "Echtzeit", label: "Bedrohungserkennung durch Security Monitoring" },
    ],
    ctaText: "Security-Assessment anfragen →",
  },
};

/* ── MODAL COMPONENT ─────────────────────────────────────────────────── */
function FeatureModal({ featureKey, onClose }: { featureKey: string; onClose: () => void }) {
  const detail = featureDetails[featureKey];
  if (!detail) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={detail.title}
        className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl"
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 px-6 py-4 backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            veycron / {detail.title}
          </span>
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-8 sm:px-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{detail.title}</h2>
          <p className="mt-1 font-medium text-indigo-600">{detail.subtitle}</p>
          <p className="mt-4 border-l-2 border-indigo-500 pl-4 text-gray-600 leading-relaxed">
            {detail.intro}
          </p>

          {/* Deliverables */}
          <div className="mt-8">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Was wir konkret liefern
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {detail.deliverables.map((d) => (
                <div key={d.title} className="rounded-xl border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900">{d.title}</h4>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="mt-8">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Typische Einsatzszenarien
            </h3>
            <ul className="space-y-2">
              {detail.usecases.map((u) => (
                <li key={u} className="flex gap-3 text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  {u}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Badges */}
          <div className="mt-8">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Technologien
            </h3>
            <div className="flex flex-wrap gap-2">
              {detail.techBadges.map((b) => (
                <span
                  key={b}
                  className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="mt-8">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Typische Ergebnisse
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {detail.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-gray-200 p-4 text-center">
                  <div className="text-xl font-black tracking-tight text-gray-900">{m.num}</div>
                  <div className="mt-1 text-xs text-gray-500 leading-tight">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-2xl bg-gray-50 border border-gray-200 p-6 text-center">
            <p className="text-gray-600 mb-4">
              Bereit loszulegen? Wir antworten innerhalb von 24 Stunden mit einem konkreten Vorschlag.
            </p>
            <a
              href="#contact"
              onClick={onClose}
              className="inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
            >
              {detail.ctaText}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── MAIN PAGE ───────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const closeModal = useCallback(() => setActiveFeature(null), []);

  useEffect(() => {
    if (activeFeature) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeFeature]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') closeModal(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeModal]);

  const features: [string, string][] = [
    ["Cloud & Platform Engineering", "Foundations, Landing Zones, IDP/Developer Portals, GitOps, IaC."],
    ["Data Platform & Lakehouse", "Batch/Streaming, Governance, Quality, Catalog, Reverse ETL."],
    ["Applied AI/ML & GenAI", "LLMs/RAG, CV/NLP, Feature Stores, Online Inference, Evaluation."],
    ["MLOps & LLMOps", "Pipelines, CI/CD für Modelle, Monitoring, Prompt/Guardrails, Registry."],
    ["Modernisierung & Microservices", "Domain-Driven Design, Eventing, API-Design, Strangler-Figur."],
    ["Security & Compliance", "Zero Trust, Secrets/KMS, IAM, Threat Modeling, DSGVO-by-default."],
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* ── NAVIGATION ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500" />
            <a href="#" className="font-semibold tracking-tight">veycron</a>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-gray-900 text-gray-600">Kompetenzen</a>
            <a href="#solutions" className="hover:text-gray-900 text-gray-600">Lösungen</a>
            <a href="#cases" className="hover:text-gray-900 text-gray-600">Referenzen</a>
            <a href="#pricing" className="hover:text-gray-900 text-gray-600">Angebot</a>
            <a href="#contact" className="hover:text-gray-900 text-gray-600">Kontakt</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href="#contact" className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">Anfragen</a>
            <a href="#cta" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">Kostenlos starten</a>
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-gray-300 p-2 text-gray-700"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label="Menü öffnen"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </div>
        {mobileOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-200">
            <div className="space-y-1 px-4 py-4">
              {[
                ["Kompetenzen", "#features"],
                ["Lösungen", "#solutions"],
                ["Referenzen", "#cases"],
                ["Angebot", "#pricing"],
                ["Kontakt", "#contact"],
              ].map(([label, href]) => (
                <a key={label} href={href} className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                  {label}
                </a>
              ))}
              <div className="flex gap-2 pt-2">
                <a href="#contact" className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-center text-sm font-medium hover:bg-gray-50">Anfragen</a>
                <a href="#cta" className="flex-1 rounded-xl bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800">Starten</a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section id="cta" className="relative overflow-hidden">
        <div className="absolute -top-20 inset-x-0 -z-10 blur-3xl">
          <div className="mx-auto h-48 max-w-2xl bg-gradient-to-r from-indigo-300/30 via-violet-300/30 to-fuchsia-300/30" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Engineering für <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Cloud, Data & AI</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-gray-600">
              Wir bauen Plattformen, Daten- und ML-Lösungen: Cloud Foundations & Landing Zones, Lakehouse/Data Platform, GenAI/LLM-Anwendungen – sicher, skalierbar, messbar.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#contact" className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800">Projekt besprechen</a>
              <a href="#features" className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold hover:bg-gray-50">Kompetenzen ansehen</a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg><span>Platform Engineering</span></div>
              <div className="flex items-center gap-2"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20l9-16-9 4-9-4 9 16z" /></svg><span>MLOps & LLMOps</span></div>
              <div className="flex items-center gap-2"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06A1.65 1.65 0 0015 19.4a1.65 1.65 0 00-1 .6 1.65 1.65 0 01-2 0 1.65 1.65 0 00-1-.6 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06.06" /></svg><span>Security by Design</span></div>
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
              <div className="relative aspect-[16/10] w-full rounded-xl">
                <Image
                  src="/img/landing_page_symbols.png"
                  alt="Cloud · Data · AI — Veycron"
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width:1024px) 560px, 100vw"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-sm text-gray-500">Cloud · Data · AI</p>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ───────────────────────────────────────────────── */}
      <section aria-label="Kundenlogos" className="border-y border-gray-100 bg-gray-50/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-8 px-4 py-10 sm:grid-cols-3 md:grid-cols-6 sm:px-6 lg:px-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-gray-200/80" aria-hidden="true" />
          ))}
        </div>
      </section>

      {/* ── FEATURES / KOMPETENZEN ─────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Klar. Technisch. Wirksam.</h2>
          <p className="mt-3 text-gray-600">Kompetenzen entlang der Wertschöpfung – von Cloud-Fundamenten bis GenAI-Anwendungen.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, desc]) => (
            <div
              key={title}
              className="group flex flex-col rounded-2xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md hover:border-indigo-200 cursor-pointer"
              onClick={() => setActiveFeature(title)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">
                {title.slice(0, 1)}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1 flex-1 text-gray-600">{desc}</p>
              <button
                className="mt-4 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                onClick={(e) => { e.stopPropagation(); setActiveFeature(title); }}
              >
                Mehr erfahren
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOLUTIONS ──────────────────────────────────────────────────── */}
      <section id="solutions" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Lösungen</h2>
          <p className="mt-3 text-gray-600">End-to-End von Strategie bis Betrieb – mit klaren Metriken (Time-to-Market, Zuverlässigkeit, Kosten, Risiko).</p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {[
            ["Cloud Foundations", "Multi-Account/Subscription-Setup, Netzwerk, Identitäten, Observability, Kostenkontrolle."],
            ["Data Platform", "Lakehouse, Governance & Lineage, Self-Service Data, Realtime & ML-Features."],
            ["GenAI & LLM-Apps", "RAG, Tools/Agents, Evaluations, Guardrails, Kosten/Latency-Optimierung."],
            ["Platform Engineering", "Interne Dev-Plattform (IDP), Golden Paths, Templates, Self-Service Deployments."],
            ["SRE & DevOps", "SLIs/SLOs, Error Budgets, Incident Response, Release-Automatisierung."],
            ["Data Analysis", "Threat Modeling, Shift-Left, Secrets/KMS, DSGVO, Privacy-Preserving ML."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CASE STUDY ─────────────────────────────────────────────────── */}
      <section id="cases" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium tracking-wider text-indigo-600">CASE STUDY</p>
            <h3 className="mt-2 text-2xl font-semibold">Von Monolith zu AI-fähiger Plattform</h3>
            <p className="mt-3 text-gray-600">Migration auf Cloud-Foundations, Aufbau einer Data-Plattform und Einführung von MLOps. Ergebnis: schnellere Releases, reproduzierbare Modelle, bessere Observability.</p>
            <ul className="mt-4 list-disc pl-5 text-gray-600">
              <li>Platform Engineering: Developer Portal &amp; Golden Paths</li>
              <li>Data Platform: Lakehouse, Catalog, Quality Gates</li>
              <li>AI: RAG-Service mit Evaluations &amp; Guardrails</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 p-4">
            <figure>
              <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-50">
                <img
                  src="/img/img_website.png"
                  alt="Von Monolith zu AI-fähiger Plattform – Architekturdiagramm"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm text-gray-500">
                Case: Von Monolith zu AI-Plattform
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-2xl font-semibold">FAQ</h3>
          <dl className="mt-6 space-y-4">
            {[
              ["Welche Clouds unterstützt ihr?", "AWS, Azure – Cloud-neutral, mit IaC und GitOps für reproduzierbare Umgebungen."],
              ["Wie startet ein Projekt?", "Mit einem Discovery-Sprint: Ziele, Architektur, Roadmap und messbare Outcomes."],
              ["Wie integriert ihr AI/ML?", "Über MLOps/LLMOps: Datenqualität, Trainings-/Inference-Pipelines, Evaluations, Monitoring & Guardrails."],
              ["Security & Compliance?", "Security-by-Design, Least Privilege/IAM, Secrets/KMS, Audit-Trails, DSGVO-Konformität."],
              ["Übernehmt ihr den Betrieb?", "Ja – SRE-Modell mit SLOs/Error Budgets und kontinuierlicher Kosten-/Leistungsoptimierung."],
            ].map(([q, a], idx) => (
              <div key={idx} className="rounded-2xl border border-gray-200 p-4">
                <dt className="font-medium">{q}</dt>
                <dd className="mt-2 text-gray-600">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────────────────────── */}
      <section id="contact" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold">Lass uns starten</h3>
            <p className="mt-2 text-gray-600">Sag uns kurz, was du brauchst – wir melden uns mit einem konkreten Vorschlag.</p>
            <ul className="mt-6 space-y-2 text-gray-600">
              <li className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-green-500" /> Antwort binnen 24h</li>
              <li className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-blue-500" /> Technik &amp; Design aus einer Hand</li>
              <li className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-purple-500" /> Skalierbar auf AWS/Azure</li>
            </ul>
          </div>
          <form className="rounded-2xl border border-gray-200 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-gray-700">Name</label>
                <input className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="Max Mustermann" />
              </div>
              <div>
                <label className="text-sm text-gray-700">E-Mail</label>
                <input type="email" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="max@firma.de" />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm text-gray-700">Nachricht</label>
              <textarea rows={4} className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" placeholder="Was möchtest du erreichen?" />
            </div>
            <button type="submit" className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">Absenden</button>
            <p className="mt-3 text-xs text-gray-500">Mit dem Absenden bestätigst du die <a className="underline" href="#">Datenschutzhinweise</a>.</p>
          </form>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-gray-50/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <div aria-hidden="true" className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500" />
            <p className="mt-3 text-sm text-gray-600">© {new Date().getFullYear()} veycron. Alle Rechte vorbehalten.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 lg:col-span-2 lg:justify-self-end">
            <a href="/impressum" className="hover:text-gray-900">Impressum</a>
            <a href="/datenschutz" className="hover:text-gray-900">Datenschutz</a>
            <a href="#" className="hover:text-gray-900">Nutzungsbedingungen</a>
            <a href="#" className="hover:text-gray-900">Cookie-Einstellungen</a>
          </div>
        </div>
      </footer>

      {/* ── FEATURE MODAL ──────────────────────────────────────────────── */}
      {activeFeature && (
        <FeatureModal featureKey={activeFeature} onClose={closeModal} />
      )}
    </div>
  );
}
