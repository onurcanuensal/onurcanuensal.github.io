'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "../components/AuthLayout";
import { register } from "../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== passwordConfirm) { setError('Die Passwörter stimmen nicht überein.'); return; }
    setLoading(true);
    setError('');
    const res = await register(email, password);
    setLoading(false);
    if (!res.ok) { setError(res.error); return; }
    router.push('/dashboard');
  }

  return (
    <AuthLayout title="Konto erstellen" sub="Kostenlos registrieren und direkt deine Nebenkostenabrechnung erstellen.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>E-Mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Passwort</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Mindestens 8 Zeichen.</p>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Passwort bestätigen</label>
            <input type="password" required minLength={8} value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="field-input" />
          </div>
          {error && <p className="text-xs" style={{ color: 'var(--bad)' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center">
            {loading ? 'Wird angelegt…' : 'Registrieren'}
          </button>
        </form>
        <p className="text-sm mt-5" style={{ color: 'var(--text-secondary)' }}>
          Schon registriert? <Link href="/login" className="font-semibold" style={{ color: 'var(--blue)' }}>Anmelden</Link>
        </p>
    </AuthLayout>
  );
}
