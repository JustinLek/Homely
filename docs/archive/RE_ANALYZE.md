# Re-analyseer Maand 🔄

## Overzicht

De **Re-analyseer Maand** functie analyseert alle transacties in een maand opnieuw met de nieuwste AI kennis, inclusief:

- Nieuwe context die je hebt toegevoegd
- Correcties die je hebt gemaakt
- Verbeterde AI patronen

## Waarom Re-analyseren?

### Scenario 1: Context Toegevoegd

```
Maand 1: "Waterland Purmerend" → Water (verkeerd)
Je voegt context toe: "Horeca gelegenheid in ziekenhuis"
Je categoriseert: Vrijetijdsuitgaven / Uitgaan

Maand 2: "Waterland Purmerend" → Water (nog steeds verkeerd)
Re-analyse → Voorgesteld: Vrijetijdsuitgaven / Uitgaan ✅
```

### Scenario 2: Patronen Geleerd

```
Je hebt 10 transacties van "Albert Heijn" handmatig gecategoriseerd
Re-analyse vindt nog 5 "Albert Heijn" transacties die verkeerd staan
Voorgesteld: Alle 5 naar Boodschappen
```

### Scenario 3: Verbeterde AI

```
Eerste analyse: 70% confidence
Na correcties en context: 95% confidence
Re-analyse → Betere suggesties voor twijfelgevallen
```

## Hoe Het Werkt

### 1. Start Re-analyse

```
Klik op "Start Re-analyse (X transacties)"
↓
AI analyseert ALLE transacties opnieuw
↓
Vergelijkt met huidige categorisatie
↓
Toont alleen WIJZIGINGEN
```

### 2. Review Wijzigingen

```
Voor elke wijziging zie je:
- Tegenpartij en bedrag
- Huidig: [Oude categorie]
- Voorgesteld: [Nieuwe categorie]
- Confidence: 95%
- Reasoning: "Waarom deze wijziging"
- ✓ Checkbox (auto-geselecteerd bij ≥90%)
```

### 3. Selecteer & Pas Toe

```
✓ Selecteer wijzigingen die je wilt toepassen
✗ Deselecteer wijzigingen die je niet wilt
Klik "Pas X Wijzigingen Toe"
```

## UI Features

### Paarse Box

```
┌─────────────────────────────────────────────┐
│ 🔄 Re-analyseer Maand                       │
│ Analyseer alle transacties opnieuw met     │
│ de nieuwste AI kennis en context           │
│                                             │
│ [Start Re-analyse (1454 transacties)]      │
└─────────────────────────────────────────────┘
```

### Progress Bar

```
Analyseren... 45%
[████████████░░░░░░░░░░░░░░]
```

### Resultaten

```
┌─────────────────────────────────────────────┐
│ Voorgestelde Wijzigingen                    │
│ 23 wijzigingen gevonden (18 met hoge        │
│ zekerheid ≥90%)                             │
│                                             │
│ [Alles selecteren] [Alles deselecteren]    │
│                                             │
│ ┌─────────────────────────────────────┐    │
│ │ ✓ Waterland Purmerend    95%        │    │
│ │   €15.50                            │    │
│ │   Huidig: Water                     │    │
│ │   Voorgesteld: Uitgaan              │    │
│ │   💡 Horeca in ziekenhuis           │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ [Pas 18 Wijzigingen Toe] [Annuleren]       │
└─────────────────────────────────────────────┘
```

### Geen Wijzigingen

```
┌─────────────────────────────────────────────┐
│ ✓ Geen wijzigingen nodig!                  │
│                                             │
│ Alle transacties zijn al correct           │
│ gecategoriseerd volgens de huidige AI      │
│ kennis.                                     │
│                                             │
│ [Sluiten]                                   │
└─────────────────────────────────────────────┘
```

## Auto-selectie

**Hoge zekerheid (≥90%):**

- ✅ Automatisch geselecteerd
- Groen label: "95%"
- Veilig om toe te passen

**Lage zekerheid (<90%):**

- ⬜ Niet geselecteerd
- Oranje label: "78%"
- Review handmatig

## Workflow Aanbeveling

### Stap 1: Eerste Maand Categoriseren

```
1. Bulk analyse "Te beoordelen"
2. Handmatig controleren
3. Context toevoegen waar nodig
4. Correcties maken
```

