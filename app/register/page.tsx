'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirm) { setError('Die Passwörter stimmen nicht überein.'); return; }
    setLoading(true);
    setError('');
    const res = register(email, password);
    setLoading(false);
    if (!res.ok) { setError(res.error); return; }
    router.push('/rechner');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm font-semibold" style={{ color: 'var(--blue)' }}>← veycron</Link>
        <h1 className="text-2xl font-bold mt-4 mb-1" style={{ color: 'var(--text)' }}>Konto erstellen</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Kostenlos registrieren und direkt deine Nebenkostenabrechnung erstellen.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>E-Mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Passwort</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Mindestens 8 Zeichen.</p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Passwort bestätigen</label>
            <input type="password" required minLength={8} value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
          </div>
          {error && <p className="text-xs" style={{ color: 'var(--bad)' }}>{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: 'var(--green)' }}>
            {loading ? 'Wird angelegt…' : 'Registrieren'}
          </button>
        </form>
        <p className="text-sm mt-5" style={{ color: 'var(--text-secondary)' }}>
          Schon registriert? <Link href="/login" className="font-semibold" style={{ color: 'var(--blue)' }}>Anmelden</Link>
        </p>
      </div>
    </div>
  );
}
