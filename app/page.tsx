'use client';
import React, { useState } from "react";
import Image from "next/image";
import heroImg from "@/public/hero/veycron-hero.png";

// veycron – Engineering Landing (Next.js/React + Tailwind)
// Fokus: Cloud & Platform Engineering, Data Platform/Lakehouse, Applied AI/ML, MLOps/LLMOps

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Top bar */}
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
        {/* Mobile menu */}
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
                <a key={label} href={href} className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50">
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

      {/* Hero */}
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
              <div className="flex items-center gap-2"><svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06A1.65 1.65 0 0015 19.4a1.65 1.65 0 00-1 .6 1.65 1.65 0 01-2 0 1.65 1.65 0 00-1-.6 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-.6-1 1.65 1.65 0 010-2 1.65 1.65 0 00.6-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06c-.43.43-.68.98-.6 1.57"/></svg><span>Security by Design</span></div>
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
{/*           <div className="relative">
            <div className="relative rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
              <div className="rounded-xl bg-gray-900 p-3 text-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-red-500"/>
                  <span className="h-2 w-2 rounded-full bg-yellow-500"/>
                  <span className="h-2 w-2 rounded-full bg-green-500"/>
                  <span className="ml-2">deploy</span>
                </div>
                <pre className="mt-3 overflow-auto text-sm leading-relaxed"><code># Discovery-Sprint starten
npx create-next-app@latest corp-site
# Cloud & CI einrichten (Beispiel)
git push origin main && npx vercel</code></pre>
              </div>
            </div>
            <p className="mt-3 text-center text-sm text-gray-500">Engineering-led · Outcome-first</p>
          </div> */}
        </div>
      </section>

      {/* Social Proof */}
      <section aria-label="Kundenlogos" className="border-y border-gray-100 bg-gray-50/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-8 px-4 py-10 sm:grid-cols-3 md:grid-cols-6 sm:px-6 lg:px-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-gray-200/80" aria-hidden="true" />
          ))}
        </div>
      </section>

      {/* Features / Kompetenzen */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Klar. Technisch. Wirksam.</h2>
          <p className="mt-3 text-gray-600">Kompetenzen entlang der Wertschöpfung – von Cloud-Fundamenten bis GenAI-Anwendungen.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Cloud & Platform Engineering", "Foundations, Landing Zones, IDP/Developer Portals, GitOps, IaC."],
            ["Data Platform & Lakehouse", "Batch/Streaming, Governance, Quality, Catalog, Reverse ETL."],
            ["Applied AI/ML & GenAI", "LLMs/RAG, CV/NLP, Feature Stores, Online Inference, Evaluation."],
            ["MLOps & LLMOps", "Pipelines, CI/CD für Modelle, Monitoring, Prompt/Guardrails, Registry."],
            ["Modernisierung & Microservices", "Domain-Driven Design, Eventing, API-Design, Strangler-Figur."],
            ["Security & Compliance", "Zero Trust, Secrets/KMS, IAM, Threat Modeling, DSGVO-by-default."],
          ].map(([title, desc]) => (
            <div key={String(title)} className="group rounded-2xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">{String(title).slice(0,1)}</div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-gray-600">{desc}</p>
              <div className="mt-4 text-sm text-gray-500 opacity-0 transition group-hover:opacity-100">Mehr erfahren →</div>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions / Use cases */}
      <section id="solutions" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Lösungen</h2>
          <p className="mt-3 text-gray-600">End-to-End von Strategie bis Betrieb – mit klaren Metriken (Time-to-Market, Zuverlässigkeit, Kosten, Risiko).</p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 p-8">
            <h3 className="text-xl font-semibold">Cloud Foundations</h3>
            <p className="mt-2 text-gray-600">Multi-Account/Subscription-Setup, Netzwerk, Identitäten, Observability, Kostenkontrolle.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-8">
            <h3 className="text-xl font-semibold">Data Platform</h3>
            <p className="mt-2 text-gray-600">Lakehouse, Governance & Lineage, Self-Service Data, Realtime & ML-Features.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-8">
            <h3 className="text-xl font-semibold">GenAI & LLM-Apps</h3>
            <p className="mt-2 text-gray-600">RAG, Tools/Agents, Evaluations, Guardrails, Kosten/Latency-Optimierung.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-8">
            <h3 className="text-xl font-semibold">Platform Engineering</h3>
            <p className="mt-2 text-gray-600">Interne Dev-Plattform (IDP), Golden Paths, Templates, Self-Service Deployments.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-8">
            <h3 className="text-xl font-semibold">SRE & DevOps</h3>
            <p className="mt-2 text-gray-600">SLIs/SLOs, Error Budgets, Incident Response, Release-Automatisierung.</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-8">
            <h3 className="text-xl font-semibold">Data Analysis</h3>
            <p className="mt-2 text-gray-600">Threat Modeling, Shift-Left, Secrets/KMS, DSGVO, Privacy-Preserving ML.</p>
          </div>
        </div>
      </section>

      {/* Case Study */}
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

      {/* Pricing / Angebot */}
{/*       <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Angebot</h2>
          <p className="mt-3 text-gray-600">Starte fokussiert – skaliere, wenn die Traktion da ist.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {name: "Discovery Sprint", price: "2–4 Wochen", items: ["Ist-Analyse & Zielbild", "Architektur/Roadmap", "Priorisierte Use-Cases"]},
            {name: "Build", price: "Festpreis/Time & Material", items: ["Cloud/Data/AI Umsetzung", "CI/CD & Automatisierung", "Security & Observability"]},
            {name: "Operate", price: "SLA nach Bedarf", items: ["SRE & Betrieb", "Kosten-/Leistungsoptimierung", "Weiterentwicklung & Enablement"]},
          ].map((tier) => (
            <div key={tier.name} className="flex flex-col rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <div className="mt-2 text-3xl font-bold">{tier.price}</div>
              <ul className="mt-4 flex-1 space-y-2 text-gray-600">
                {tier.items.map((it) => (
                  <li key={it} className="flex items-center gap-2"><svg className="h-5 w-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>{it}</li>
                ))}
              </ul>
              <a href="#contact" className="mt-6 rounded-xl bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800">Loslegen</a>
            </div>
          ))}
        </div>
      </section> */}

      {/* FAQ */}
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

      {/* Contact */}
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

      {/* Footer */}
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
    </div>
  );
}
