'use client';
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout } from "../lib/auth";

type Schluessel = 'wohnflaeche' | 'personen' | 'einheiten' | 'verbrauch';
type Meter = { zEV?: string; zEA?: string };
type Item = {
  name: string; betrag: string; schluessel: Schluessel; included: boolean; fixed: boolean;
  zHV?: string; zHA?: string; unitMeters?: Record<string, Meter>;
};
type Unit = {
  id: string; name: string; flaeche: string; personen: string;
  eigennutzung: boolean; mieterName: string; vorauszahlung: string;
};
type Heiz = {
  energietraeger: string; gesamtkosten: string; verbrauchsanteil: number;
  zHV: string; zHA: string; co2kosten: string; co2stufe: number; unitMeters: Record<string, Meter>;
};
type Warm = { gesamtkosten: string; verbrauchsanteil: number; zHV: string; zHA: string; unitMeters: Record<string, Meter> };
type AppState = {
  step: number;
  objekt: { strasse: string; hausnummer: string; plz: string; ort: string; zeitraumVon: string; zeitraumBis: string };
  units: Unit[];
  activeUnitId: string;
  items: Item[];
  heizung: Heiz;
  warmwasser: Warm;
};

const STORAGE_KEY = 'klarrechnung-rechner-v2';
const STEPS = [
  { id: 'objekt', label: 'Objekt' },
  { id: 'kosten', label: 'Kosten' },
  { id: 'heizung', label: 'Heizung' },
  { id: 'vorauszahlung', label: 'Vorschuss' },
  { id: 'ergebnis', label: 'Ergebnis' },
];

const CO2_TIERS = [
  { max: 12, share: 0 }, { max: 17, share: 10 }, { max: 22, share: 20 }, { max: 27, share: 30 },
  { max: 32, share: 40 }, { max: 37, share: 50 }, { max: 42, share: 60 }, { max: 47, share: 70 },
  { max: 52, share: 80 }, { max: Infinity, share: 95 },
];

const BLOCKED_WORDS = ['verwaltung', 'instandhaltung', 'instandsetzung', 'leerstand', 'kredit', 'zins', 'darlehen', 'hausverwalt'];

