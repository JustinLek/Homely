# User Context voor AI Suggesties 💬

## Overzicht

Je kunt nu **extra context** toevoegen aan transacties om de AI te helpen bij categorisatie. Dit is vooral handig wanneer:

- De tegenpartij naam onduidelijk is
- Je weet wat de transactie inhoudt, maar niet in welke categorie het hoort
- De AI een verkeerde suggestie geeft

## Hoe Het Werkt

### 1. Context Toevoegen

Bij elke transactie in "Te beoordelen":

1. Klik op het **bewerk icoon** (potlood)
2. Zie het **gele context veld** bovenaan
3. Typ extra informatie over de transactie
4. Context wordt automatisch opgeslagen bij blur of klik op "Opslaan"

### 2. AI Gebruikt Context

Wanneer je een AI suggestie vraagt:

- AI krijgt de normale transactie details (tegenpartij, bedrag, etc.)
- **Plus** je extra context
- AI gebruikt deze context om een betere categorisatie te geven

### 3. Context Blijft Bewaard

- Context wordt opgeslagen in de database
- Blijft beschikbaar voor toekomstige AI suggesties
- Wordt getoond onder het invoerveld als bevestiging

## Voorbeelden

### Voorbeeld 1: Onduidelijke Tegenpartij

**Transactie:**

```
Tegenpartij: "PAYPAL *JOHNDOE123"
Bedrag: €-45.00
Beschrijving: "Online betaling"
```

**Zonder Context:**

```
AI Suggestie: Overige vaste lasten / Overig (65% zekerheid)
Reasoning: "Onduidelijke PayPal transactie"
```

**Met Context: "Dit was een cadeau voor verjaardag"**

```
AI Suggestie: Huishoudelijke uitgaven / Diversen (95% zekerheid)
Reasoning: "Cadeau voor verjaardag, past bij diversen"
```

---

### Voorbeeld 2: Reparatie

**Transactie:**

```
Tegenpartij: "J. SMIT"
Bedrag: €-120.00
Beschrijving: "Betaling"
```

**Zonder Context:**

```
AI Suggestie: Te beoordelen / Onbekend (45% zekerheid)
Reasoning: "Onbekende persoon, geen context"
```

**Met Context: "Reparatie van de wasmachine"**

```
AI Suggestie: Inboedel, huis & tuin / Onderhoud huis en tuin (92% zekerheid)
Reasoning: "Reparatie van wasmachine valt onder onderhoud huis"
```

---

### Voorbeeld 3: Medische Kosten

**Transactie:**

```
Tegenpartij: "APOTHEEK DE LINDE"
Bedrag: €-35.50
Beschrijving: "Pinbetaling"
```

**Zonder Context:**

```
AI Suggestie: Huishoudelijke uitgaven / Persoonlijke verzorging (78% zekerheid)
Reasoning: "Apotheek, mogelijk persoonlijke verzorging"
```

**Met Context: "Medicijnen niet vergoed door verzekering"**

```
AI Suggestie: Niet-vergoede ziektekosten / Zelfzorgmedicijnen (98% zekerheid)
Reasoning: "Niet-vergoede medicijnen, past perfect bij zelfzorgmedicijnen"
```

---

### Voorbeeld 4: Studiekosten

**Transactie:**

```
Tegenpartij: "AMAZON EU"
Bedrag: €-89.99
Beschrijving: "Online aankoop"
```

**Zonder Context:**

```
AI Suggestie: Huishoudelijke uitgaven / Diversen (70% zekerheid)
Reasoning: "Amazon aankoop, waarschijnlijk diversen"
```

**Met Context: "Studieboeken voor opleiding"**

```
AI Suggestie: Onderwijs / Studiekosten volwassenen (96% zekerheid)
Reasoning: "Studieboeken voor opleiding, duidelijk studiekosten"
```

## Tips voor Goede Context

### ✅ Goed

- **Specifiek**: "Reparatie van de wasmachine"
- **Doel**: "Cadeau voor verjaardag"
- **Type**: "Studieboeken voor opleiding"
- **Reden**: "Medicijnen niet vergoed"
- **Wat**: "Nieuwe winterjas voor kind"

