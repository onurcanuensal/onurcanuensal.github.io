'use client';
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../lib/auth";
import { AppNav, WOHNUNGEN_KEY, type Wohnung } from "../components/AppShell";

type Schluessel = 'wohnflaeche' | 'personen' | 'einheiten' | 'verbrauch';
type Periode = 'jaehrlich' | 'quartal' | 'monatlich';
type Meter = { zEV?: string; zEA?: string; wEV?: string; wEA?: string; zNr?: string; wNr?: string }; // w* = Warmwasser (m³), nur bei Wasserversorgung
type Item = {
  name: string; formLabel?: string; betrag: string; schluessel: Schluessel; included: boolean; fixed: boolean;
  zHV?: string; zHA?: string; zNr?: string; unitMeters?: Record<string, Meter>; info?: string; periode?: Periode;
};
type Unit = {
  id: string; name: string; flaeche: string; personen: string;
  eigennutzung: boolean; mieterName: string; vorauszahlung: string;
};
type Heiz = {
  energietraeger: string; gesamtkosten: string; verbrauchsanteil: number;
  zHV: string; zHA: string; co2kosten: string; co2stufe: number; unitMeters: Record<string, Meter>;
  oelMenge: string; oelPreis: string;
  wartung: string; // Wartung & Messung der Heizung (€), zählt zu den Heizkosten
  wwPct: number;   // Warmwasser-Pauschale in % der Heizkosten (0 = aus, 18 = § 9 HeizkostenV ohne Wärmemengenzähler)
};
type Warm = { gesamtkosten: string; verbrauchsanteil: number; zHV: string; zHA: string; unitMeters: Record<string, Meter> };
type AppState = {
  step: number;
  objekt: { strasse: string; hausnummer: string; plz: string; ort: string; zeitraumVon: string; zeitraumBis: string; vermieter: string; vermieterAnschrift: string; iban: string; zahlbarBis: string };
  units: Unit[];
  activeUnitId: string;
  items: Item[];
  heizung: Heiz;
  warmwasser: Warm;
};

const STORAGE_KEY = 'veycron-rechner-v1';
const OLD_STORAGE_KEY = 'klarrechnung-rechner-v2';
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
    { name: 'Wasserversorgung', formLabel: 'Wasser (kalt + warm)', betrag: '', schluessel: 'verbrauch', included: true, fixed: true, zHV: '', zHA: '', unitMeters: {},
      info: 'Kaltwasser laut Rechnung deines Wasserwerks — die Heizkosten dafür trägst du im nächsten Schritt ein.' },
    { name: 'Entwässerung', formLabel: 'Abwasser (Schmutzwasser + Niederschlag)', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Aufzug', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Straßenreinigung & Müllbeseitigung', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Gebäudereinigung & Ungezieferbekämpfung', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Gartenpflege', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Beleuchtung', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Schornsteinreinigung', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true },
    { name: 'Sach- & Haftpflichtversicherung', betrag: '', schluessel: 'wohnflaeche', included: true, fixed: true,
      info: 'Gebäude- und Grundstücks-Haftpflichtversicherung — nicht deine private Hausratversicherung.' },
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
    objekt: { strasse: '', hausnummer: '', plz: '', ort: '', zeitraumVon: '', zeitraumBis: '', vermieter: '', vermieterAnschrift: '', iban: '', zahlbarBis: '' },
    units: defaultUnits(),
    activeUnitId: 'u2',
    items: defaultItems(),
    heizung: { energietraeger: 'gas', gesamtkosten: '', verbrauchsanteil: 70, zHV: '', zHA: '', co2kosten: '', co2stufe: 0, unitMeters: {}, oelMenge: '', oelPreis: '', wartung: '', wwPct: 0 },
    warmwasser: { gesamtkosten: '', verbrauchsanteil: 70, zHV: '', zHA: '', unitMeters: {} },
  };
}

function exampleState(): AppState {
  return {
    step: 0,
    objekt: { strasse: 'Gartenstraße', hausnummer: '12', plz: '86343', ort: 'Königsbrunn', zeitraumVon: '2025-01-01', zeitraumBis: '2025-12-31', vermieter: 'Max Mustermann', vermieterAnschrift: '', iban: '', zahlbarBis: '' },
    units: [
      { id: 'u1', name: 'Wohnung 1 (Erdgeschoss)', flaeche: '90', personen: '3', eigennutzung: true, mieterName: '', vorauszahlung: '' },
      { id: 'u2', name: 'Wohnung 2 (Obergeschoss)', flaeche: '68', personen: '2', eigennutzung: false, mieterName: 'Familie Beispiel', vorauszahlung: '900' },
    ],
    activeUnitId: 'u2',
    items: (() => {
      const EXAMPLE_VALUES: Record<string, Partial<Item>> = {
        'Grundsteuer': { betrag: '620' },
        'Wasserversorgung': { betrag: '980', zHV: '640', zHA: '810', unitMeters: { u2: { zEV: '120', zEA: '155' } } },
        'Entwässerung': { betrag: '540' },
        'Aufzug': { included: false },
        'Straßenreinigung & Müllbeseitigung': { betrag: '410' },
        'Gebäudereinigung & Ungezieferbekämpfung': { betrag: '260' },
        'Gartenpflege': { betrag: '180' },
        'Beleuchtung': { betrag: '90' },
        'Schornsteinreinigung': { betrag: '65' },
        'Sach- & Haftpflichtversicherung': { betrag: '340' },
        'Hauswart': { included: false },
        'Antenne / Kabel / Breitband': { betrag: '156', schluessel: 'personen' },
        'Wäschepflege (Gemeinschaft)': { betrag: '40' },
      };
      return defaultItems().map((it) => ({ ...it, ...(EXAMPLE_VALUES[it.name] || {}) }));
    })(),
    heizung: { energietraeger: 'gas', gesamtkosten: '2100', verbrauchsanteil: 70, zHV: '8200', zHA: '9650', co2kosten: '180', co2stufe: 28, unitMeters: { u2: { zEV: '1400', zEA: '1650' } }, oelMenge: '', oelPreis: '', wartung: '', wwPct: 0 },
    warmwasser: { gesamtkosten: '640', verbrauchsanteil: 70, zHV: '210', zHA: '245', unitMeters: { u2: { zEV: '38', zEA: '45' } } },
  };
}

function num(v: unknown): number { const n = parseFloat(String(v ?? '').replace(',', '.')); return isNaN(n) ? 0 : n; }
function eur(n: number): string { return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }
function safeDiv(a: number, b: number): number { return b > 0 ? a / b : 0; }

function totalFlaeche(units: Unit[]) { return units.reduce((s, u) => s + num(u.flaeche), 0); }
function totalPersonen(units: Unit[]) { return units.reduce((s, u) => s + num(u.personen), 0); }

function periodenFaktor(p?: Periode): number {
  if (p === 'monatlich') return 12;
  if (p === 'quartal') return 4;
  return 1;
}
function periodenLabel(p?: Periode): string {
  if (p === 'monatlich') return 'pro Monat';
  if (p === 'quartal') return 'pro Quartal';
  return 'pro Jahr';
}
function jahresBetrag(item: Item): number { return num(item.betrag) * periodenFaktor(item.periode); }