function defaultItems(): Item[] {
  return [
    { name: 'Grundsteuer', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Wasserversorgung', betrag: '', schluessel: 'verbrauch', included: true, fixed: true, zHV: '', zHA: '', unitMeters: {} },
    { name: 'Entwässerung', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Aufzug', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Straßenreinigung & Müllbeseitigung', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Gebäudereinigung & Ungezieferbekämpfung', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Gartenpflege', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Beleuchtung', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Schornsteinreinigung', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Sach- & Haftpflichtversicherung', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Hauswart', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Antenne / Kabel / Breitband', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Wäschepflege (Gemeinschaft)', betrag: '', schluessel: 'einheiten', included: true, fixed: true },
  ];
}

function defaultUnits(): Unit[] {
  return [
    { id: 'u1', name: 'Wohnung 1 (Erdgeschoss)', flaeche: '', personen: '', eigennutzung: true, mieterName: '', vorauszahlung: '' },
    { id: 'u2', name: 'Wohnung 2 (Obergeschoss)', flaeche: '', personen: '', eigennutzung: false, mieterName: '', vorauszahlung: '' },
  ];
}

function defaultState(): AppState {
  return {
    step: 0,
    objekt: { strasse: '', hausnummer: '', plz: '', ort: '', zeitraumVon: '', zeitraumBis: '' },
    units: defaultUnits(),
    activeUnitId: 'u2',
    items: defaultItems(),
    heizung: { energietraeger: 'gas', gesamtkosten: '', verbrauchsanteil: 70, zHV: '', zHA: '', co2kosten: '', co2stufe: 0, unitMeters: {} },
    warmwasser: { gesamtkosten: '', verbrauchsanteil: 70, zHV: '', zHA: '', unitMeters: {} },
  };
}

function exampleState(): AppState {
  return {
    step: 0,
    objekt: { strasse: 'Gartenstraße', hausnummer: '12', plz: '86343', ort: 'Königsbrunn', zeitraumVon: '2025-01-01', zeitraumBis: '2025-12-31' },
    units: [
      { id: 'u1', name: 'Wohnung 1 (Erdgeschoss)', flaeche: '90', personen: '3', eigennutzung: true, mieterName: '', vorauszahlung: '' },
      { id: 'u2', name: 'Wohnung 2 (Obergeschoss)', flaeche: '68', personen: '2', eigennutzung: false, mieterName: 'Familie Beispiel', vorauszahlung: '900' },
    ],
    activeUnitId: 'u2',
    items: [
      { name: 'Grundsteuer', betrag: '620', schluessel: 'wohnflaeche', included: true, fixed: true },
      { name: 'Wasserversorgung', betrag: '980', schluessel: 'verbrauch', included: true, fixed: true, zHV: '640', zHA: '810', unitMeters: { u2: { zEV: '120', zEA: '155' } } },
      { name: 'Entwässerung', betrag: '540', schluessel: 'wohnflaeche', included: true, fixed: true },
      { name: 'Aufzug', betrag: '', schluessel: 'wohnflaeche', included: false, fixed: true },
      { name: 'Straßenreinigung & Müllbeseitigung', betrag: '410', schluessel: 'wohnflaeche', included: true, fixed: true },
      { name: 'Gebäudereinigung & Ungezieferbekämpfung', betrag: '260', schluessel: 'wohnflaeche', included: true, fixed: true },
      { name: 'Gartenpflege', betrag: '180', schluessel: 'wohnflaeche', included: true, fixed: true },
      { name: 'Beleuchtung', betrag: '90', schluessel: 'wohnflaeche', included: true, fixed: true },
      { name: 'Schornsteinreinigung', betrag: '65', schluessel: 'wohnflaeche', included: true, fixed: true },
      { name: 'Sach- & Haftpflichtversicherung', betrag: '340', schluessel: 'wohnflaeche', included: true, fixed: true },
      { name: 'Hauswart', betrag: '', schluessel: 'wohnflaeche', included: false, fixed: true },
      { name: 'Antenne / Kabel / Breitband', betrag: '156', schluessel: 'personen', included: true, fixed: true },
      { name: 'Wäschepflege (Gemeinschaft)', betrag: '40', schluessel: 'einheiten', included: true, fixed: true },
    ],
    heizung: { energietraeger: 'gas', gesamtkosten: '2100', verbrauchsanteil: 70, zHV: '8200', zHA: '9650', co2kosten: '180', co2stufe: 28, unitMeters: { u2: { zEV: '1400', zEA: '1650' } } },
    warmwasser: { gesamtkosten: '640', verbrauchsanteil: 70, zHV: '210', zHA: '245', unitMeters: { u2: { zEV: '38', zEA: '45' } } },
  };
}

function num(v: unknown): number { const n = parseFloat(String(v ?? '').replace(',', '.')); return isNaN(n) ? 0 : n; }
function eur(n: number): string { return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }
function safeDiv(a: number, b: number): number { return b > 0 ? a / b : 0; }

function totalFlaeche(units: Unit[]) { return units.reduce((s, u) => s + num(u.flaeche), 0); }
function totalPersonen(units: Unit[]) { return units.reduce((s, u) => s + num(u.personen), 0); }

function itemShare(item: Item, unit: Unit, units: Unit[]): number {
  if (!item.included) return 0;
  const gesamt = num(item.betrag);
  if (item.schluessel === 'wohnflaeche') return gesamt * safeDiv(num(unit.flaeche), totalFlaeche(units));
  if (item.schluessel === 'personen') return gesamt * safeDiv(num(unit.personen), totalPersonen(units));
  if (item.schluessel === 'einheiten') return gesamt * safeDiv(1, units.length);
  if (item.schluessel === 'verbrauch') {
    const m = (item.unitMeters && item.unitMeters[unit.id]) || {};
    const vE = num(m.zEA) - num(m.zEV);
    const vH = num(item.zHA) - num(item.zHV);
    return gesamt * safeDiv(vE, vH);
  }
  return 0;
}

function co2Share(kgProM2: number): number {
  for (const t of CO2_TIERS) { if (kgProM2 < t.max) return t.share; }
  return 95;
}

function heatingCalc(h: Heiz | Warm, unit: Unit, units: Unit[], isWarm: boolean) {
  const gesamt = num(h.gesamtkosten);
  const vAnteil = num(h.verbrauchsanteil) / 100;
  const grundAnteil = 1 - vAnteil;
  const grundMieter = gesamt * grundAnteil * safeDiv(num(unit.flaeche), totalFlaeche(units));
  const vHaus = num(h.zHA) - num(h.zHV);
  const m = (h.unitMeters && h.unitMeters[unit.id]) || {};
  const vEinheit = num(m.zEA) - num(m.zEV);
  const verbrauchMieter = gesamt * vAnteil * safeDiv(vEinheit, vHaus);
  const subtotal = grundMieter + verbrauchMieter;
  let co2VermieterAnteil = 0, co2Prozent = 0;
  if (!isWarm && 'co2stufe' in h) {
    co2Prozent = co2Share(num(h.co2stufe));
    const co2Gesamt = num(h.co2kosten);
    const co2VermieterTotal = co2Gesamt * (co2Prozent / 100);
    co2VermieterAnteil = co2VermieterTotal * safeDiv(vEinheit, vHaus);
  }
  return { grundMieter, verbrauchMieter, subtotal, co2VermieterAnteil, co2Prozent, final: subtotal - co2VermieterAnteil };
}

function computeAll(state: AppState, unit: Unit) {
  const itemResults = state.items.map((it) => ({ item: it, share: itemShare(it, unit, state.units) }));
  const itemsTotal = itemResults.reduce((s, r) => s + r.share, 0);
  const heiz = heatingCalc(state.heizung, unit, state.units, false);
  const warm = heatingCalc(state.warmwasser, unit, state.units, true);
  const gesamtMieter = itemsTotal + heiz.final + warm.final;
  const vorauszahlung = num(unit.vorauszahlung);
  const ergebnis = gesamtMieter - vorauszahlung;
  return { itemResults, itemsTotal, heiz, warm, gesamtMieter, vorauszahlung, ergebnis };
}

function schluesselLabel(s: Schluessel) {
  return ({ wohnflaeche: 'nach Wohnfläche', personen: 'nach Personenzahl', einheiten: 'gleichmäßig je Einheit', verbrauch: 'nach Verbrauch (Zähler)' } as Record<string, string>)[s] || s;
}
function schluesselHelp(s: Schluessel) {
  return ({
    wohnflaeche: 'Jede Wohnung zahlt im Verhältnis ihrer m² zur Gesamtfläche des Hauses. Der Normalfall.',
    personen: 'Aufteilung nach Kopfzahl je Wohnung, z. B. bei Müll.',
    einheiten: 'Alle Wohnungen zahlen denselben Anteil, egal wie groß.',
    verbrauch: 'Aus zwei Zählerständen: (Verbrauch dieser Wohnung ÷ Verbrauch ganzes Haus) × Gesamtkosten.',
  } as Record<string, string>)[s] || '';
}
function isBlocked(name: string) {
  const l = (name || '').toLowerCase();
  return BLOCKED_WORDS.some((w) => l.indexOf(w) !== -1);
}

// ── shared style helpers ──
const card = "rounded-lg border p-5 sm:p-6 mb-4";
const cardStyle = { borderColor: 'var(--border)', background: 'var(--bg-card)' };
const label = "block text-xs font-medium mb-1";
const labelStyle = { color: 'var(--text-secondary)' };
const inputCls = "w-full rounded-md border px-3 py-2 text-sm";
const inputStyle = { borderColor: 'var(--border)', background: '#fff', color: 'var(--text)' };
function btn(_kind: 'primary' | 'ghost' | 'danger' = 'primary') {
  return "rounded-md px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50";
}
function btnStyle(kind: 'primary' | 'ghost' | 'danger' = 'primary'): React.CSSProperties {
  if (kind === 'primary') return { background: 'var(--blue)', color: '#fff' };
  if (kind === 'danger') return { border: '1px solid var(--bad)', color: 'var(--bad)', background: 'transparent' };
  return { border: '1px solid var(--border)', color: 'var(--text)', background: 'transparent' };
}

function Field({ labelText, value, onChange, type = 'text', placeholder }: {
  labelText: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className={label} style={labelStyle}>{labelText}</label>
      <input type={type} value={value ?? ''} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} className={inputCls} style={inputStyle} />
    </div>
  );
}

