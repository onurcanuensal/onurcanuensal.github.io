'use client';
import React from "react";
import AppShell from "../components/AppShell";

// ponytail: skeleton texts only, not legal advice — have a lawyer or Haus & Grund review before real use.
const VORLAGEN = [
  {
    id: 'mietvertrag', title: 'Mietvertrag Wohnraum', desc: 'Unbefristeter Mietvertrag für eine Wohnung.',
    body: `MIETVERTRAG ÜBER WOHNRAUM

Zwischen
Vermieter: ______________________
und
Mieter: ______________________

§ 1 Mietsache
Vermietet wird die Wohnung ______________________ (Lage, Fläche, Zimmer) in ______________________.

§ 2 Mietzeit
Das Mietverhältnis beginnt am __.__.____ und läuft auf unbestimmte Zeit.

§ 3 Miete
Die monatliche Kaltmiete beträgt ______ €. Die Vorauszahlung auf die Betriebskosten beträgt ______ € monatlich. Die Miete ist bis zum 3. Werktag eines Monats im Voraus zu zahlen.

§ 4 Betriebskosten
Über die Betriebskosten wird jährlich nach der Betriebskostenverordnung abgerechnet.

§ 5 Kaution
Der Mieter leistet eine Kaution von ______ € (höchstens drei Monatskaltmieten).

§ 6 Kündigung
Es gelten die gesetzlichen Kündigungsfristen.

Ort, Datum: ______________________
Unterschriften: Vermieter ______________  Mieter ______________
`,
  },
  {
    id: 'uebergabe', title: 'Übergabeprotokoll', desc: 'Zustand der Wohnung und Zählerstände bei Ein- und Auszug.',
    body: `ÜBERGABEPROTOKOLL

Wohnung: ______________________   Datum: __.__.____
Übergabe bei:  [ ] Einzug   [ ] Auszug

Zählerstände
Strom: ________   Wasser kalt: ________   Wasser warm: ________   Heizung: ________

Zustand der Räume (Wände, Böden, Fenster, Türen, Küche, Bad):
______________________________________________

Schlüssel übergeben: Haustür ___  Wohnung ___  Keller ___  Briefkasten ___

Mängel / Anmerkungen:
______________________________________________

Unterschriften: Vermieter ______________  Mieter ______________
`,
  },
  {
    id: 'mieterhoehung', title: 'Mieterhöhungsverlangen', desc: 'Zustimmung zur Mieterhöhung bis zur ortsüblichen Vergleichsmiete.',
    body: `MIETERHÖHUNGSVERLANGEN (§ 558 BGB)

An: ______________________
Wohnung: ______________________

Hiermit bitte ich um Zustimmung zur Erhöhung der monatlichen Kaltmiete
von ______ € auf ______ € ab dem __.__.____.

Begründung (z. B. Mietspiegel, Vergleichswohnungen): ______________________

Die Miete war seit mindestens 15 Monaten unverändert. Die Kappungsgrenze von 20 % (in angespannten Märkten 15 %) innerhalb von drei Jahren wird eingehalten.

Bitte stimme bis zum Ende des zweiten Monats nach Zugang dieses Schreibens zu.

Ort, Datum: ______________________   Unterschrift: ______________
`,
  },
  {
    id: 'kuendigung', title: 'Kündigung durch Vermieter', desc: 'Ordentliche Kündigung mit Angabe des berechtigten Interesses.',
    body: `KÜNDIGUNG DES MIETVERHÄLTNISSES

An: ______________________
Wohnung: ______________________

Hiermit kündige ich das Mietverhältnis ordentlich zum __.__.____ (nächstmöglicher Termin).

Berechtigtes Interesse (§ 573 BGB, z. B. Eigenbedarf – konkret begründen):
______________________________________________

Auf Ihr Widerspruchsrecht nach §§ 574 ff. BGB weise ich hin.

Ort, Datum: ______________________   Unterschrift: ______________
`,
  },
];

function download(title: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MustervertraegePage() {
  return (
    <AppShell title="Musterverträge">
      {() => (
        <>
          <p className="text-sm mb-5 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Gerüste zum Ausfüllen. Sie ersetzen keine Rechtsberatung — lass wichtige Verträge vor dem Einsatz prüfen.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {VORLAGEN.map((v) => (
              <article key={v.id} className="rounded-lg border p-4 flex flex-col" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
                <h2 className="font-semibold" style={{ color: 'var(--text)' }}>{v.title}</h2>
                <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
                <div className="mt-auto flex gap-2">
                  <details className="flex-1">
                    <summary className="btn btn-ghost btn-sm cursor-pointer">Ansehen</summary>
                    <pre className="mt-3 text-xs whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{v.body}</pre>
                  </details>
                  <button type="button" className="btn btn-primary btn-sm self-start" onClick={() => download(v.title, v.body)}>Herunterladen</button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
