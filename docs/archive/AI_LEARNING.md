# AI Leert van Je Correcties! 🧠

## Hoe Het Werkt

De AI gebruikt nu **few-shot learning** om te leren van transacties die je al hebt gecategoriseerd!

### Wat is Few-Shot Learning?

Wanneer je een AI suggestie vraagt voor een transactie, gebeurt het volgende:

1. **Zoek vergelijkbare transacties**: De AI zoekt in de database naar transacties die al gecategoriseerd zijn en vergelijkbaar zijn met de huidige transactie

2. **Gebruik als voorbeelden**: Deze gevonden transacties worden als voorbeelden meegegeven aan de AI

3. **Betere suggesties**: De AI gebruikt deze voorbeelden om een betere categorisatie te suggereren

## Voorbeeld

Stel je hebt deze transactie al gecategoriseerd:

```
Tegenpartij: "Albert Heijn 1234"
Categorie: Huishoudelijke uitgaven
Subcategorie: Boodschappen
```

Wanneer je nu een suggestie vraagt voor:

```
Tegenpartij: "Albert Heijn 5678"
```

Dan ziet de AI het eerdere voorbeeld en suggereert automatisch:

```
Categorie: Huishoudelijke uitgaven
Subcategorie: Boodschappen
Confidence: 98%
Reasoning: "Vergelijkbaar met eerdere Albert Heijn transacties die als boodschappen zijn gecategoriseerd"
```

## Hoe Worden Vergelijkbare Transacties Gevonden?

De AI gebruikt een **slimme database query** om vergelijkbare transacties te vinden:

### ⚠️ BELANGRIJK: Huidige Maand Wordt Uitgesloten!

Wanneer je een transactie analyseert, worden voorbeelden uit **dezelfde maand uitgesloten**. Waarom?

**Probleem zonder exclusie:**

```
Maand Juni: 10× "Waterland Purmerend" → Water (verkeerd)
Re-analyse Juni: AI vindt 10× Water voorbeelden → Suggereert Water ❌
```

**Met exclusie:**

```
Maand Juni: 10× "Waterland Purmerend" → Water (verkeerd)
Re-analyse Juni: AI zoekt in andere maanden → Vindt Mei: Uitgaan → Suggereert Uitgaan ✅
```

Dit voorkomt dat de AI leert van verkeerde categorisaties in dezelfde maand!

### Database Query Strategie

1. **Woord extractie**: Haalt belangrijke woorden (3+ karakters) uit de tegenpartij naam
2. **LIKE queries**: Zoekt transacties die deze woorden bevatten
3. **Prioritering**:
   - Eerst: Exacte match van tegenpartij naam
   - Daarna: Gedeeltelijke match (bevat de naam)
   - Laatst: Woord match
4. **Filtering**: Alleen transacties die al gecategoriseerd zijn (niet "te_beoordelen")
5. **Sortering**: Meest recente updates eerst
6. **Limiet**: Maximaal 5 voorbeelden

### SQL Query Voorbeeld

```sql
SELECT id, date, counterparty, amount, category, subcategory
FROM transactions
WHERE
  category != 'te_beoordelen'
  AND (
    LOWER(counterparty) LIKE '%albert%' OR
    LOWER(counterparty) LIKE '%heijn%'
  )
ORDER BY
  CASE
    WHEN LOWER(counterparty) = 'albert heijn 1234' THEN 1
    WHEN LOWER(counterparty) LIKE '%albert heijn%' THEN 2
    ELSE 3
  END,
  updated_at DESC
LIMIT 5
```

### Voorbeelden van Matches

- "Albert Heijn 1234" → vindt "Albert Heijn 5678", "Albert Heijn 9999"
- "Spotify BV" → vindt "Spotify Premium", "Spotify Nederland"
- "Restaurant De Gouden Leeuw" → vindt "De Gouden Leeuw", "Gouden Leeuw Amsterdam"

## Efficiëntie & Kosten

✅ **Geen onnodige data**: Alleen relevante transacties worden naar OpenAI gestuurd
✅ **Database query**: Snelle lookup in SQLite (< 1ms)
✅ **Maximaal 5 voorbeelden**: Beperkt de prompt size en kosten
✅ **Goedkoop**: ~€0.0001 per suggestie (met voorbeelden)

## Voordelen

✅ **Consistentie**: Vergelijkbare transacties krijgen dezelfde categorisatie
✅ **Leert van je correcties**: Als je een AI suggestie corrigeert, wordt die correctie gebruikt voor toekomstige suggesties
✅ **Sneller categoriseren**: Hoe meer je categoriseert, hoe beter de AI wordt
✅ **Minder handmatig werk**: Na een tijdje herkent de AI patronen automatisch

## Tips voor Beste Resultaten

1. **Begin met unieke transacties**: Categoriseer eerst transacties van bekende winkels/bedrijven
2. **Wees consistent**: Gebruik altijd dezelfde categorisatie voor hetzelfde type transactie
3. **Corrigeer fouten**: Als de AI een fout maakt, corrigeer het - de AI leert hiervan!
4. **Gebruik bulk analyse**: Na het categoriseren van enkele voorbeelden, gebruik bulk analyse voor de rest

## Voorbeeld Workflow

### Stap 1: Handmatig Categoriseren (10-20 transacties)

```
✅ Albert Heijn → Huishoudelijke uitgaven / Boodschappen
✅ Jumbo → Huishoudelijke uitgaven / Boodschappen
✅ Spotify → Abonnementen & telecom / Streamingsdiensten
✅ CZ Zorgverzekering → Verzekeringen / Zorgverzekering
✅ Shell → Vervoer / Brandstof
```

### Stap 2: AI Suggesties Gebruiken

Nu krijg je betere suggesties:

```
🤖 Albert Heijn 9999 → Huishoudelijke uitgaven / Boodschappen (98% zeker)
🤖 Spotify Premium → Abonnementen & telecom / Streamingsdiensten (95% zeker)
🤖 Shell Station → Vervoer / Brandstof (92% zeker)
```

### Stap 3: Bulk Analyse

Gebruik bulk analyse voor alle resterende transacties - de AI gebruikt alle eerder gecategoriseerde transacties als voorbeelden!

## Technische Details

De AI prompt bevat nu:

```
Voorbeelden van vergelijkbare transacties die al gecategoriseerd zijn:

1. Tegenpartij: "Albert Heijn 1234"
   Bedrag: €-45.67
   Categorie: Huishoudelijke uitgaven
   Subcategorie: Boodschappen

2. Tegenpartij: "Albert Heijn 5678"
   Bedrag: €-52.34
   Categorie: Huishoudelijke uitgaven
   Subcategorie: Boodschappen

Gebruik deze voorbeelden als leidraad voor je categorisatie.
```

## Privacy

- Alleen transacties uit je eigen database worden gebruikt
- Geen data wordt gedeeld met andere gebruikers
- OpenAI bewaart de data niet (volgens hun API beleid)

## Resultaat

Met deze functie wordt de AI steeds slimmer naarmate je meer transacties categoriseert! 🎉
