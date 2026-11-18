'use client';
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, logout } from "../lib/auth";

const NAV = [
  { href: '/dashboard', label: 'Übersicht' },
  { href: '/vertraege', label: 'Verträge' },
  { href: '/mustervertraege', label: 'Musterverträge' },
  { href: '/rechner', label: 'Nebenkostenabrechnung' },
  { href: '/wohnungen', label: 'Wohnungen' },
];

const ICONS: Record<string, string> = {
  '/dashboard': 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10',
  '/vertraege': 'M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6',
  '/mustervertraege': 'M4 5h16M4 10h16M4 15h10M4 20h7',
  '/rechner': 'M6 3h12v18H6zM9 7h6M9 11h2M13 11h2M9 15h2M13 15h2',
  '/wohnungen': 'M4 21V7l8-4 8 4v14M9 21v-6h6v6M9 10h.01M15 10h.01',
};
const Icon = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
);

export function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
      <span className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--accent-grad)' }}>v</span>
      <span className="font-semibold tracking-tight" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>veycron</span>
    </Link>
  );
}

function Sidebar({ user }: { user: string }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col p-4 border-r print:hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
      <div className="px-2 py-3 mb-4"><Brand /></div>
      <nav className="flex flex-col gap-1">
        {NAV.map((n) => {
          const active = pathname === n.href;
          return (
            <Link key={n.href} href={n.href} aria-current={active ? 'page' : undefined} className="nav-item" data-active={active}>
              <Icon d={ICONS[n.href]} />{n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl p-3 flex items-center gap-3" style={{ background: 'var(--bg)' }}>
        <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0" style={{ background: 'var(--accent-grad)' }}>{user[0]?.toUpperCase()}</span>
        <div className="min-w-0">
          <p className="text-xs truncate" style={{ color: 'var(--text)' }}>{user}</p>
          <button type="button" onClick={() => { logout(); router.push('/'); }} className="text-xs" style={{ color: 'var(--text-muted)' }}>Abmelden</button>
        </div>
      </div>
    </aside>
  );
}

export function AppNav({ user }: { user: string }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-5 h-14 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <Brand />
        <nav className="flex gap-1 overflow-x-auto">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={pathname === n.href ? 'page' : undefined} className="nav-pill" data-active={pathname === n.href}>{n.label}</Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs hidden md:inline" style={{ color: 'var(--text-muted)' }}>{user}</span>
        <button type="button" onClick={() => { logout(); router.push('/'); }} className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Abmelden</button>
      </div>
    </div>
  );
}

// Redirects to /login without a session; renders nothing until the session is known.
export function useUser() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    const current = getCurrentUser();
    if (!current) router.replace('/login'); else setUser(current);
  }, [router]);
  return user;
}

export default function AppShell({ title, children }: { title: string; children: (user: string) => React.ReactNode }) {
  const user = useUser();
  if (!user) return null;
  return (
    <div className="min-h-screen">
      <Sidebar user={user} />
      <header className="lg:hidden sticky top-0 z-20 border-b glass" style={{ borderColor: 'var(--border)' }}>
        <AppNav user={user} />
      </header>
      <main className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 py-8 lg:py-12">
          <h1 className="text-3xl sm:text-4xl mb-8" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{title}</h1>
          {children(user)}
        </div>
      </main>
    </div>
  );
}

// Persistent list in localStorage (hydrates after mount).
export function useStoredList<T>(key: string) {
  const [items, setItems] = useState<T[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(key) || '[]')); } catch { /* ignore */ }
    setReady(true);
  }, [key]);
  const save = useCallback((next: T[]) => {
    setItems(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
  }, [key]);
  return { items, save, ready };
}

export type Wohnung = { id: string; name: string; strasse: string; hausnummer: string; plz: string; ort: string; etage: string; flaeche: string; zimmer: string };
export type Vertrag = { id: string; wohnungId: string; mieter: string; beginn: string; ende: string; miete: string; nebenkosten: string; kaution: string };
export const WOHNUNGEN_KEY = 'veycron-wohnungen';
export const VERTRAEGE_KEY = 'veycron-vertraege';
export const newId = () => Math.random().toString(36).slice(2, 10);
