import Link from "next/link";
import React from "react";

export default function AuthLayout({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative flex-col justify-between p-12 text-white overflow-hidden"
        style={{ background: 'radial-gradient(600px 400px at 100% 0%, rgba(219,39,119,0.55), transparent 70%), radial-gradient(700px 500px at 0% 100%, rgba(79,70,229,0.8), transparent 70%), #0b1220' }}>
        <Link href="/" className="flex items-center gap-2.5 font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="w-8 h-8 rounded-[10px] bg-white/15 backdrop-blur flex items-center justify-center text-sm font-bold">v</span>veycron
        </Link>
        <div>
          <h2 className="text-5xl leading-[1.05] mb-5" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.04em' }}>
            Nebenkosten.<br />Einfach erledigt.
          </h2>
          <p className="text-white/70 max-w-sm">Rechtssicher nach BetrKV, mit CO2-Aufteilung und allen BGH-Pflichtbestandteilen — in Minuten statt Excel-Abenden.</p>
        </div>
        <p className="text-xs text-white/50">Für private Vermieter · Deutschland</p>
      </div>
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm fade-up-1">
          <Link href="/" className="lg:hidden text-sm font-semibold" style={{ color: 'var(--blue)' }}>← veycron</Link>
          <h1 className="text-3xl mt-4 mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{title}</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
