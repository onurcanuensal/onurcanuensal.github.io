import Link from "next/link";
import type { ReactNode } from "react";

export type LegalSection = { title: string; body: ReactNode };

export default function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-5 py-10 min-h-screen" style={{ background: 'var(--bg)' }}>
      <Link href="/" className="text-sm font-semibold" style={{ color: 'var(--blue)', fontFamily: 'var(--font-display)' }}>← veycron</Link>
      <h1 className="text-3xl mt-4 mb-6" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{title}</h1>
      <div className="space-y-4">
        {sections.map((s) => (
          <section key={s.title} className="rounded-xl border p-5 sm:p-6"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
            <h2 className="text-lg mb-2" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{s.title}</h2>
            <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--text-secondary)' }}>{s.body}</div>
          </section>
        ))}
      </div>
    </main>
  );
}
