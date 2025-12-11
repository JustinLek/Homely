# 📅 Homepage: Jaar Indeling met Maandtabellen

## Wijziging

De homepage is aangepast van een grid met maandkaarten naar een jaar-gebaseerde indeling met tabellen per jaar.

## Nieuwe Structuur

### Voor (Grid Layout)

```
┌─────────┬─────────┬─────────┐
│ Mei '25 │ Jun '25 │ Jul '25 │
├─────────┼─────────┼─────────┤
│ Aug '25 │ Sep '25 │ Okt '25 │
└─────────┴─────────┴─────────┘
```

### Na (Jaar Tabellen)

```
┌────────────────────────────────────────┐
│ 📅 2025                  Saldo: € X    │
├──────────┬──────┬──────┬──────┬────────┤
│ Maand    │ In   │ Uit  │ Saldo│ Acties │
├──────────┼──────┼──────┼──────┼────────┤
│ Januari  │ € X  │ € X  │ € X  │ Bekijk │
│ Februari │ € X  │ € X  │ € X  │ Bekijk │
│ ...      │ ...  │ ...  │ ...  │ ...    │
├──────────┼──────┼──────┼──────┼────────┤
│ Totaal   │ € X  │ € X  │ € X  │        │
└──────────┴──────┴──────┴──────┴────────┘

┌────────────────────────────────────────┐
│ 📅 2024                  Saldo: € X    │
├──────────┬──────┬──────┬──────┬────────┤
│ ...                                    │
└────────────────────────────────────────┘
```

## Features

### 1. Jaar Secties

- Elk jaar heeft een eigen sectie
- Jaren worden gesorteerd (meest recent eerst)
- Jaar header toont totaal jaarsaldo

### 2. Maandtabel per Jaar

- Overzichtelijke tabel met alle maanden
- Kolommen: Maand, Inkomsten, Uitgaven, Saldo, Acties
- Hover effect op rijen
- "Bekijk" knop per maand

### 3. Jaar Totalen

- Footer rij met totalen per jaar
- Inkomsten, uitgaven en saldo opgeteld
- Visueel onderscheiden met dikke border

### 4. Kleurcodering

- **Groen**: Inkomsten
- **Rood**: Uitgaven
- **Blauw/Rood**: Saldo (positief/negatief)
- **Indigo/Paars**: Jaar header gradient

## Voordelen

### ✅ Beter Overzicht

- Alle maanden van een jaar in één oogopslag
- Makkelijk vergelijken tussen maanden
- Jaar totalen direct zichtbaar

### ✅ Compacter

- Meer informatie op minder ruimte
- Geen scrollen door lange grid
- Tabel format is efficiënter

### ✅ Professioneler

- Tabel layout is standaard voor financiële data
- Duidelijke structuur
- Makkelijk te scannen

### ✅ Schaalbaar

- Werkt goed met meerdere jaren
- Automatische groepering per jaar
- Geen handmatige aanpassingen nodig

## Technische Details

### Nieuwe Functies

**`groupByYear()`**

```typescript
const groupByYear = (monthlyData: Record<string, Record<string, Transaction[]>>) => {
  const yearGroups: Record<string, string[]> = {};

  Object.keys(monthlyData).forEach((monthKey) => {
    const year = monthKey.substring(0, 4);
    if (!yearGroups[year]) {
      yearGroups[year] = [];
    }
    yearGroups[year].push(monthKey);
  });

  return yearGroups;
};
```

**`calculateMonthTotals()`**

```typescript
const calculateMonthTotals = (categories: Record<string, Transaction[]>) => {
  let monthIncome = 0;
  let monthExpense = 0;

  Object.entries(categories).forEach(([category, trans]) => {
    if (category === 'interne_transacties' || category === 'te_beoordelen') return;

    if (category === 'inkomsten') {
      trans.forEach((t) => {
        monthIncome += t.amount;
      });
    } else {
      trans.forEach((t) => {
        monthExpense += t.amount;
      });
    }
  });

  return { monthIncome, monthExpense, monthBalance: monthIncome + monthExpense };
};
```

### Render Logica

1. Groepeer transacties per maand
2. Groepeer maanden per jaar
3. Sorteer jaren (meest recent eerst)
4. Voor elk jaar:
   - Bereken jaar totalen
   - Render jaar header met saldo
   - Render tabel met alle maanden
   - Render footer met totalen

## Responsive Design

De tabel is responsive met:

- `overflow-x-auto` voor horizontaal scrollen op kleine schermen
- Whitespace nowrap voor kolommen
- Hover effecten voor betere UX

## Gebruik

1. Open de homepage
2. Zie jaren gesorteerd (meest recent eerst)
3. Bekijk maandtabel per jaar
4. Klik "Bekijk" om naar maanddetails te gaan

## Toekomstige Uitbreidingen

Mogelijke verbeteringen:

- Jaar inklappen/uitklappen
- Grafieken per jaar
- Export per jaar
- Filter op jaar
- Vergelijking tussen jaren

## Conclusie

De nieuwe jaar-gebaseerde indeling met tabellen biedt:

- ✅ Beter overzicht
- ✅ Compactere weergave
- ✅ Professionelere uitstraling
- ✅ Betere schaalbaarheid

Perfect voor het beheren van meerdere jaren aan transacties! 🎉