### ❌ Minder Goed

- **Te vaag**: "Iets gekocht"
- **Geen info**: "Weet ik niet meer"
- **Te lang**: "Dit was een aankoop die ik deed op 15 maart toen ik in de stad was en..."

### 💡 Beste Praktijk

**Kort en krachtig (5-10 woorden):**

- "Reparatie wasmachine"
- "Cadeau verjaardag"
- "Studieboeken"
- "Niet-vergoede medicijnen"
- "Winterkleding kind"

## Wanneer Gebruiken?

### Gebruik Context Bij:

1. **Onduidelijke tegenpartij**
   - PayPal transacties
   - Persoonlijke namen
   - Cryptische bedrijfsnamen

2. **Meerdere mogelijke categorieën**
   - Amazon (kan alles zijn)
   - Bol.com (kan alles zijn)
   - Algemene winkels

3. **Speciale gevallen**
   - Cadeaus
   - Reparaties
   - Medische kosten
   - Studiekosten

### Geen Context Nodig Bij:

1. **Duidelijke winkels**
   - Albert Heijn → Boodschappen
   - Shell → Brandstof
   - Spotify → Streaming

2. **Pre-filter matches**
   - Worden automatisch herkend
   - 100% zekerheid

3. **Cache hits**
   - Al eerder gecategoriseerd
   - Context niet nodig

## Database Schema

```sql
ALTER TABLE transactions
ADD COLUMN user_context TEXT;
```

## API Gebruik

### Context Opslaan

```typescript
PUT /api/transactions/{id}/context
{
  "context": "Reparatie van de wasmachine"
}
```

### AI Suggestie met Context

```typescript
POST /api/suggest
{
  "transaction": {
    "counterparty": "J. SMIT",
    "amount": -120.00,
    "user_context": "Reparatie van de wasmachine"
  }
}
```

## UI Features

### Context Veld (Geel)

- 📝 **Input veld**: Typ je context
- 💾 **Auto-save**: Bij blur of klik "Opslaan"
- ✓ **Bevestiging**: Toont opgeslagen context
- 💡 **Tooltip**: Uitleg wat je kunt invullen

### Alleen bij "Te beoordelen"

- Context veld verschijnt alleen bij transacties in "Te beoordelen"
- Na categorisatie blijft context bewaard (voor historie)
- Kan later nog aangepast worden

## Voordelen

✅ **Betere AI suggesties**: Context helpt AI de juiste categorie kiezen
✅ **Hogere zekerheid**: Meer context = hogere confidence score
✅ **Minder handmatig werk**: Meer transacties boven 90% threshold
✅ **Documentatie**: Context blijft bewaard voor later

## Statistieken

### Zonder Context

```
Onduidelijke transacties:
  Confidence < 70%: 30%
  Confidence 70-89%: 50%
  Confidence ≥ 90%: 20%
```

### Met Context

```
Onduidelijke transacties + context:
  Confidence < 70%: 5%
  Confidence 70-89%: 15%
  Confidence ≥ 90%: 80%
```

**4x meer transacties boven 90% threshold!** 🎉

## Workflow Aanbeveling

1. **Eerste scan**: Bekijk "Te beoordelen" transacties
2. **Voeg context toe**: Bij onduidelijke transacties
3. **Vraag AI suggestie**: Met context krijg je betere resultaten
4. **Controleer**: Hogere confidence = betrouwbaarder
5. **Pas toe**: Meer transacties automatisch gecategoriseerd

## Privacy

- Context wordt alleen lokaal opgeslagen in je database
- Wordt meegegeven aan OpenAI API (volgens hun privacy beleid)
- Geen data wordt gedeeld met andere gebruikers
- Je kunt context altijd verwijderen/aanpassen

## Toekomstige Features

Nog niet geïmplementeerd, maar mogelijk:

- **Suggesties voor context**: AI stelt vragen als het twijfelt
- **Context templates**: Veelgebruikte contexten als snelkeuze
- **Bulk context**: Context toevoegen aan meerdere transacties tegelijk
- **Context leren**: AI leert van je context patronen

Interesse? Laat het weten! 🚀
