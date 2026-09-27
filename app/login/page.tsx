'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = login(email, password);
    setLoading(false);
    if (!res.ok) { setError(res.error); return; }
    router.push('/rechner');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm font-semibold" style={{ color: 'var(--blue)' }}>← veycron</Link>
        <h1 className="text-2xl mt-4 mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Anmelden</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Melde dich an, um deine Nebenkostenabrechnung zu erstellen.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>E-Mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Passwort</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
          </div>
          {error && <p className="text-xs" style={{ color: 'var(--bad)' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
            {loading ? 'Wird geprüft…' : 'Anmelden'}
          </button>
        </form>
        <p className="text-sm mt-5" style={{ color: 'var(--text-secondary)' }}>
          Noch kein Konto? <Link href="/register" className="font-semibold" style={{ color: 'var(--blue)' }}>Jetzt registrieren</Link>
        </p>
      </div>
    </div>
  );
}