// ── all handlers the steps need, grouped so each step only takes what it uses ──
type Handlers = {
  updateObjekt: (field: keyof AppState['objekt'], value: string) => void;
  updateUnit: (idx: number, field: keyof Unit, value: string | boolean) => void;
  updateItem: (idx: number, field: keyof Item, value: string | boolean) => void;
  updateItemMeter: (idx: number, unitId: string, field: keyof Meter, value: string) => void;
  updateHeiz: (field: keyof Heiz, value: string | number) => void;
  updateWarm: (field: keyof Warm, value: string | number) => void;
  updateHeizMeter: (unitId: string, field: keyof Meter, value: string) => void;
  updateWarmMeter: (unitId: string, field: keyof Meter, value: string) => void;
  addUnit: () => void;
  removeUnit: (idx: number) => void;
  addItem: () => void;
  removeItem: (idx: number) => void;
  setActiveUnitId: (id: string) => void;
  fillExample: () => void;
  resetAll: () => void;
};

function BasicsWarning({ missingBasics }: { missingBasics: boolean }) {
  if (!missingBasics) return null;
  return (
    <div className="rounded-md border px-4 py-3 text-sm mb-4" style={{ borderColor: 'var(--amber)', background: 'var(--amber-tint)', color: 'var(--text)' }}>
      ⚠ Trag zuerst im ersten Schritt die Wohnungen mit ihrer Fläche ein — ohne sie kann nichts berechnet werden.
    </div>
  );
}

function ActiveUnitBar({ units, activeUnit, setActiveUnitId }: { units: Unit[]; activeUnit: Unit; setActiveUnitId: (id: string) => void }) {
  if (units.length < 2) return null;
  return (
    <div className="rounded-md border px-4 py-3 mb-4 flex flex-wrap items-center gap-3 text-sm"
      style={{ borderColor: 'var(--blue)', background: '#eaf1f7' }}>
      <label style={labelStyle} className="mb-0">Du rechnest gerade ab für:</label>
      <select value={activeUnit.id} onChange={(e) => setActiveUnitId(e.target.value)}
        className="rounded-md border px-2 py-1.5 text-sm flex-1 min-w-[200px]" style={inputStyle}>
        {units.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}{u.eigennutzung ? ' (Eigennutzung)' : (u.mieterName ? ' — ' + u.mieterName : '')}
          </option>
        ))}
      </select>
      {activeUnit.eigennutzung && (
        <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-full" style={{ background: 'var(--amber-tint)', color: 'var(--amber)' }}>
          Eigennutzung
        </span>
      )}
    </div>
  );
}