### Stap 2: Volgende Maand

```
1. Import nieuwe transacties
2. Bulk analyse "Te beoordelen"
3. ✨ Re-analyseer hele maand
4. Review voorgestelde wijzigingen
5. Pas toe
```

### Stap 3: Terugkijken

```
1. Ga naar oude maand
2. ✨ Re-analyseer met nieuwe kennis
3. Vind fouten die je eerder maakte
4. Corrigeer in bulk
```

## Voorbeelden

### Voorbeeld 1: Context Leren

**Situatie:**

- Maand 1: "Waterland Purmerend" → Water (verkeerd)
- Je voegt context toe: "Horeca in ziekenhuis"
- Je corrigeert: Vrijetijdsuitgaven / Uitgaan

**Re-analyse Maand 2:**

```
Voorgestelde Wijziging:
✓ Waterland Purmerend PURMEREND
  €12.00
  Huidig: Energie & lokale lasten / Water
  Voorgesteld: Vrijetijdsuitgaven / Uitgaan
  95%
  💡 Volgens eerdere context is dit een horeca
     gelegenheid in het ziekenhuis, niet water
```

### Voorbeeld 2: Bulk Correcties

**Situatie:**

- 50 "Albert Heijn" transacties verkeerd als "Diversen"
- Je corrigeert 5 handmatig naar "Boodschappen"

**Re-analyse:**

```
Voorgestelde Wijzigingen: 45

✓ Albert Heijn 1234 → Boodschappen (98%)
✓ Albert Heijn 5678 → Boodschappen (98%)
✓ Albert Heijn 9999 → Boodschappen (98%)
... (42 meer)

[Pas 45 Wijzigingen Toe]
```

### Voorbeeld 3: Twijfelgevallen

**Situatie:**

- "Amazon" transacties als "Diversen"
- Je voegt context toe: "Studieboeken"

**Re-analyse:**

```
Voorgestelde Wijziging:
✓ AMAZON EU
  €89.99
  Huidig: Huishoudelijke uitgaven / Diversen
  Voorgesteld: Onderwijs / Studiekosten volwassenen
  96%
  💡 Studieboeken voor opleiding, duidelijk
     studiekosten
```

## Performance

### Snelheid

```
500 transacties:
- Pre-filter: 250 (instant)
- Cache: 200 (fast)
- AI: 50 (slow)
Total: ~30 seconden
```

### Kosten

```
500 transacties re-analyse:
- Pre-filter: €0.00
- Cache: €0.00
- AI: ~€0.005
Total: ~€0.005
```

### Wijzigingen

```
Typisch resultaat:
- Geen wijzigingen: 450 (90%)
- Wijzigingen: 50 (10%)
  - Hoge zekerheid: 40 (80%)
  - Lage zekerheid: 10 (20%)
```

## Tips

1. **Re-analyseer regelmatig**: Na elke bulk correctie
2. **Check oude maanden**: Vind fouten uit het verleden
3. **Review lage zekerheid**: Deselecteer twijfelgevallen
4. **Gebruik context**: Voeg eerst context toe, dan re-analyseren
5. **Bulk correcties**: Selecteer alleen hoge zekerheid (≥90%)

## Verschil met Bulk Analyse

### Bulk Analyse

- Alleen "Te beoordelen" transacties
- Nieuwe categorisatie
- Voor eerste keer

### Re-analyse

- **ALLE** transacties
- Voorgestelde **wijzigingen**
- Voor verbeteren/corrigeren

## Technische Details

**Parallel Processing:**

- 10 transacties tegelijk
- Real-time progress
- Snelle analyse

**Smart Filtering:**

- Alleen wijzigingen tonen
- Auto-select ≥90%
- Sorteer op confidence

**Context Aware:**

- Gebruikt user_context van voorbeelden
- Leert van correcties
- Verbetert over tijd

## Toekomstige Features

Nog niet geïmplementeerd:

- **Diff view**: Zie precies wat er verandert
- **Undo**: Maak wijzigingen ongedaan
- **Batch re-analyse**: Meerdere maanden tegelijk
- **Smart suggestions**: AI stelt voor welke maanden te re-analyseren

Interesse? Laat het weten! 🚀