function itemShare(item: Item, unit: Unit, units: Unit[]): number {
  if (!item.included) return 0;
  const gesamt = jahresBetrag(item);
  if (item.schluessel === 'wohnflaeche') return gesamt * safeDiv(num(unit.flaeche), totalFlaeche(units));
  if (item.schluessel === 'personen') return gesamt * safeDiv(num(unit.personen), totalPersonen(units));
  if (item.schluessel === 'einheiten') return gesamt * safeDiv(1, units.length);
  if (item.schluessel === 'verbrauch') {
    const m = (item.unitMeters && item.unitMeters[unit.id]) || {};
    const vE = num(m.zEA) - num(m.zEV) + num(m.wEA) - num(m.wEV);
    const vH = num(item.zHA) - num(item.zHV);
    return gesamt * safeDiv(vE, vH);
  }
  return 0;
}

function co2Share(kgProM2: number): number {
  for (const t of CO2_TIERS) { if (kgProM2 < t.max) return t.share; }
  return 95;
}

function heizGesamt(h: Heiz | Warm): number {
  if ('energietraeger' in h && h.energietraeger === 'oel' && num(h.oelMenge) > 0 && num(h.oelPreis) > 0) {
    return num(h.oelMenge) * num(h.oelPreis);
  }
  return num(h.gesamtkosten);
}

// Brennstoff + Wartung = Heizkosten; davon geht die Warmwasser-Pauschale (wwPct) in den Warmwasser-Block.
function heizSplit(state: AppState) {
  const oel = heizGesamt(state.heizung);
  const wartung = num(state.heizung.wartung);
  const base = oel + wartung;
  const pct = num(state.heizung.wwPct);
  const abzug = (base * pct) / 100;
  return { oel, wartung, base, pct, abzug, heiz: base - abzug, warm: num(state.warmwasser.gesamtkosten) + abzug };
}

// Der Warmwasserzähler der Wohnung steht schon bei der Wasserversorgung (Schritt Kosten) — hier nicht doppelt eintragen.
function effWarm(state: AppState): Warm {
  const wasser = state.items.find((i) => i.name === 'Wasserversorgung' && i.included);
  if (!wasser) return state.warmwasser;
  const um = { ...state.warmwasser.unitMeters };
  state.units.forEach((u) => {
    const wm = wasser.unitMeters?.[u.id];
    if (wm && (wm.wEV || wm.wEA)) um[u.id] = { ...um[u.id], zEV: wm.wEV, zEA: wm.wEA, zNr: wm.wNr };
  });
  return { ...state.warmwasser, unitMeters: um };
}

function heatingCalc(h: Heiz | Warm, unit: Unit, units: Unit[], isWarm: boolean, gesamt: number) {
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
  const split = heizSplit(state);
  const heiz = heatingCalc(state.heizung, unit, state.units, false, split.heiz);
  const warm = heatingCalc(effWarm(state), unit, state.units, true, split.warm);
  const gesamtMieter = itemsTotal + heiz.final + warm.final;
  const vorauszahlung = num(unit.vorauszahlung);
  const ergebnis = gesamtMieter - vorauszahlung;
  return { itemResults, itemsTotal, split, heiz, warm, gesamtMieter, vorauszahlung, ergebnis };
}

function meterMissing(m: Meter | undefined, haus: { zHV?: string; zHA?: string }): boolean {
  return num(m?.zEA) - num(m?.zEV) + num(m?.wEA) - num(m?.wEV) <= 0 || num(haus.zHA) - num(haus.zHV) <= 0;
}

function itemProblem(it: Item, unit: Unit, units: Unit[]): string | null {
  if (!it.included || num(it.betrag) <= 0) return null;
  if (it.schluessel === 'verbrauch' && meterMissing(it.unitMeters?.[unit.id], it)) return 'Zählerstände fehlen — Anteil wird 0,00 €';
  if (it.schluessel === 'personen' && totalPersonen(units) <= 0) return 'Personenzahl fehlt — Anteil wird 0,00 €';
  return null;
}

function heizProblem(h: Heiz | Warm, unit: Unit, gesamt: number): string | null {
  if (gesamt <= 0 || num(h.verbrauchsanteil) <= 0) return null;
  return meterMissing(h.unitMeters?.[unit.id], h) ? 'Zählerstände fehlen — Verbrauchsanteil wird 0,00 €' : null;
}

function collectProblems(state: AppState, unit: Unit): string[] {
  const out: string[] = [];
  const { objekt: o, units, items } = state;
  if (!o.vermieter.trim()) out.push('Name Vermieter·in fehlt');
  if (!o.zeitraumVon || !o.zeitraumBis) out.push('Abrechnungszeitraum fehlt');
  if (!unit.mieterName.trim()) out.push('Name Mieter·in fehlt');
  if (totalFlaeche(units) <= 0 || num(unit.flaeche) <= 0) out.push('Wohnfläche fehlt');
  const leer = items.filter((it) => it.included && num(it.betrag) <= 0).map((it) => it.formLabel || it.name);
  if (leer.length) out.push(`Ohne Betrag (eintragen oder ausschalten): ${leer.join(', ')}`);
  items.forEach((it) => { const p = itemProblem(it, unit, units); if (p) out.push(`${it.formLabel || it.name}: ${p}`); });
  const split = heizSplit(state);
  if (split.base <= 0) out.push('Heizung: Gesamtkosten fehlen');
  const hp = heizProblem(state.heizung, unit, split.heiz); if (hp) out.push(`Heizung: ${hp}`);
  const wp = heizProblem(effWarm(state), unit, split.warm); if (wp) out.push(`Warmwasser: ${wp}`);
  if (num(unit.vorauszahlung) <= 0) out.push('Vorauszahlungen fehlen');
  return out;
}

function schluesselLabel(s: Schluessel) {
  return ({ wohnflaeche: 'nach Wohnfläche', personen: 'nach Personenzahl', einheiten: 'gleichmäßig verteilt', verbrauch: 'nach Verbrauch' } as Record<string, string>)[s] || s;
}
function schluesselHelp(s: Schluessel) {
  return ({
    wohnflaeche: 'Der Normalfall: Eine Wohnung mit mehr Quadratmetern zahlt einen größeren Anteil.',
    personen: 'Wird nach Anzahl der Personen pro Wohnung verteilt — üblich z. B. beim Müll.',
    einheiten: 'Alle Wohnungen zahlen den gleichen Anteil, egal wie groß sie sind.',
    verbrauch: 'Wird nach dem tatsächlichen Verbrauch berechnet. Dafür brauchst du die Zählerstände.',
  } as Record<string, string>)[s] || '';
}
function isBlocked(name: string) {
  const l = (name || '').toLowerCase();
  return BLOCKED_WORDS.some((w) => l.indexOf(w) !== -1);
}