function StepObjekt({ state, confirmingReset, setConfirmingReset, h }: {
  state: AppState; confirmingReset: boolean; setConfirmingReset: (v: boolean) => void; h: Handlers;
}) {
  const o = state.objekt;
  return (
    <>
      <div className={card} style={cardStyle}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text)' }}>Willkommen 👋</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          In 5 kurzen Schritten zur fertigen Abrechnung — auch wenn du mehrere Wohnungen hast oder
          eine davon selbst bewohnst. Du brauchst griffbereit: die Rechnungen des letzten Jahres und
          die Zählerstände von letztem und diesem Jahr.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <button type="button" className={btn('ghost')} style={btnStyle('ghost')} onClick={h.fillExample}>
            Mit Beispielwerten ausfüllen
          </button>
          {confirmingReset ? (
            <>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Wirklich alles löschen?</span>
              <button type="button" className={btn('danger')} style={btnStyle('danger')} onClick={() => { h.resetAll(); setConfirmingReset(false); }}>Ja, löschen</button>
              <button type="button" className={btn('ghost')} style={btnStyle('ghost')} onClick={() => setConfirmingReset(false)}>Abbrechen</button>
            </>
          ) : (
            <button type="button" className={btn('ghost')} style={btnStyle('ghost')} onClick={() => setConfirmingReset(true)}>Alles zurücksetzen</button>
          )}
        </div>
      </div>

      <div className={card} style={cardStyle}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text)' }}>Adresse &amp; Zeitraum</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Die Angaben für den Kopf der Abrechnung.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field labelText="Straße" value={o.strasse} onChange={(v) => h.updateObjekt('strasse', v)} />
          <Field labelText="Hausnummer" value={o.hausnummer} onChange={(v) => h.updateObjekt('hausnummer', v)} />
          <Field labelText="PLZ" value={o.plz} onChange={(v) => h.updateObjekt('plz', v)} />
          <Field labelText="Ort" value={o.ort} onChange={(v) => h.updateObjekt('ort', v)} />
          <Field labelText="Zeitraum von" type="date" value={o.zeitraumVon} onChange={(v) => h.updateObjekt('zeitraumVon', v)} />
          <Field labelText="Zeitraum bis" type="date" value={o.zeitraumBis} onChange={(v) => h.updateObjekt('zeitraumBis', v)} />
        </div>
      </div>

      <div className={card} style={cardStyle}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text)' }}>Wohnungen im Haus</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Trag jede Wohnung im Haus ein — auch die, in der du selbst wohnst (Eigennutzung). Nur so
          wird die Gesamtfläche richtig berechnet.
        </p>
        {state.units.map((u, i) => (
          <div key={u.id} className="rounded-md border p-4 mb-3" style={{ borderColor: 'var(--border)' }}>
            <div className="flex justify-between items-center gap-2 mb-3">
              <input type="text" value={u.name} placeholder="Bezeichnung"
                onChange={(e) => h.updateUnit(i, 'name', e.target.value)}
                className="font-semibold text-base bg-transparent border-0 border-b focus:border-b-2 px-0 py-1"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
              {state.units.length > 1 && (
                <button type="button" className={btn('danger')} style={btnStyle('danger')} onClick={() => h.removeUnit(i)}>×</button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Field labelText="Wohnfläche (m²)" type="number" value={u.flaeche} onChange={(v) => h.updateUnit(i, 'flaeche', v)} />
              <Field labelText="Personen" type="number" value={u.personen} onChange={(v) => h.updateUnit(i, 'personen', v)} />
            </div>
            <label className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--text)' }}>
              <input type="checkbox" checked={u.eigennutzung} onChange={(e) => h.updateUnit(i, 'eigennutzung', e.target.checked)} />
              Eigennutzung (ich wohne hier selbst, keine Abrechnung nötig)
            </label>
            {!u.eigennutzung && (
              <div className="mt-3">
                <Field labelText="Name Mieter·in" value={u.mieterName} onChange={(v) => h.updateUnit(i, 'mieterName', v)} />
              </div>
            )}
          </div>
        ))}
        <button type="button" className={btn('ghost')} style={btnStyle('ghost')} onClick={h.addUnit}>+ Weitere Wohnung hinzufügen</button>
        <div className="flex flex-wrap gap-6 mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>Gesamtfläche Haus: <b style={{ color: 'var(--text)' }}>{totalFlaeche(state.units).toLocaleString('de-DE')} m²</b></span>
          <span>Personen gesamt: <b style={{ color: 'var(--text)' }}>{totalPersonen(state.units).toLocaleString('de-DE')}</b></span>
          <span>Wohneinheiten: <b style={{ color: 'var(--text)' }}>{state.units.length}</b></span>
        </div>
      </div>
    </>
  );
}

