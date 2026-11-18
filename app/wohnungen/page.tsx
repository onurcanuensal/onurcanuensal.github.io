'use client';
import React, { useState } from "react";
import AppShell, { useStoredList, newId, WOHNUNGEN_KEY, type Wohnung } from "../components/AppShell";

const empty = { name: '', strasse: '', hausnummer: '', plz: '', ort: '', etage: '', flaeche: '', zimmer: '' };

export default function WohnungenPage() {
  const { items, save } = useStoredList<Wohnung>(WOHNUNGEN_KEY);
  const [form, setForm] = useState(empty);

  function add(e: React.FormEvent) {
    e.preventDefault();
    save([...items, { id: newId(), ...form }]);
    setForm(empty);
  }

  const field = (k: keyof typeof empty, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <input className="field-input" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} {...props} />
    </div>
  );

  return (
    <AppShell title="Wohnungsübersicht">
      {() => (
        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          <section>
            {items.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Noch keine Wohnungen angelegt.</p>
            ) : (
              <ul className="space-y-3">
                {items.map((w) => (
                  <li key={w.id} className="rounded-lg border p-4 flex justify-between gap-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text)' }}>{w.name}</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{[`${w.strasse ?? ''} ${w.hausnummer ?? ''}`.trim(), `${w.plz ?? ''} ${w.ort ?? ''}`.trim()].filter(Boolean).join(', ') || 'Keine Adresse'}{w.etage ? ` · ${w.etage}` : ''}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {w.flaeche ? `${w.flaeche} m²` : '– m²'} · {w.zimmer ? `${w.zimmer} Zimmer` : '– Zimmer'}
                      </p>
                    </div>
                    <button type="button" className="btn btn-danger btn-sm self-start" onClick={() => save(items.filter((x) => x.id !== w.id))}>Löschen</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <form onSubmit={add} className="space-y-3 rounded-lg border p-4 self-start" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Wohnung anlegen</h2>
            {field('name', 'Bezeichnung', { required: true, placeholder: 'z. B. Wohnung 2 (OG)' })}
            {field('strasse', 'Straße')}
            {field('hausnummer', 'Nr.')}
            {field('plz', 'PLZ')}
            {field('ort', 'Wohnort')}
            {field('etage', 'Etage', { placeholder: 'z. B. 2. OG' })}
            {field('flaeche', 'Fläche (m²)', { type: 'number', min: 0, step: 'any' })}
            {field('zimmer', 'Zimmer', { type: 'number', min: 0, step: 'any' })}
            <button type="submit" className="btn btn-primary w-full justify-center">Hinzufügen</button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
