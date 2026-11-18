'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "../components/AuthLayout";
import { login } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) { setError(res.error); return; }
    router.push('/dashboard');
  }

  return (
    <AuthLayout title="Anmelden" sub="Melde dich an, um deine Nebenkostenabrechnung zu erstellen.">
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
    </AuthLayout>
  );
}