// ── shared style helpers ──
const card = "rounded-xl border p-5 sm:p-6 mb-4";
const cardStyle = { borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' };
const heading = "text-lg font-semibold mb-1";
const headingStyle: React.CSSProperties = { color: 'var(--text)', fontFamily: 'var(--font-display)' };
const label = "block text-xs font-medium mb-1";
const labelStyle = { color: 'var(--text-secondary)' };
const inputCls = "field-input";
const mono: React.CSSProperties = { fontFamily: 'var(--font-data)', fontVariantNumeric: 'tabular-nums' };

function Field({ labelText, value, onChange, type = 'text', placeholder }: {
  labelText: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className={label} style={labelStyle}>{labelText}</label>
      <input type={type} value={value ?? ''} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} className={inputCls} style={type === 'number' ? mono : undefined} />
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
  importWohnungen: () => void;
  hasWohnungen: boolean;
};

function BasicsWarning({ missingBasics }: { missingBasics: boolean }) {
  if (!missingBasics) return null;
  return (
    <div className="rounded-md border px-4 py-3 text-sm mb-4" style={{ borderColor: 'var(--amber)', background: 'var(--amber-tint)', color: 'var(--text)' }}>
      Trag zuerst im ersten Schritt die Wohnungen mit ihrer Fläche ein — ohne sie kann nichts berechnet werden.
    </div>
  );
}

function ActiveUnitBar({ units, activeUnit, setActiveUnitId }: { units: Unit[]; activeUnit: Unit; setActiveUnitId: (id: string) => void }) {
  if (units.length < 2) return null;
  return (
    <div className="rounded-xl border px-4 py-3 mb-4 flex flex-wrap items-center gap-3 text-sm"
      style={{ borderColor: 'var(--blue-light)', background: 'var(--bg-card)', borderLeftWidth: '3px' }}>
      <label style={labelStyle} className="mb-0 shrink-0">Du rechnest gerade ab für</label>
      <select value={activeUnit.id} onChange={(e) => setActiveUnitId(e.target.value)}
        className="field-input flex-1 min-w-[200px]" style={{ width: 'auto' }}>
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
        <h2 className={heading} style={headingStyle}>Willkommen</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Halte bereit: die Rechnungen des Abrechnungszeitraums (Wasser/Abwasser, Müll, Versicherung, Heizöl/Gas, Wartung),
          die Zählerstände am Anfang und Ende des Zeitraums (Kaltwasser, Warmwasser, Heizung) und die Zählernummern.
          Wir führen dich Schritt für Schritt durch fünf Seiten; unten siehst du jederzeit, wie weit du bist.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          {h.hasWohnungen && <button type="button" className="btn btn-primary" onClick={h.importWohnungen}>Aus Wohnungsübersicht übernehmen</button>}
          <button type="button" className="btn btn-ghost" onClick={h.fillExample}>
            Mit Beispielwerten ausfüllen
          </button>
          {confirmingReset ? (
            <>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Wirklich alles löschen?</span>
              <button type="button" className="btn btn-danger" onClick={() => { h.resetAll(); setConfirmingReset(false); }}>Ja, löschen</button>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmingReset(false)}>Abbrechen</button>
            </>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => setConfirmingReset(true)}>Alles zurücksetzen</button>
          )}
        </div>
      </div>

      <div className={card} style={cardStyle}>
        <h2 className={`${heading} mb-3`} style={headingStyle}>Haus &amp; Zeitraum</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <Field labelText="Name Vermieter·in" value={o.vermieter} onChange={(v) => h.updateObjekt('vermieter', v)} />
          <Field labelText="Anschrift Vermieter·in (optional)" value={o.vermieterAnschrift} onChange={(v) => h.updateObjekt('vermieterAnschrift', v)} />
          <Field labelText="IBAN für Nachzahlung/Guthaben (optional)" value={o.iban} onChange={(v) => h.updateObjekt('iban', v)} />
          <Field labelText="Zahlbar bis (optional)" type="date" value={o.zahlbarBis} onChange={(v) => h.updateObjekt('zahlbarBis', v)} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Field labelText="Straße" value={o.strasse} onChange={(v) => h.updateObjekt('strasse', v)} />
          <Field labelText="Hausnummer" value={o.hausnummer} onChange={(v) => h.updateObjekt('hausnummer', v)} />
          <Field labelText="PLZ" value={o.plz} onChange={(v) => h.updateObjekt('plz', v)} />
          <Field labelText="Ort" value={o.ort} onChange={(v) => h.updateObjekt('ort', v)} />
          <Field labelText="Zeitraum von" type="date" value={o.zeitraumVon} onChange={(v) => h.updateObjekt('zeitraumVon', v)} />
          <Field labelText="Zeitraum bis" type="date" value={o.zeitraumBis} onChange={(v) => h.updateObjekt('zeitraumBis', v)} />
        </div>
      </div>

      <div className={card} style={cardStyle}>
        <h2 className={heading} style={headingStyle}>Wohnungen im Haus</h2>
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
                <button type="button" className="btn btn-danger" onClick={() => h.removeUnit(i)}>×</button>
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
        <button type="button" className="btn btn-ghost" onClick={h.addUnit}>+ Weitere Wohnung hinzufügen</button>
        <div className="flex flex-wrap gap-6 mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>Gesamtfläche Haus: <b style={{ color: 'var(--text)' }}>{totalFlaeche(state.units).toLocaleString('de-DE')} m²</b></span>
          <span>Personen gesamt: <b style={{ color: 'var(--text)' }}>{totalPersonen(state.units).toLocaleString('de-DE')}</b></span>
          <span>Wohneinheiten: <b style={{ color: 'var(--text)' }}>{state.units.length}</b></span>
        </div>
      </div>
    </>
  );
}

// Ein Zähler in einer Zeile: Nummer, Stand Beginn, Stand Ende — der Verbrauch wird sofort angezeigt.
function MeterRow({ title, einheit, nr, von, bis, onNr, onVon, onBis }: {
  title: string; einheit: string; nr?: string; von: string; bis: string;
  onNr?: (v: string) => void; onVon: (v: string) => void; onBis: (v: string) => void;
}) {
  const v = num(bis) - num(von);
  return (
    <div className="rounded-md border p-3" style={{ borderColor: 'var(--border)' }}>
      <div className="flex justify-between gap-2 mb-2 text-sm">
        <span className="font-medium" style={{ color: 'var(--text)' }}>{title}</span>
        {(von !== '' || bis !== '') && (
          <span style={{ ...mono, color: v > 0 ? 'var(--text)' : 'var(--bad)' }}>Verbrauch: {fmt(v, 3)} {einheit}</span>
        )}
      </div>
      <div className={`grid grid-cols-1 ${onNr ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-2`}>
        {onNr && <Field labelText="Zählernummer" value={nr || ''} onChange={onNr} />}
        <Field labelText="Stand Beginn" type="number" value={von} onChange={onVon} />
        <Field labelText="Stand Ende" type="number" value={bis} onChange={onBis} />
      </div>
    </div>
  );
}

