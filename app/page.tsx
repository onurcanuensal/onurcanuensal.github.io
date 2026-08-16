'use client';
import React, { useState, useRef } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? 'Fehler beim Senden.');
        setStatus('error');
      } else {
        setStatus('success');
        setEmail('');
      }
    } catch {
      setErrorMsg('Verbindungsfehler — bitte versuchen Sie es erneut.');
      setStatus('error');
    }
  }

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
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full pulse-subtle" style={{ background: 'var(--green)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>In Entwicklung</span>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 flex items-center justify-center px-5 py-16 sm:py-24">
        <div className="w-full max-w-xl">

          {/* Legal context badge */}
          <div className="fade-up-1 mb-8">
            <span className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              E-Rechnungspflicht ab 01.01.2025
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up-2 font-bold leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 3.2rem)', letterSpacing: '-0.025em', color: 'var(--text)' }}>
            XRechnung in 2&nbsp;Minuten.<br />
            <span style={{ color: 'var(--text-secondary)' }}>Ohne Steuerberater.</span>
          </h1>

          {/* Subtext */}
          <p className="fade-up-3 mt-5 text-lg leading-relaxed" style={{ color: 'var(--text-secondary)', maxWidth: '520px' }}>
            Für Freelancer und Kleinunternehmer, die E-Rechnungen ausstellen müssen — ohne
            Buchhaltungssoftware, ohne Lernkurve.
          </p>

          {/* 3 bullet points */}
          <div className="fade-up-3 mt-8 space-y-3">
            {[
              "Rechnung eingeben — wir erzeugen eine korrekte XRechnung/ZUGFeRD-Datei",
              "Kein Buchhaltungswissen nötig",
              "GoBD-konform archiviert",
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

          {/* ── EMAIL FORM ── */}
          <div className="fade-up-4 mt-10">
            {status === 'success' ? (
              <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Sie sind dabei.</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Wir melden uns, sobald veycron startet.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ihre@email.de"
                    className="flex-1 rounded-lg border px-4 py-3 text-sm transition-colors"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--bg-card)',
                      color: 'var(--text)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue-light)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                    style={{ background: 'var(--green)' }}
                    onMouseEnter={(e) => { if (status !== 'loading') e.currentTarget.style.background = 'var(--green-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--green)'; }}
                  >
                    {status === 'loading' ? 'Wird gesendet…' : 'Frühzugang sichern'}
                  </button>
                </div>
                {status === 'error' && (
                  <p className="mt-2 text-xs" style={{ color: '#b91c1c' }}>{errorMsg}</p>
                )}
                <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Kein Spam. Wir melden uns, sobald es losgeht.
                </p>
              </form>
            )}
          </div>

          {/* Separator */}
          <div className="mt-14 mb-8 border-t" style={{ borderColor: 'var(--border)' }} />

          {/* Trust / Context line */}
          <div className="fade-up-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>DSGVO-konform</span>
            <span className="hidden sm:inline" style={{ color: 'var(--border)' }}>|</span>
            <span>Server in Deutschland</span>
            <span className="hidden sm:inline" style={{ color: 'var(--border)' }}>|</span>
            <span>Kein Abo nötig</span>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t py-6 px-5" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-between gap-4 text-xs"
          style={{ color: 'var(--text-muted)' }}>
          <span>© {new Date().getFullYear()} veycron</span>
          <div className="flex gap-5">
            <a href="/impressum" className="no-underline transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Impressum</a>
            <a href="/datenschutz" className="no-underline transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>Datenschutz</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
