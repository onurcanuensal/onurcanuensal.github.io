'use client';
import React, { useState } from "react";
import Link from "next/link";
import AppShell, { useStoredList, newId, WOHNUNGEN_KEY, VERTRAEGE_KEY, type Wohnung, type Vertrag } from "../components/AppShell";

const empty = { wohnungId: '', mieter: '', beginn: '', ende: '', miete: '', nebenkosten: '', kaution: '' };
const eur = (v: string) => (v ? `${Number(v).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €` : '–');
const date = (v: string) => (v ? new Date(v).toLocaleDateString('de-DE') : '–');

export default function VertraegePage() {
  const wohnungen = useStoredList<Wohnung>(WOHNUNGEN_KEY).items;
  const { items, save } = useStoredList<Vertrag>(VERTRAEGE_KEY);
  const [form, setForm] = useState(empty);

  function add(e: React.FormEvent) {
    e.preventDefault();
    save([...items, { id: newId(), ...form }]);
    setForm(empty);
  }

  const input = (k: keyof typeof empty, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <input className="field-input" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} {...props} />
    </div>
  );

  return (
    <AppShell title="Aktuelle Verträge">
      {() => (
        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          <section>
            {items.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Noch keine Verträge. Eine Vorlage findest du bei den <Link href="/mustervertraege" className="font-semibold" style={{ color: 'var(--blue)' }}>Musterverträgen</Link>.
              </p>
            ) : (
              <ul className="space-y-3">
                {items.map((v) => (
                  <li key={v.id} className="rounded-lg border p-4 flex justify-between gap-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text)' }}>{v.mieter}</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{wohnungen.find((w) => w.id === v.wohnungId)?.name || 'Ohne Wohnung'}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {date(v.beginn)} – {v.ende ? date(v.ende) : 'unbefristet'} · Kaltmiete {eur(v.miete)} · NK {eur(v.nebenkosten)} · Kaution {eur(v.kaution)}
                      </p>
                    </div>
                    <button type="button" className="btn btn-danger btn-sm self-start" onClick={() => save(items.filter((x) => x.id !== v.id))}>Löschen</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <form onSubmit={add} className="space-y-3 rounded-lg border p-4 self-start" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Vertrag erfassen</h2>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Wohnung</label>
              <select className="field-input" value={form.wohnungId} onChange={(e) => setForm({ ...form, wohnungId: e.target.value })}>
                <option value="">– wählen –</option>
                {wohnungen.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              {wohnungen.length === 0 && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Lege zuerst unter <Link href="/wohnungen" style={{ color: 'var(--blue)' }}>Wohnungen</Link> eine an.</p>
              )}
            </div>
            {input('mieter', 'Mieter', { required: true })}
            {input('beginn', 'Mietbeginn', { type: 'date', required: true })}
            {input('ende', 'Mietende (leer = unbefristet)', { type: 'date' })}
            {input('miete', 'Kaltmiete (€)', { type: 'number', min: 0, step: 'any' })}
            {input('nebenkosten', 'Nebenkostenvorauszahlung (€)', { type: 'number', min: 0, step: 'any' })}
            {input('kaution', 'Kaution (€)', { type: 'number', min: 0, step: 'any' })}
            <button type="submit" className="btn btn-primary w-full justify-center">Speichern</button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