function StepKosten({ state, activeUnit, missingBasics, h }: { state: AppState; activeUnit: Unit; missingBasics: boolean; h: Handlers }) {
  const unit = activeUnit;
  return (
    <>
      <ActiveUnitBar units={state.units} activeUnit={activeUnit} setActiveUnitId={h.setActiveUnitId} />
      <BasicsWarning missingBasics={missingBasics} />
      <div className={card} style={cardStyle}>
        <h2 className={heading} style={headingStyle}>Deine Kosten</h2>
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          Die üblichen Kostenarten stehen schon da. Trag bei jeder ein, wie viel du dafür im ganzen
          Jahr für das ganze Haus bezahlt hast — die Zahl findest du auf der jeweiligen Jahresrechnung
          (z. B. vom Wasserwerk oder der Versicherung). Was bei dir nicht vorkommt, schaltest du
          rechts einfach aus.
        </p>
        <div className="rounded-md border px-4 py-3 text-sm mb-4" style={{ borderColor: 'var(--blue)', background: '#eaf1f7' }}>
          Zwei Rechnungen überschneiden sich im Abrechnungszeitraum (z. B. Nachzahlung 2026 +
          Vorauszahlung 2027)? Beide Beträge zusammenzählen — entscheidend ist, was du in diesem
          Zeitraum tatsächlich bezahlt hast, nicht das Rechnungsjahr.
        </div>
        <div className="rounded-md border px-4 py-3 text-sm mb-4" style={{ borderColor: 'var(--amber)', background: 'var(--amber-tint)' }}>
          Nicht umlagefähig: Hausverwaltung, Reparaturen, Leerstand, Kredite/Zinsen.
        </div>
        <div className="space-y-3">
          {state.items.map((it, i) => {
            const showMeter = it.schluessel === 'verbrauch';
            const blocked = isBlocked(it.name);
            const m = (it.unitMeters && it.unitMeters[unit.id]) || {};
            return (
              <div key={i} className={`item-card${it.included ? '' : ' is-off'}`} style={{ opacity: it.included ? 1 : 0.55 }}>
                <div className="flex justify-between items-start gap-2 mb-2">
                  {it.fixed ? (
                    <div>
                      <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>{it.formLabel || it.name}</div>
                      {it.formLabel && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>amtlich: {it.name}</div>}
                    </div>
                  ) : (
                    <input type="text" value={it.name} onChange={(e) => h.updateItem(i, 'name', e.target.value)} className={inputCls} />
                  )}
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="inline-flex items-center gap-1 text-xs whitespace-nowrap">
                      <input type="checkbox" checked={it.included} onChange={(e) => h.updateItem(i, 'included', e.target.checked)} /> an
                    </label>
                    {!it.fixed && <button type="button" onClick={() => h.removeItem(i)} className="text-xs" style={{ color: 'var(--bad)' }}>×</button>}
                  </div>
                </div>
                {it.info && <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{it.info}</p>}
                {blocked && <div className="text-xs mb-2" style={{ color: 'var(--bad)' }}>Evtl. nicht umlagefähig — prüfen</div>}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-1">
                  <Field labelText="Bezahlt fürs ganze Haus (€)" type="number" value={it.betrag} placeholder="0,00" onChange={(v) => h.updateItem(i, 'betrag', v)} />
                  <div>
                    <label className={label} style={labelStyle}>Zeitraum</label>
                    <select value={it.periode || 'jaehrlich'} onChange={(e) => h.updateItem(i, 'periode', e.target.value as Periode)} className={inputCls}>
                      <option value="jaehrlich">pro Jahr</option>
                      <option value="quartal">pro Quartal</option>
                      <option value="monatlich">pro Monat</option>
                    </select>
                  </div>
                  <div>
                    <label className={label} style={labelStyle}>Wie wird aufgeteilt?</label>
                    <select value={it.schluessel} onChange={(e) => h.updateItem(i, 'schluessel', e.target.value as Schluessel)} className={inputCls}>
                      {(['wohnflaeche', 'personen', 'einheiten', 'verbrauch'] as Schluessel[]).map((s) => (
                        <option key={s} value={s}>{schluesselLabel(s)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {(it.periode === 'monatlich' || it.periode === 'quartal') && num(it.betrag) > 0 && (
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                    = {eur(jahresBetrag(it))} im Jahr ({periodenLabel(it.periode)} × {periodenFaktor(it.periode)})
                  </p>
                )}
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{schluesselHelp(it.schluessel)}</p>
                {showMeter && (() => {
                  const isWasser = it.name === 'Wasserversorgung';
                  const unit_ = isWasser ? 'm³' : 'Einh.';
                  const vWohnung = num(m.zEA) - num(m.zEV) + (isWasser ? num(m.wEA) - num(m.wEV) : 0);
                  const vHaus = num(it.zHA) - num(it.zHV);
                  const pe = totalPersonen(state.units), peU = num(unit.personen);
                  return (
                    <div className="space-y-2 mb-2">
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {isWasser
                          ? 'Lies die Zähler zu Beginn und am Ende des Abrechnungszeitraums ab. Der Hauptzähler des Wasserwerks zählt Kalt- und Warmwasser zusammen.'
                          : 'Verbrauch = Stand am Ende − Stand am Beginn des Abrechnungszeitraums.'}
                      </p>
                      <MeterRow title={isWasser ? 'Kaltwasser dieser Wohnung' : 'Zähler dieser Wohnung'} einheit={unit_}
                        nr={m.zNr || ''} von={m.zEV || ''} bis={m.zEA || ''}
                        onNr={(v) => h.updateItemMeter(i, unit.id, 'zNr', v)} onVon={(v) => h.updateItemMeter(i, unit.id, 'zEV', v)} onBis={(v) => h.updateItemMeter(i, unit.id, 'zEA', v)} />
                      {isWasser && (
                        <MeterRow title="Warmwasser dieser Wohnung" einheit="m³"
                          nr={m.wNr || ''} von={m.wEV || ''} bis={m.wEA || ''}
                          onNr={(v) => h.updateItemMeter(i, unit.id, 'wNr', v)} onVon={(v) => h.updateItemMeter(i, unit.id, 'wEV', v)} onBis={(v) => h.updateItemMeter(i, unit.id, 'wEA', v)} />
                      )}
                      <MeterRow title={isWasser ? 'Hauptzähler des Hauses (Wasserwerk)' : 'Zähler fürs ganze Haus'} einheit={unit_}
                        nr={it.zNr || ''} von={it.zHV || ''} bis={it.zHA || ''}
                        onNr={(v) => h.updateItem(i, 'zNr', v)} onVon={(v) => h.updateItem(i, 'zHV', v)} onBis={(v) => h.updateItem(i, 'zHA', v)} />
                      {vHaus <= 0 && vWohnung > 0 && peU > 0 && (
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
                          h.updateItem(i, 'zHV', '0');
                          h.updateItem(i, 'zHA', String(Math.round(((vWohnung * pe) / peU) * 1000) / 1000));
                        }}>
                          Hauszähler unbekannt? Verbrauch nach Personenzahl schätzen
                        </button>
                      )}
                      {vWohnung > 0 && vHaus > 0 && (
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Diese Wohnung: <b style={mono}>{fmt(vWohnung, 3)} {unit_}</b> von <b style={mono}>{fmt(vHaus, 3)} {unit_}</b> = <b style={mono}>{fmt((vWohnung / vHaus) * 100, 1)} %</b>
                        </p>
                      )}
                    </div>
                  );
                })()}
                {itemProblem(it, unit, state.units) && (
                  <p className="text-xs mb-2" style={{ color: 'var(--bad)' }}>{itemProblem(it, unit, state.units)}</p>
                )}
                <div className="text-sm text-right pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Anteil {unit.name}: </span>
                  <span className="font-mono font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>{eur(itemShare(it, unit, state.units))}</span>
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" className="btn btn-ghost mt-4" onClick={h.addItem}>+ Sonstige Betriebskosten hinzufügen</button>
      </div>
    </>
  );
}

function HeizBlock({ prefix, h, title, hint, showCO2, unit, split, linked, pe, onUpdate, onUpdateMeter }: {
  prefix: 'heizung' | 'warmwasser'; h: Heiz | Warm; title: string; hint: string; showCO2: boolean; unit: Unit;
  split: ReturnType<typeof heizSplit>;
  linked?: boolean; // Zähler der Wohnung kommt aus der Wasserversorgung
  pe: { u: number; t: number }; // Personen: diese Wohnung / ganzes Haus (für die Schätzung)
  onUpdate: (field: string, value: string | number) => void;
  onUpdateMeter: (unitId: string, field: keyof Meter, value: string) => void;
}) {
  const m = (h.unitMeters && h.unitMeters[unit.id]) || {};
  return (
    <div className={card} style={cardStyle}>
      <h2 className={heading} style={headingStyle}>{title}</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{hint}</p>
      {prefix === 'heizung' && 'energietraeger' in h && (
        <div className="mb-3">
          <label className={label} style={labelStyle}>Energieträger</label>
          <select value={h.energietraeger} onChange={(e) => onUpdate('energietraeger', e.target.value)} className={inputCls}>
            <option value="gas">Erdgas (€/m³)</option>
            <option value="oel">Heizöl (€/Liter)</option>
            <option value="fernwaerme">Fernwärme (€/kWh)</option>
            <option value="strom">Strom / Wärmepumpe (€/kWh)</option>
          </select>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-1">
        {prefix === 'heizung' && 'energietraeger' in h && h.energietraeger === 'oel' ? (
          <>
            <Field labelText="Menge (Liter)" type="number" value={h.oelMenge} onChange={(v) => onUpdate('oelMenge', v)} />
            <Field labelText="Preis pro Liter (€)" type="number" value={h.oelPreis} onChange={(v) => onUpdate('oelPreis', v)} />
          </>
        ) : (
          <Field labelText={prefix === 'warmwasser' && split.pct > 0 ? 'Weitere Warmwasser-Kosten (€, nur falls separat berechnet)' : 'Gesamtkosten fürs Haus lt. Rechnung (€)'}
            type="number" value={h.gesamtkosten} onChange={(v) => onUpdate('gesamtkosten', v)} />
        )}
      </div>
      {prefix === 'heizung' && 'energietraeger' in h && h.energietraeger === 'oel' && num(h.oelMenge) > 0 && num(h.oelPreis) > 0 && (
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          = {eur(num(h.oelMenge) * num(h.oelPreis))} Brennstoffkosten
        </p>
      )}
      {prefix === 'heizung' && 'wartung' in h && (
        <div className="mb-3 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <Field labelText="Wartung & Messung der Heizung (€, im Zeitraum bezahlt)" type="number" value={h.wartung} onChange={(v) => onUpdate('wartung', v)} />
          </div>
          <label className="inline-flex items-start gap-2 text-sm" style={{ color: 'var(--text)' }}>
            <input type="checkbox" className="mt-1" checked={h.wwPct > 0} onChange={(e) => onUpdate('wwPct', e.target.checked ? 18 : 0)} />
            <span>
              Warmwasser wird mit der Heizung erwärmt, ohne eigenen Wärmemengenzähler: pauschal 18 % der Heizkosten gehen ins Warmwasser (§ 9 HeizkostenV).
            </span>
          </label>
        </div>
      )}
      {split.base > 0 && (
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          {prefix === 'heizung'
            ? <>Heizkosten gesamt {eur(split.base)}{split.pct > 0 && <> · davon Heizung {eur(split.heiz)}, Warmwasser {eur(split.abzug)}</>}</>
            : split.pct > 0 && <>Warmwasser-Anteil aus den Heizkosten: {eur(split.abzug)}{num(h.gesamtkosten) > 0 && <> + {eur(num(h.gesamtkosten))} weitere = {eur(split.warm)}</>}</>}
        </p>
      )}
      <div className="rounded-md border p-4 mt-3" style={{ borderColor: 'var(--border)' }}>
        <label className="inline-flex items-start gap-2 text-sm font-medium" style={{ color: 'var(--text)' }}>
          <input type="checkbox" className="mt-1" checked={h.verbrauchsanteil > 0} onChange={(e) => onUpdate('verbrauchsanteil', e.target.checked ? 70 : 0)} />
          <span>{prefix === 'heizung' ? 'Es gibt Heizkostenverteiler oder Wärmezähler: teilweise nach Verbrauch verteilen' : 'Es gibt Warmwasserzähler: teilweise nach Verbrauch verteilen'}</span>
        </label>
        {h.verbrauchsanteil > 0 ? (
          <div className="mt-3 space-y-2">
            <div className="max-w-xs">
              <label className={label} style={labelStyle}>Anteil nach Verbrauch (Rest nach Wohnfläche)</label>
              <select value={h.verbrauchsanteil} onChange={(e) => onUpdate('verbrauchsanteil', Number(e.target.value))} className={inputCls}>
                {[50, 60, 70].map((p) => <option key={p} value={p}>{p} %</option>)}
              </select>
            </div>
            {linked ? (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Warmwasserzähler dieser Wohnung: aus dem Schritt „Kosten“ übernommen ({fmt(num(m.zEA) - num(m.zEV), 3)} m³).
              </p>
            ) : (
              <MeterRow title={`Zähler dieser Wohnung (${unit.name})`} einheit={prefix === 'heizung' ? 'Einh.' : 'm³'}
                von={m.zEV || ''} bis={m.zEA || ''} onVon={(v) => onUpdateMeter(unit.id, 'zEV', v)} onBis={(v) => onUpdateMeter(unit.id, 'zEA', v)} />
            )}
            <MeterRow title={prefix === 'heizung' ? 'Alle Verteiler/Zähler im Haus zusammen' : 'Alle Warmwasserzähler im Haus zusammen'} einheit={prefix === 'heizung' ? 'Einh.' : 'm³'}
              von={h.zHV} bis={h.zHA} onVon={(v) => onUpdate('zHV', v)} onBis={(v) => onUpdate('zHA', v)} />
            {num(h.zHA) - num(h.zHV) <= 0 && num(m.zEA) - num(m.zEV) > 0 && pe.u > 0 && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => {
                onUpdate('zHV', '0');
                onUpdate('zHA', String(Math.round((((num(m.zEA) - num(m.zEV)) * pe.t) / pe.u) * 1000) / 1000));
              }}>
                Hausverbrauch unbekannt? Nach Personenzahl schätzen
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Alles wird nach Wohnfläche verteilt. Ohne Verbrauchserfassung darf der Mieter seinen Anteil um 15 % kürzen (§ 12 HeizkostenV).
          </p>
        )}
      </div>
      {heizProblem(h, unit, prefix === 'heizung' ? split.heiz : split.warm) && (
        <p className="text-xs mt-2" style={{ color: 'var(--bad)' }}>{heizProblem(h, unit, prefix === 'heizung' ? split.heiz : split.warm)}</p>
      )}
      {showCO2 && 'co2stufe' in h && (
        <>
          <div className="rounded-md border px-4 py-3 text-sm my-4" style={{ borderColor: 'var(--blue)', background: '#eaf1f7' }}>
            Bei Öl-/Gasheizungen trägst du je nach Energieeffizienz einen Teil der CO2-Kosten. Werte unbekannt? Felder leer lassen.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field labelText="CO2-Kosten fürs Haus (€, falls auf der Rechnung ausgewiesen)" type="number" value={h.co2kosten} onChange={(v) => onUpdate('co2kosten', v)} />
            <Field labelText="Energiewert des Gebäudes (kg CO2/m² im Jahr, steht auf der Heizkostenrechnung)" type="number" value={String(h.co2stufe)} onChange={(v) => onUpdate('co2stufe', num(v))} />
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
  const split = heizSplit(state);
  const warm = effWarm(state);
  const wasser = state.items.find((i) => i.name === 'Wasserversorgung' && i.included);
  const wm = wasser?.unitMeters?.[activeUnit.id];
  const linked = !!(wm && (wm.wEV || wm.wEA));
  const pe = { u: num(activeUnit.personen), t: totalPersonen(state.units) };
  return (
    <>
      <ActiveUnitBar units={state.units} activeUnit={activeUnit} setActiveUnitId={h.setActiveUnitId} />
      <BasicsWarning missingBasics={missingBasics} />
      <div className="rounded-md border px-4 py-3 text-sm mb-4" style={{ borderColor: 'var(--blue)', background: '#eaf1f7' }}>
        <b>So geht&apos;s:</b> 1. Heizkosten eintragen (Brennstoff + Wartung). 2. Angeben, ob es Zähler gibt — wenn nein, wird nach Wohnfläche verteilt.
        3. Beim Warmwasser den Haken für die 18-%-Pauschale setzen, wenn kein Wärmemengenzähler am Boiler hängt.
      </div>
      <HeizBlock prefix="heizung" h={state.heizung} title="Heizung" hint="Kosten fürs Beheizen laut Rechnung deines Energieversorgers." showCO2 unit={activeUnit} split={split} pe={pe}
        onUpdate={(f, v) => h.updateHeiz(f as keyof Heiz, v)} onUpdateMeter={h.updateHeizMeter} />
      <HeizBlock prefix="warmwasser" h={warm} title="Warmwasser" hint="Nicht das Wasser selbst (das steht bei den Kosten), sondern die Energie zum Erwärmen — meist auf derselben Rechnung wie die Heizung, oft mit eigenem Zähler." showCO2={false} unit={activeUnit} split={split} linked={linked} pe={pe}
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
        <h2 className={heading} style={headingStyle}>Vorauszahlungen von {activeUnit.mieterName || activeUnit.name}</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Der Betrag, den dieser Mieter im Abrechnungszeitraum monatlich schon vorausbezahlt hat
          (Summe über das ganze Jahr).
        </p>
        <Field labelText="Geleistete Vorauszahlungen gesamt (€)" type="number" value={activeUnit.vorauszahlung} onChange={(v) => h.updateUnit(idx, 'vorauszahlung', v)} />
      </div>
    </>
  );
}

const fmt = (n: number, d = 2) => n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const money = (n: number) => (n < 0 ? `− ${eur(-n)}` : eur(n));
const D2 = { day: '2-digit', month: '2-digit', year: 'numeric' } as const;
const dateDE = (s: string) => (s ? new Date(s).toLocaleDateString('de-DE', D2) : '…');

type DocLine = { name: string; gesamt: number; key: string; basis: string; anteil: number };

function StepErgebnis({ state, activeUnit, detailsOpen, setDetailsOpen, h }: {
  state: AppState; activeUnit: Unit; detailsOpen: boolean; setDetailsOpen: (v: boolean) => void; h: Handlers;
}) {
  const unit = activeUnit;
  const r = computeAll(state, unit);
  const nachzahlung = r.ergebnis >= 0;
  const o = state.objekt;
  const problems = collectProblems(state, unit);
  const { split } = r;

  const fl = totalFlaeche(state.units), pe = totalPersonen(state.units), n = state.units.length;
  const pct = (a: number, b: number) => (b > 0 ? ` (${fmt((a / b) * 100, 1)} %)` : '');
  const flaecheBasis = `${fmt(num(unit.flaeche))} m² von ${fmt(fl)} m²${pct(num(unit.flaeche), fl)}`;

  const itemLines: DocLine[] = r.itemResults
    .filter((x) => x.item.included && jahresBetrag(x.item) > 0)
    .map(({ item, share }) => {
      const m = item.unitMeters?.[unit.id] || {};
      const vE = num(m.zEA) - num(m.zEV) + num(m.wEA) - num(m.wEV);
      const vH = num(item.zHA) - num(item.zHV);
      const u = item.name === 'Wasserversorgung' ? 'm³' : 'Einh.';
      const basis =
        item.schluessel === 'wohnflaeche' ? flaecheBasis
        : item.schluessel === 'personen' ? `${fmt(num(unit.personen), 0)} von ${fmt(pe, 0)} Personen${pct(num(unit.personen), pe)}`
        : item.schluessel === 'einheiten' ? `1 von ${n} Wohneinheiten${pct(1, n)}`
        : `${fmt(vE, 3)} ${u} von ${fmt(vH, 3)} ${u}${pct(vE, vH)}`;
      return { name: item.name, gesamt: jahresBetrag(item), key: schluesselLabel(item.schluessel), basis, anteil: share };
    });

  const heatLines = (hz: Heiz | Warm, gesamt: number, calc: ReturnType<typeof heatingCalc>, name: string, einheit: string): DocLine[] => {
    const v = num(hz.verbrauchsanteil) / 100;
    const m = hz.unitMeters?.[unit.id] || {};
    const vE = num(m.zEA) - num(m.zEV), vH = num(hz.zHA) - num(hz.zHV);
    const out: DocLine[] = [];
    if (gesamt * (1 - v) > 0) out.push({ name: `${name}, Grundkosten (${fmt((1 - v) * 100, 0)} %)`, gesamt: gesamt * (1 - v), key: 'nach Wohnfläche', basis: flaecheBasis, anteil: calc.grundMieter });
    if (gesamt * v > 0) out.push({ name: `${name}, Verbrauch (${fmt(v * 100, 0)} %)`, gesamt: gesamt * v, key: 'nach Verbrauch', basis: `${fmt(vE, 3)} ${einheit} von ${fmt(vH, 3)} ${einheit}${pct(vE, vH)}`, anteil: calc.verbrauchMieter });
    return out;
  };
  const co2Lines: DocLine[] = num(state.heizung.co2kosten) > 0 ? [{
    name: `CO2-Kosten, abzüglich Vermieteranteil ${r.heiz.co2Prozent} %`, gesamt: num(state.heizung.co2kosten), key: 'Stufenmodell CO2KostAufG',
    basis: `Vermieteranteil ${fmt(num(state.heizung.co2kosten) * (r.heiz.co2Prozent / 100))} €`, anteil: -r.heiz.co2VermieterAnteil,
  }] : [];
  const lines: DocLine[] = [
    ...itemLines,
    ...heatLines(state.heizung, split.heiz, r.heiz, 'Heizkosten', 'Einh.'),
    ...co2Lines,
    ...heatLines(effWarm(state), split.warm, r.warm, 'Warmwasser-Erwärmung', 'm³'),
  ];

  const wasser = state.items.find((i) => i.name === 'Wasserversorgung' && i.included);
  const wm = wasser?.unitMeters?.[unit.id] || {};
  const hm = state.heizung.unitMeters?.[unit.id] || {};
  const wwm = effWarm(state).unitMeters?.[unit.id] || {};
  const warmLinked = !!(wm.wEV || wm.wEA);
  type MRow = { name: string; nr?: string; von: number; bis: number; einheit: string };
  const mrows = [
    wasser && { name: 'Kaltwasser, Wohnung', nr: wm.zNr, von: num(wm.zEV), bis: num(wm.zEA), einheit: 'm³' },
    wasser && { name: 'Warmwasser, Wohnung', nr: wm.wNr, von: num(wm.wEV), bis: num(wm.wEA), einheit: 'm³' },
    wasser && { name: 'Wasser gesamt, Hauptzähler Haus', nr: wasser.zNr, von: num(wasser.zHV), bis: num(wasser.zHA), einheit: 'm³' },
    { name: 'Heizung, Wohnung', von: num(hm.zEV), bis: num(hm.zEA), einheit: 'Einh.' },
    { name: 'Heizung, Haus (alle Verteiler)', von: num(state.heizung.zHV), bis: num(state.heizung.zHA), einheit: 'Einh.' },
    !warmLinked && { name: 'Warmwasser-Erwärmung, Wohnung', nr: wwm.zNr, von: num(wwm.zEV), bis: num(wwm.zEA), einheit: 'm³' },
    { name: 'Warmwasser, Haus (alle Zähler)', von: num(state.warmwasser.zHV), bis: num(state.warmwasser.zHA), einheit: 'm³' },
  ].filter((x): x is MRow => !!x && (x.von > 0 || x.bis > 0));

  const heiz = state.heizung;
  const adresse = `${o.strasse} ${o.hausnummer}`.trim();
  const ort = `${o.plz} ${o.ort}`.trim();

  return (
    <>
      <div className="print:hidden">
        <ActiveUnitBar units={state.units} activeUnit={activeUnit} setActiveUnitId={h.setActiveUnitId} />
      </div>
      {unit.eigennutzung && (
        <div className="rounded-md border px-4 py-3 text-sm mb-4 print:hidden" style={{ borderColor: 'var(--amber)', background: 'var(--amber-tint)' }}>
          Eigennutzung — hierfür brauchst du normalerweise keine Abrechnung. Wähle oben eine
          vermietete Wohnung.
        </div>
      )}
      <div className={`${card} print:hidden`} style={cardStyle}>
        <h2 className={heading} style={headingStyle}>Ergebnis für {unit.name}</h2>
        <div className="rounded-lg border px-5 py-4 mb-4 text-base"
          style={nachzahlung ? { borderColor: 'var(--amber)', background: 'var(--amber-tint)', borderLeftWidth: '3px' } : { borderColor: 'var(--green)', background: 'var(--good-tint)', borderLeftWidth: '3px' }}>
          {unit.mieterName || 'Der Mieter'} {nachzahlung ? <>muss noch <b style={mono}>{eur(Math.abs(r.ergebnis))}</b> nachzahlen.</> : <>bekommt <b style={mono}>{eur(Math.abs(r.ergebnis))}</b> zurück.</>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-2xl font-semibold" style={{ ...mono, color: 'var(--blue)' }}>{eur(r.gesamtMieter)}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Betriebskosten-Anteil dieser Wohnung</div>
          </div>
          <div>
            <div className="text-2xl font-semibold" style={{ ...mono, color: 'var(--blue)' }}>{eur(r.vorauszahlung)}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>bereits gezahlte Vorauszahlungen</div>
          </div>
        </div>
        {problems.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--green)' }}>Alle Angaben vollständig.</p>
        ) : (
          <div className="rounded-md border px-4 py-3 text-sm" style={{ borderColor: 'var(--amber)', background: 'var(--amber-tint)' }}>
            <p className="font-medium mb-1">Bitte prüfen</p>
            <ul className="list-disc pl-5 space-y-0.5">{problems.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        )}
        <div className="flex flex-wrap gap-3 mt-4">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Als PDF speichern / drucken
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setDetailsOpen(!detailsOpen)}>
            {detailsOpen ? 'Vorschau ausblenden' : 'Vorschau der Abrechnung anzeigen'}
          </button>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          <b style={{ color: 'var(--text)' }}>Wichtig:</b> Berechnungshilfe, keine Rechtsberatung. Ohne Gewähr.
        </p>
      </div>

      <article className={`print-doc ${detailsOpen ? '' : 'hidden print:block'}`}>
        <header className="doc-head">
          <div>
            <div className="doc-sender">{o.vermieter || 'Vermieter·in'}</div>
            <div className="doc-muted">{o.vermieterAnschrift || <>{adresse}{adresse && ort ? ', ' : ''}{ort}</>}</div>
          </div>
          <div className="doc-muted r">Datum: {new Date().toLocaleDateString('de-DE', D2)}</div>
        </header>

        <div className="doc-recipient">
          <div>{unit.mieterName || 'Mieter·in'}</div>
          <div>{adresse}</div>
          <div>{unit.name}</div>
          <div>{ort}</div>
        </div>

        <h1>Betriebskostenabrechnung</h1>
        <p className="doc-muted" style={{ marginBottom: '5mm' }}>Abrechnungszeitraum {dateDE(o.zeitraumVon)} – {dateDE(o.zeitraumBis)}</p>

        <table className="doc-meta">
          <tbody>
            <tr><th>Mietobjekt</th><td>{adresse}, {ort}</td><th>Wohnung</th><td>{unit.name}</td></tr>
            <tr><th>Wohnfläche</th><td>{fmt(num(unit.flaeche))} m² (Haus {fmt(fl)} m²)</td><th>Personen</th><td>{fmt(num(unit.personen), 0)} (Haus {fmt(pe, 0)})</td></tr>
          </tbody>
        </table>

        <div className="doc-result">
          <div><span>Ihr Anteil an den Betriebskosten</span><b>{eur(r.gesamtMieter)}</b></div>
          <div><span>Geleistete Vorauszahlungen</span><b>{eur(r.vorauszahlung)}</b></div>
          <div className="main"><span>{nachzahlung ? 'Nachzahlung' : 'Guthaben'}</span><b>{eur(Math.abs(r.ergebnis))}</b></div>
        </div>

        <section>
          <h2>1. Kostenaufstellung und Verteilung</h2>
          <div className="doc-scroll">
            <table>
              <thead>
                <tr>
                  <th>Kostenart</th>
                  <th className="r">Gesamtkosten Haus</th>
                  <th>Umlageschlüssel</th>
                  <th>Ihr Anteil am Schlüssel</th>
                  <th className="r">Ihr Betrag</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i}>
                    <td>{l.name}</td>
                    <td className="r">{eur(l.gesamt)}</td>
                    <td>{l.key}</td>
                    <td>{l.basis}</td>
                    <td className="r">{money(l.anteil)}</td>
                  </tr>
                ))}
                <tr className="tot"><td colSpan={4}>Summe Betriebskosten</td><td className="r">{eur(r.gesamtMieter)}</td></tr>
                <tr><td colSpan={4}>abzüglich geleisteter Vorauszahlungen</td><td className="r">− {eur(r.vorauszahlung)}</td></tr>
                <tr className="tot"><td colSpan={4}>{nachzahlung ? 'Nachzahlung' : 'Guthaben'}</td><td className="r">{eur(Math.abs(r.ergebnis))}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {mrows.length > 0 && (
          <section>
            <h2>2. Zählerstände und Verbrauch</h2>
            <div className="doc-scroll">
              <table>
                <thead>
                  <tr><th>Zähler</th><th>Zählernummer</th><th className="r">Stand Beginn</th><th className="r">Stand Ende</th><th className="r">Verbrauch</th></tr>
                </thead>
                <tbody>
                  {mrows.map((m) => (
                    <tr key={m.name}>
                      <td>{m.name}</td>
                      <td>{m.nr || '–'}</td>
                      <td className="r">{fmt(m.von, 3)}</td>
                      <td className="r">{fmt(m.bis, 3)}</td>
                      <td className="r">{fmt(m.bis - m.von, 3)} {m.einheit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {split.base > 0 && (
          <section>
            <h2>{mrows.length > 0 ? '3' : '2'}. Heizkosten des Hauses</h2>
            <div className="doc-scroll">
              <table>
                <tbody>
                  {split.oel > 0 && (
                    <tr>
                      <td>Brennstoff{heiz.energietraeger === 'oel' && num(heiz.oelMenge) > 0 ? ` (${fmt(num(heiz.oelMenge), 0)} Liter)` : ''}</td>
                      <td className="r">{eur(split.oel)}</td>
                    </tr>
                  )}
                  {split.wartung > 0 && <tr><td>Wartung und Messung der Heizungsanlage</td><td className="r">{eur(split.wartung)}</td></tr>}
                  <tr className="tot"><td>Heizkosten gesamt</td><td className="r">{eur(split.base)}</td></tr>
                  {split.pct > 0 && (
                    <>
                      <tr><td>davon Warmwasser-Erwärmung (pauschal {fmt(split.pct, 0)} %, § 9 HeizkostenV)</td><td className="r">{eur(split.abzug)}</td></tr>
                      <tr><td>davon Raumheizung</td><td className="r">{eur(split.heiz)}</td></tr>
                    </>
                  )}
                  {num(heiz.co2kosten) > 0 && (
                    <tr><td>CO2-Kosten gesamt (Vermieteranteil {r.heiz.co2Prozent} % nach CO2KostAufG)</td><td className="r">{eur(num(heiz.co2kosten))}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="doc-notes">
          <h2>Hinweise</h2>
          <ul>
            <li>Die Abrechnung erfolgt nach den Vereinbarungen des Mietvertrags, der Betriebskostenverordnung (BetrKV) und der Heizkostenverordnung (HeizkostenV).</li>
            <li>{nachzahlung
              ? <>Die Nachzahlung ist {o.zahlbarBis ? <>bis zum <b>{dateDE(o.zahlbarBis)}</b></> : 'nach Zugang dieser Abrechnung'} zur Zahlung fällig{o.iban ? <>. Bitte überweisen Sie den Betrag auf folgendes Konto: <b>{o.iban}</b> ({o.vermieter || 'Vermieter·in'}), Verwendungszweck „Nebenkosten {unit.name}“</> : ''}.</>
              : <>Das Guthaben wird Ihnen {o.zahlbarBis ? <>bis zum <b>{dateDE(o.zahlbarBis)}</b></> : 'nach Zugang dieser Abrechnung'} erstattet bzw. mit der nächsten Miete verrechnet.</>}</li>
            <li>Berücksichtigt wurden alle Betriebskosten, die im Abrechnungszeitraum {dateDE(o.zeitraumVon)} – {dateDE(o.zeitraumBis)} angefallen bzw. bezahlt wurden.</li>
            <li>Einwendungen gegen die Abrechnung können Sie innerhalb von 12 Monaten nach Zugang erheben (§ 556 Abs. 3 BGB). Die Rechnungsbelege können nach Absprache eingesehen werden.</li>
            {split.pct > 0 && <li>Für die Warmwasser-Erwärmung wurde mangels Wärmemengenzähler der pauschale Anteil nach § 9 HeizkostenV angesetzt; die Verteilung innerhalb des Warmwasseranteils erfolgt nach dem gemessenen Warmwasserverbrauch.</li>}
          </ul>
        </section>

        <div className="doc-sign">
          <div>Ort, Datum</div>
          <div>{o.vermieter || 'Vermieter·in'}</div>
        </div>
      </article>
    </>
  );
}

export default function RechnerPage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null | undefined>(undefined);
  const [state, setState] = useState<AppState>(defaultState());
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [wohnungen, setWohnungen] = useState<Wohnung[]>([]);
  const unitCounter = useRef(2);
  const loadedRef = useRef(false);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) { router.replace('/login'); return; }
    setUser(current);
  }, [router]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(OLD_STORAGE_KEY);
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
    try { setWohnungen(JSON.parse(localStorage.getItem(WOHNUNGEN_KEY) || '[]')); } catch { /* ignore */ }
    loadedRef.current = true;
  }, []);

  // Fresh calculator (no address, no areas) + saved Wohnungen → fill automatically once.
  const autoRef = useRef(false);
  useEffect(() => {
    if (autoRef.current || !wohnungen.length) return;
    autoRef.current = true;
    if (!state.objekt.strasse && state.units.every((u) => !u.flaeche)) importWohnungen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wohnungen]);

  useEffect(() => {
    if (!loadedRef.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  function getUnit(id: string) { return state.units.find((u) => u.id === id) || state.units[0]; }
  const activeUnit = getUnit(state.activeUnitId);

  // Address comes from the first Wohnung; each Wohnung becomes a unit (same id, so meters/tenant survive a re-import).
  function importWohnungen() {
    if (!wohnungen.length) return;
    const w0 = wohnungen[0];
    setState((s) => {
      const units: Unit[] = wohnungen.map((w) => ({
        eigennutzung: false, mieterName: '', vorauszahlung: '', personen: '',
        ...s.units.find((u) => u.id === w.id),
        id: w.id, name: w.name + (w.etage ? ` (${w.etage})` : ''), flaeche: w.flaeche,
      }));
      return {
        ...s, units,
        activeUnitId: units.some((u) => u.id === s.activeUnitId) ? s.activeUnitId : units[0].id,
        objekt: { ...s.objekt, strasse: w0.strasse || '', hausnummer: w0.hausnummer || '', plz: w0.plz || '', ort: w0.ort || '' },
      };
    });
    unitCounter.current = Math.max(unitCounter.current, wohnungen.length);
  }

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
    importWohnungen,
    hasWohnungen: wohnungen.length > 0,
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
      <header className="sticky top-0 z-20 border-b glass print:hidden" style={{ borderColor: 'var(--border)' }}>
        <AppNav user={user} />
        <div className="mx-auto max-w-6xl px-4 sm:px-5 pb-3">
          <div className="flex gap-1 mb-1.5">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1 h-1.5 rounded-full" style={{ background: i <= state.step ? 'var(--blue-light)' : 'var(--border)', transition: 'background-color 300ms ease' }} />
            ))}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Schritt <span style={mono}>{state.step + 1}</span> von <span style={mono}>{STEPS.length}</span> · {STEPS[state.step].label}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-5 py-6 pb-28 print:max-w-none print:p-0">
        {stepId === 'objekt' && <StepObjekt state={state} confirmingReset={confirmingReset} setConfirmingReset={setConfirmingReset} h={handlers} />}
        {stepId === 'kosten' && <StepKosten state={state} activeUnit={activeUnit} missingBasics={missingBasics} h={handlers} />}
        {stepId === 'heizung' && <StepHeizung state={state} activeUnit={activeUnit} missingBasics={missingBasics} h={handlers} />}
        {stepId === 'vorauszahlung' && <StepVorauszahlung state={state} activeUnit={activeUnit} h={handlers} />}
        {stepId === 'ergebnis' && <StepErgebnis state={state} activeUnit={activeUnit} detailsOpen={detailsOpen} setDetailsOpen={setDetailsOpen} h={handlers} />}
      </div>

      <div className="sticky bottom-0 z-20 border-t print:hidden" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-5 py-3 flex justify-between gap-3">
          {state.step > 0 ? (
            <button type="button" className="btn btn-ghost" onClick={() => goto(state.step - 1)}>← Zurück</button>
          ) : <span />}
          {state.step < STEPS.length - 1 ? (
            <button type="button" className="btn btn-primary" onClick={() => goto(state.step + 1)}>Weiter →</button>
          ) : <span />}
        </div>
      </div>
    </div>
  );
}