function StepKosten({ state, activeUnit, missingBasics, h }: { state: AppState; activeUnit: Unit; missingBasics: boolean; h: Handlers }) {
  const unit = activeUnit;
  return (
    <>
      <ActiveUnitBar units={state.units} activeUnit={activeUnit} setActiveUnitId={h.setActiveUnitId} />
      <BasicsWarning missingBasics={missingBasics} />
      <div className={card} style={cardStyle}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text)' }}>Betriebskosten (allgemein)</h2>
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          Die 17 Betriebskostenarten aus dem Gesetz stehen schon da — trag nur den Betrag von der
          jeweiligen Rechnung ein (für das ganze Haus). Was du nicht hattest, schaltest du rechts aus.
        </p>
        <div className="rounded-md border px-4 py-3 text-sm mb-4" style={{ borderColor: 'var(--amber)', background: 'var(--amber-tint)' }}>
          Nicht eintragen: Verwaltungskosten, Instandhaltung/Instandsetzung, Leerstand, Kapitalkosten
          (Kredite/Zinsen) — die darf ein Vermieter laut § 1 Abs. 2 BetrKV nicht umlegen.
        </div>
        <div className="space-y-3">
          {state.items.map((it, i) => {
            const showMeter = it.schluessel === 'verbrauch';
            const blocked = isBlocked(it.name);
            const m = (it.unitMeters && it.unitMeters[unit.id]) || {};
            return (
              <div key={i} className="rounded-md border p-3" style={{ borderColor: 'var(--border)', opacity: it.included ? 1 : 0.45 }}>
                <div className="flex justify-between items-start gap-2 mb-2">
                  {it.fixed ? (
                    <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>{it.name}</div>
                  ) : (
                    <input type="text" value={it.name} onChange={(e) => h.updateItem(i, 'name', e.target.value)} className={inputCls} style={inputStyle} />
                  )}
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="inline-flex items-center gap-1 text-xs whitespace-nowrap">
                      <input type="checkbox" checked={it.included} onChange={(e) => h.updateItem(i, 'included', e.target.checked)} /> an
                    </label>
                    {!it.fixed && <button type="button" onClick={() => h.removeItem(i)} className="text-xs" style={{ color: 'var(--bad)' }}>×</button>}
                  </div>
                </div>
                {blocked && <div className="text-xs mb-2" style={{ color: 'var(--bad)' }}>⚠ evtl. nicht umlagefähig — prüfen</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <Field labelText="Gesamtbetrag Haus (€)" type="number" value={it.betrag} placeholder="0,00" onChange={(v) => h.updateItem(i, 'betrag', v)} />
                  <div>
                    <label className={label} style={labelStyle}>Verteilerschlüssel</label>
                    <select value={it.schluessel} onChange={(e) => h.updateItem(i, 'schluessel', e.target.value as Schluessel)} className={inputCls} style={inputStyle}>
                      {(['wohnflaeche', 'personen', 'einheiten', 'verbrauch'] as Schluessel[]).map((s) => (
                        <option key={s} value={s}>{schluesselLabel(s)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{schluesselHelp(it.schluessel)}</p>
                {showMeter && (
                  <>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                      Zählerstand = die Zahl am Zähler. Verbrauch = aktuell − Vorjahr.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      <Field labelText="Diese Wohnung, Vorjahr" type="number" value={m.zEV || ''} onChange={(v) => h.updateItemMeter(i, unit.id, 'zEV', v)} />
                      <Field labelText="Diese Wohnung, aktuell" type="number" value={m.zEA || ''} onChange={(v) => h.updateItemMeter(i, unit.id, 'zEA', v)} />
                      <Field labelText="Haus, Vorjahr" type="number" value={it.zHV || ''} onChange={(v) => h.updateItem(i, 'zHV', v)} />
                      <Field labelText="Haus, aktuell" type="number" value={it.zHA || ''} onChange={(v) => h.updateItem(i, 'zHA', v)} />
                    </div>
                  </>
                )}
                <div className="text-sm text-right pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Anteil {unit.name}: </span>
                  <span className="font-mono font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>{eur(itemShare(it, unit, state.units))}</span>
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" className={btn('ghost') + " mt-4"} style={btnStyle('ghost')} onClick={h.addItem}>+ Sonstige Betriebskosten hinzufügen</button>
      </div>
    </>
  );
}

function HeizBlock({ prefix, h, title, hint, showCO2, unit, onUpdate, onUpdateMeter }: {
  prefix: 'heizung' | 'warmwasser'; h: Heiz | Warm; title: string; hint: string; showCO2: boolean; unit: Unit;
  onUpdate: (field: string, value: string | number) => void;
  onUpdateMeter: (unitId: string, field: keyof Meter, value: string) => void;
}) {
  const m = (h.unitMeters && h.unitMeters[unit.id]) || {};
  return (
    <div className={card} style={cardStyle}>
      <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text)' }}>{title}</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{hint}</p>
      {prefix === 'heizung' && 'energietraeger' in h && (
        <div className="mb-3">
          <label className={label} style={labelStyle}>Energieträger</label>
          <select value={h.energietraeger} onChange={(e) => onUpdate('energietraeger', e.target.value)} className={inputCls} style={inputStyle}>
            <option value="gas">Erdgas (€/m³)</option>
            <option value="oel">Heizöl (€/Liter)</option>
            <option value="fernwaerme">Fernwärme (€/kWh)</option>
            <option value="strom">Strom / Wärmepumpe (€/kWh)</option>
          </select>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Field labelText="Gesamtkosten Haus lt. Rechnung (€)" type="number" value={h.gesamtkosten} onChange={(v) => onUpdate('gesamtkosten', v)} />
        <div>
          <label className={label} style={labelStyle}>Verbrauchsabhängiger Anteil</label>
          <select value={h.verbrauchsanteil} onChange={(e) => onUpdate('verbrauchsanteil', Number(e.target.value))} className={inputCls} style={inputStyle}>
            {[50, 60, 70].map((p) => <option key={p} value={p}>{p}%</option>)}
          </select>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Gesetzlich 50–70% nach Verbrauch, der Rest nach Wohnfläche.</p>
        </div>
      </div>
      <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
        &bdquo;Haus&ldquo; = Zähler für das ganze Gebäude. &bdquo;{unit.name}&ldquo; = nur diese Wohnung.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field labelText="Zählerstand Haus, Vorjahr" type="number" value={h.zHV} onChange={(v) => onUpdate('zHV', v)} />
        <Field labelText="Zählerstand Haus, aktuell" type="number" value={h.zHA} onChange={(v) => onUpdate('zHA', v)} />
        <Field labelText={`Zählerstand ${unit.name}, Vorjahr`} type="number" value={m.zEV || ''} onChange={(v) => onUpdateMeter(unit.id, 'zEV', v)} />
        <Field labelText={`Zählerstand ${unit.name}, aktuell`} type="number" value={m.zEA || ''} onChange={(v) => onUpdateMeter(unit.id, 'zEA', v)} />
      </div>
      {showCO2 && 'co2stufe' in h && (
        <>
          <div className="rounded-md border px-4 py-3 text-sm my-4" style={{ borderColor: 'var(--blue)', background: '#eaf1f7' }}>
            CO2-Kostenaufteilungsgesetz: Je schlechter die Energieeffizienz, desto mehr trägst du als
            Vermieter. Kennst du die Werte nicht, lass die Felder leer.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field labelText="CO2-Kosten Haus (€, falls ausgewiesen)" type="number" value={h.co2kosten} onChange={(v) => onUpdate('co2kosten', v)} />
            <Field labelText="Gebäude-Emission (kg CO2/m² im Jahr)" type="number" value={String(h.co2stufe)} onChange={(v) => onUpdate('co2stufe', num(v))} />
          </div>
          <table className="w-full text-sm mt-3">
            <tbody>
              {CO2_TIERS.map((t, idx) => {
                const lower = idx === 0 ? 0 : CO2_TIERS[idx - 1].max;
                const sel = num(h.co2stufe) < t.max && num(h.co2stufe) >= lower;
                const lbl = t.max === Infinity ? `≥ ${lower} kg/m²` : `${lower}–${t.max} kg/m²`;
                return (
                  <tr key={idx} style={sel ? { background: '#eaf1f7', fontWeight: 600 } : undefined}>
                    <td className="px-2 py-1 border-b" style={{ borderColor: 'var(--border)' }}>{lbl}</td>
                    <td className="px-2 py-1 border-b" style={{ borderColor: 'var(--border)' }}>Vermieteranteil {t.share}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

function StepHeizung({ state, activeUnit, missingBasics, h }: { state: AppState; activeUnit: Unit; missingBasics: boolean; h: Handlers }) {
  return (
    <>
      <ActiveUnitBar units={state.units} activeUnit={activeUnit} setActiveUnitId={h.setActiveUnitId} />
      <BasicsWarning missingBasics={missingBasics} />
      <HeizBlock prefix="heizung" h={state.heizung} title="Heizung" hint="So wie auf der Rechnung deines Energieversorgers, aufgeteilt nach Heizkostenverordnung." showCO2 unit={activeUnit}
        onUpdate={(f, v) => h.updateHeiz(f as keyof Heiz, v)} onUpdateMeter={h.updateHeizMeter} />
      <HeizBlock prefix="warmwasser" h={state.warmwasser} title="Warmwasser" hint="Meist ein eigener Zähler, gleiche Rechenlogik wie bei der Heizung." showCO2={false} unit={activeUnit}
        onUpdate={(f, v) => h.updateWarm(f as keyof Warm, v)} onUpdateMeter={h.updateWarmMeter} />
    </>
  );
}

function StepVorauszahlung({ state, activeUnit, h }: { state: AppState; activeUnit: Unit; h: Handlers }) {
  const idx = state.units.findIndex((u) => u.id === activeUnit.id);
  return (
    <>
      <ActiveUnitBar units={state.units} activeUnit={activeUnit} setActiveUnitId={h.setActiveUnitId} />
      <div className={card} style={cardStyle}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text)' }}>Vorauszahlungen von {activeUnit.mieterName || activeUnit.name}</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Der Betrag, den dieser Mieter im Abrechnungszeitraum monatlich schon vorausbezahlt hat
          (Summe über das ganze Jahr).
        </p>
        <Field labelText="Geleistete Vorauszahlungen gesamt (€)" type="number" value={activeUnit.vorauszahlung} onChange={(v) => h.updateUnit(idx, 'vorauszahlung', v)} />
      </div>
    </>
  );
}

function StepErgebnis({ state, activeUnit, missingBasics, detailsOpen, setDetailsOpen, h }: {
  state: AppState; activeUnit: Unit; missingBasics: boolean; detailsOpen: boolean; setDetailsOpen: (v: boolean) => void; h: Handlers;
}) {
  const unit = activeUnit;
  const r = computeAll(state, unit);
  const ergebnisPositiv = r.ergebnis >= 0;
  const o = state.objekt;
  const rows = r.itemResults.filter((x) => x.item.included);
  return (
    <>
      <div className="print:hidden">
        <ActiveUnitBar units={state.units} activeUnit={activeUnit} setActiveUnitId={h.setActiveUnitId} />
        <BasicsWarning missingBasics={missingBasics} />
      </div>
      {unit.eigennutzung && (
        <div className="rounded-md border px-4 py-3 text-sm mb-4 print:hidden" style={{ borderColor: 'var(--amber)', background: 'var(--amber-tint)' }}>
          Diese Wohnung ist als Eigennutzung markiert — dafür brauchst du normalerweise keine
          Abrechnung. Wähle oben eine vermietete Wohnung aus.
        </div>
      )}
      <div className={card} style={cardStyle}>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Ergebnis für {unit.name}</h2>
        <div className="rounded-md border px-5 py-4 mb-4 text-base"
          style={ergebnisPositiv ? { borderColor: 'var(--amber)', background: 'var(--amber-tint)' } : { borderColor: 'var(--green)', background: 'var(--good-tint)' }}>
          👉 {unit.mieterName || 'Der Mieter'} {ergebnisPositiv ? <>muss noch <b className="font-mono">{eur(Math.abs(r.ergebnis))}</b> nachzahlen.</> : <>bekommt <b className="font-mono">{eur(Math.abs(r.ergebnis))}</b> zurück.</>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-2xl font-mono font-semibold" style={{ color: 'var(--blue)' }}>{eur(r.gesamtMieter)}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Betriebskosten-Anteil dieser Wohnung</div>
          </div>
          <div>
            <div className="text-2xl font-mono font-semibold" style={{ color: 'var(--blue)' }}>{eur(r.vorauszahlung)}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>bereits gezahlte Vorauszahlungen</div>
          </div>
        </div>
        <div className="space-y-2 mb-2">
          {['Gesamtkosten je Kostenart aufgeführt', 'Verteilerschlüssel je Position benannt', 'Mieteranteil berechnet', 'Vorauszahlungen abgezogen'].map((t) => (
            <div key={t} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text)' }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--green)' }} />{t}
            </div>
          ))}
        </div>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Diese vier Punkte verlangt der BGH, damit die Abrechnung überhaupt gültig ist — alle vier
          sind hier automatisch erfüllt.
        </p>
        <div className="flex flex-wrap gap-3 print:hidden">
          <button type="button" className={btn('primary')} style={btnStyle('primary')} onClick={() => { setDetailsOpen(true); setTimeout(() => window.print(), 50); }}>
            Als PDF speichern / drucken
          </button>
          <button type="button" className={btn('ghost')} style={btnStyle('ghost')} onClick={() => setDetailsOpen(!detailsOpen)}>
            {detailsOpen ? 'Details verbergen' : 'Details für die Abrechnung anzeigen'}
          </button>
        </div>
      </div>

      {detailsOpen && (
        <div className={card} style={cardStyle} id="printArea">
          <h2 className="text-lg font-semibold font-mono mb-1" style={{ color: 'var(--text)' }}>
            Nebenkostenabrechnung {o.zeitraumVon || ''} – {o.zeitraumBis || ''}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {o.strasse} {o.hausnummer}, {unit.name}<br />{o.plz} {o.ort}<br />Mieter·in: {unit.mieterName || ''}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[560px]">
              <thead>
                <tr className="text-xs uppercase font-mono" style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left px-2 py-2 border-b" style={{ borderColor: 'var(--border)' }}>Kostenart</th>
                  <th className="text-left px-2 py-2 border-b" style={{ borderColor: 'var(--border)' }}>Gesamtkosten Haus</th>
                  <th className="text-left px-2 py-2 border-b" style={{ borderColor: 'var(--border)' }}>Verteilerschlüssel</th>
                  <th className="text-right px-2 py-2 border-b" style={{ borderColor: 'var(--border)' }}>Ihr Anteil</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>{x.item.name}</td>
                    <td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>{eur(num(x.item.betrag))}</td>
                    <td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>{schluesselLabel(x.item.schluessel)}</td>
                    <td className="px-2 py-1.5 border-b text-right font-mono whitespace-nowrap" style={{ borderColor: 'var(--border)' }}>{eur(x.share)}</td>
                  </tr>
                ))}
                <tr><td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>Heizung (Grundkosten)</td><td className="border-b" style={{ borderColor: 'var(--border)' }}></td><td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>nach Wohnfläche</td><td className="px-2 py-1.5 border-b text-right font-mono whitespace-nowrap" style={{ borderColor: 'var(--border)' }}>{eur(r.heiz.grundMieter)}</td></tr>
                <tr><td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>Heizung (Verbrauch)</td><td className="border-b" style={{ borderColor: 'var(--border)' }}></td><td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>nach Zählerstand</td><td className="px-2 py-1.5 border-b text-right font-mono whitespace-nowrap" style={{ borderColor: 'var(--border)' }}>{eur(r.heiz.verbrauchMieter)}</td></tr>
                <tr><td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>Heizung: CO2-Anteil Vermieter ({r.heiz.co2Prozent}%)</td><td className="border-b" style={{ borderColor: 'var(--border)' }}></td><td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>abgezogen</td><td className="px-2 py-1.5 border-b text-right font-mono whitespace-nowrap" style={{ borderColor: 'var(--border)' }}>− {eur(r.heiz.co2VermieterAnteil)}</td></tr>
                <tr><td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>Warmwasser (Grundkosten)</td><td className="border-b" style={{ borderColor: 'var(--border)' }}></td><td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>nach Wohnfläche</td><td className="px-2 py-1.5 border-b text-right font-mono whitespace-nowrap" style={{ borderColor: 'var(--border)' }}>{eur(r.warm.grundMieter)}</td></tr>
                <tr><td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>Warmwasser (Verbrauch)</td><td className="border-b" style={{ borderColor: 'var(--border)' }}></td><td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>nach Zählerstand</td><td className="px-2 py-1.5 border-b text-right font-mono whitespace-nowrap" style={{ borderColor: 'var(--border)' }}>{eur(r.warm.verbrauchMieter)}</td></tr>
                <tr className="font-bold"><td className="px-2 py-2 border-t-2" style={{ borderColor: 'var(--text)' }}>Summe Betriebskosten</td><td className="border-t-2" style={{ borderColor: 'var(--text)' }}></td><td className="border-t-2" style={{ borderColor: 'var(--text)' }}></td><td className="px-2 py-2 border-t-2 text-right font-mono whitespace-nowrap" style={{ borderColor: 'var(--text)' }}>{eur(r.gesamtMieter)}</td></tr>
                <tr><td className="px-2 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>abzüglich Vorauszahlungen</td><td className="border-b" style={{ borderColor: 'var(--border)' }}></td><td className="border-b" style={{ borderColor: 'var(--border)' }}></td><td className="px-2 py-1.5 border-b text-right font-mono whitespace-nowrap" style={{ borderColor: 'var(--border)' }}>− {eur(r.vorauszahlung)}</td></tr>
                <tr className="font-bold"><td className="px-2 py-2 border-t-2" style={{ borderColor: 'var(--text)' }}>{ergebnisPositiv ? 'Nachzahlung' : 'Guthaben'}</td><td className="border-t-2" style={{ borderColor: 'var(--text)' }}></td><td className="border-t-2" style={{ borderColor: 'var(--text)' }}></td><td className="px-2 py-2 border-t-2 text-right font-mono whitespace-nowrap" style={{ borderColor: 'var(--text)' }}>{eur(Math.abs(r.ergebnis))}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 rounded-md border border-dashed text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <b style={{ color: 'var(--text)' }}>Wichtig:</b> Diese Berechnung ist eine Informations- und
            Berechnungshilfe, keine Rechtsberatung. Ohne Gewähr. Vor Versand im Zweifel von einem
            Mieterverein oder Fachanwalt für Mietrecht prüfen lassen.
          </div>
        </div>
      )}
    </>
  );
}

export default function RechnerPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null | undefined>(undefined);
  const [state, setState] = useState<AppState>(defaultState());
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const unitCounter = useRef(2);
  const loadedRef = useRef(false);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) { router.replace('/login'); return; }
    setUser(current);
  }, [router]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.units) && parsed.units.length > 0) {
          const d = defaultState();
          setState({
            ...d, ...parsed,
            objekt: { ...d.objekt, ...(parsed.objekt || {}) },
            heizung: { ...d.heizung, ...(parsed.heizung || {}) },
            warmwasser: { ...d.warmwasser, ...(parsed.warmwasser || {}) },
          });
          unitCounter.current = Math.max(2, parsed.units.length);
        }
      }
    } catch { /* ignore */ }
    loadedRef.current = true;
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  function getUnit(id: string) { return state.units.find((u) => u.id === id) || state.units[0]; }
  const activeUnit = getUnit(state.activeUnitId);

  const handlers: Handlers = {
    updateObjekt: (field, value) => setState((s) => ({ ...s, objekt: { ...s.objekt, [field]: value } })),
    updateUnit: (idx, field, value) => setState((s) => ({ ...s, units: s.units.map((u, i) => (i === idx ? { ...u, [field]: value } : u)) })),
    updateItem: (idx, field, value) => setState((s) => ({ ...s, items: s.items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)) })),
    updateItemMeter: (idx, unitId, field, value) => setState((s) => ({
      ...s,
      items: s.items.map((it, i) => i === idx ? {
        ...it, unitMeters: { ...(it.unitMeters || {}), [unitId]: { ...((it.unitMeters || {})[unitId] || {}), [field]: value } },
      } : it),
    })),
    updateHeiz: (field, value) => setState((s) => ({ ...s, heizung: { ...s.heizung, [field]: value } })),
    updateWarm: (field, value) => setState((s) => ({ ...s, warmwasser: { ...s.warmwasser, [field]: value } })),
    updateHeizMeter: (unitId, field, value) => setState((s) => ({ ...s, heizung: { ...s.heizung, unitMeters: { ...s.heizung.unitMeters, [unitId]: { ...(s.heizung.unitMeters[unitId] || {}), [field]: value } } } })),
    updateWarmMeter: (unitId, field, value) => setState((s) => ({ ...s, warmwasser: { ...s.warmwasser, unitMeters: { ...s.warmwasser.unitMeters, [unitId]: { ...(s.warmwasser.unitMeters[unitId] || {}), [field]: value } } } })),
    addUnit: () => {
      unitCounter.current += 1;
      const id = 'u' + unitCounter.current;
      setState((s) => ({ ...s, units: [...s.units, { id, name: 'Wohnung ' + (s.units.length + 1), flaeche: '', personen: '', eigennutzung: false, mieterName: '', vorauszahlung: '' }] }));
    },
    removeUnit: (idx) => setState((s) => {
      if (s.units.length <= 1) return s;
      const removedId = s.units[idx].id;
      const units = s.units.filter((_, i) => i !== idx);
      return { ...s, units, activeUnitId: s.activeUnitId === removedId ? units[0].id : s.activeUnitId };
    }),
    addItem: () => setState((s) => ({ ...s, items: [...s.items, { name: 'Sonstige Betriebskosten', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: false, unitMeters: {} }] })),
    removeItem: (idx) => setState((s) => ({ ...s, items: s.items.filter((_, i) => i !== idx) })),
    setActiveUnitId: (id) => setState((s) => ({ ...s, activeUnitId: id })),
    fillExample: () => setState(exampleState()),
    resetAll: () => setState(defaultState()),
  };

  function goto(step: number) {
    setState((s) => ({ ...s, step: Math.max(0, Math.min(STEPS.length - 1, step)) }));
    window.scrollTo(0, 0);
  }

  if (!user) return null;

  const missingBasics = totalFlaeche(state.units) <= 0 || num(activeUnit.flaeche) <= 0;
  const stepId = STEPS[state.step].id;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="border-b print:hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-2xl px-5 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold" style={{ color: 'var(--blue)' }}>← veycron</Link>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>· Nebenkostenrechner</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{user}</span>
            <button type="button" onClick={() => { logout(); router.push('/'); }}
              className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-8 pb-24">
        <div className="print:hidden mb-6">
          <div className="flex gap-1 mb-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1 h-1.5 rounded-full" style={{ background: i <= state.step ? 'var(--blue)' : 'var(--border)' }} />
            ))}
          </div>
          <div className="flex justify-between text-xs font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
            {STEPS.map((s, i) => (
              <span key={s.id} style={i === state.step ? { color: 'var(--blue)', fontWeight: 600 } : undefined}>{s.label}</span>
            ))}
          </div>
        </div>

        {stepId === 'objekt' && <StepObjekt state={state} confirmingReset={confirmingReset} setConfirmingReset={setConfirmingReset} h={handlers} />}
        {stepId === 'kosten' && <StepKosten state={state} activeUnit={activeUnit} missingBasics={missingBasics} h={handlers} />}
        {stepId === 'heizung' && <StepHeizung state={state} activeUnit={activeUnit} missingBasics={missingBasics} h={handlers} />}
        {stepId === 'vorauszahlung' && <StepVorauszahlung state={state} activeUnit={activeUnit} h={handlers} />}
        {stepId === 'ergebnis' && <StepErgebnis state={state} activeUnit={activeUnit} missingBasics={missingBasics} detailsOpen={detailsOpen} setDetailsOpen={setDetailsOpen} h={handlers} />}

        <div className="flex justify-between mt-6 print:hidden">
          {state.step > 0 ? (
            <button type="button" className={btn('ghost')} style={btnStyle('ghost')} onClick={() => goto(state.step - 1)}>← Zurück</button>
          ) : <span />}
          {state.step < STEPS.length - 1 ? (
            <button type="button" className={btn('primary')} style={btnStyle('primary')} onClick={() => goto(state.step + 1)}>Weiter →</button>
          ) : <span />}
        </div>
      </div>
    </div>
  );
}
