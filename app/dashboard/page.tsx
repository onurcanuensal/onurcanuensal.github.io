'use client';
import React from "react";
import Link from "next/link";
import AppShell, { useStoredList, WOHNUNGEN_KEY, VERTRAEGE_KEY, type Wohnung, type Vertrag } from "../components/AppShell";

const mono = { fontFamily: 'var(--font-data)' };

export default function DashboardPage() {
  const wohnungen = useStoredList<Wohnung>(WOHNUNGEN_KEY).items;
  const vertraege = useStoredList<Vertrag>(VERTRAEGE_KEY).items;
  const today = new Date().toISOString().slice(0, 10);
  const aktiv = vertraege.filter((v) => !v.ende || v.ende >= today);
  const miete = aktiv.reduce((s, v) => s + (Number(v.miete) || 0), 0);
  const vermietet = new Set(aktiv.map((v) => v.wohnungId));
  const leer = wohnungen.filter((w) => !vermietet.has(w.id));

  const stats = [
    { label: 'Wohnungen', value: String(wohnungen.length), href: '/wohnungen' },
    { label: 'Aktive Verträge', value: String(aktiv.length), href: '/vertraege' },
    { label: 'Kaltmiete / Monat', value: `${miete.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`, href: '/vertraege' },
    { label: 'Ohne Mieter', value: String(leer.length), href: '/wohnungen' },
  ];

  return (
    <AppShell title="Übersicht">
      {(user) => (
        <>
          <p className="-mt-6 mb-8 text-sm" style={{ color: "var(--text-secondary)" }}>Angemeldet als {user}</p>
          <div className="grid gap-4 md:grid-cols-4 mb-4">
            <Link href="/vertraege" className="surface card-hover md:col-span-2 md:row-span-2 p-7 flex flex-col justify-between min-h-56 text-white border-0"
              style={{ background: "radial-gradient(420px 240px at 100% 0%, rgba(219,39,119,0.5), transparent 70%), radial-gradient(420px 260px at 0% 100%, rgba(79,70,229,0.75), transparent 70%), #0b1220" }}>
              <p className="text-sm text-white/70">Kaltmiete / Monat</p>
              <p className="text-5xl sm:text-6xl tracking-tight" style={{ ...mono, letterSpacing: "-0.04em" }}>{miete.toLocaleString("de-DE", { minimumFractionDigits: 2 })} <span className="text-3xl text-white/60">€</span></p>
            </Link>
            {stats.filter((s) => s.label !== "Kaltmiete / Monat").map((s) => (
              <Link key={s.label} href={s.href} className="surface card-hover p-5 block">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                <p className="text-4xl mt-3" style={{ color: "var(--text)", ...mono, letterSpacing: "-0.04em" }}>{s.value}</p>
              </Link>
            ))}
            <Link href="/rechner" className="surface card-hover md:col-span-2 p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold" style={{ color: "var(--text)" }}>Nebenkostenabrechnung starten</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>In wenigen Schritten zur fertigen Abrechnung.</p>
              </div>
              <span className="btn btn-accent shrink-0">Los →</span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/wohnungen" className="btn btn-ghost">Wohnung anlegen</Link>
            <Link href="/vertraege" className="btn btn-ghost">Vertrag erfassen</Link>
          </div>
          {leer.length > 0 && (
            <p className="text-sm mt-6 rounded-xl px-4 py-3" style={{ color: "var(--amber)", background: "var(--amber-tint)" }}>
              Ohne aktiven Vertrag: {leer.map((w) => w.name).join(", ")}
            </p>
          )}
        </>
      )}
    </AppShell>
  );
}
