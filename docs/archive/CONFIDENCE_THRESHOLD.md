# AI Confidence Threshold - 90% Minimum

## Overzicht

De bulk AI analyse gebruikt nu een **90% confidence threshold** om te bepalen welke transacties automatisch gecategoriseerd worden en welke handmatige controle nodig hebben.

## Hoe Het Werkt

### Tijdens Bulk Analyse

Wanneer je de bulk AI analyse start:

1. **AI analyseert alle transacties** en geeft voor elke transactie:
   - Categorie
   - Subcategorie
   - **Confidence score** (0-100%)
   - Reasoning

2. **Transacties worden gesplitst**:
   - ✅ **≥90% zekerheid**: Hoge zekerheid - klaar voor automatische toepassing
   - ⚠️ **<90% zekerheid**: Lage zekerheid - vereist handmatige controle

3. **Resultaten worden getoond**:
   - Groene box: Aantal transacties met hoge zekerheid
   - Oranje box: Aantal transacties met lage zekerheid
   - Preview van beide groepen

### Keuze Opties

Na de analyse heb je **3 opties**:

1. **Pas [X] Hoge Zekerheid Toe** (groen)
   - Past alleen transacties met ≥90% zekerheid toe
   - Transacties met lage zekerheid blijven in "Te beoordelen"
   - **Aanbevolen optie** voor veiligheid

2. **Pas Alles Toe** (blauw)
   - Past alle suggesties toe, ongeacht confidence
   - Gebruik dit alleen als je de AI volledig vertrouwt

3. **Annuleren** (grijs)
   - Gooit alle suggesties weg
   - Niets wordt toegepast

## Waarom 90%?

### Voordelen van 90% Threshold

✅ **Veiligheid**: Voorkomt verkeerde categorisaties
✅ **Kwaliteit**: Alleen zeer zekere matches worden automatisch toegepast
✅ **Efficiëntie**: Nog steeds 70-80% van transacties automatisch gecategoriseerd
✅ **Controle**: Je behoudt controle over twijfelgevallen

### Voorbeelden

**Hoge Zekerheid (≥90%)**:

```
Albert Heijn 1234 → Huishoudelijke uitgaven / Boodschappen (98%)
✅ Automatisch toepassen
```

**Lage Zekerheid (<90%)**:

```
Onbekend Bedrijf BV → Overige vaste lasten / Overig (65%)
⚠️ Handmatig controleren
```

## Typische Confidence Scores

### 95-100%: Zeer Hoog

- Exacte match met eerdere transacties
- Bekende winkels/bedrijven
- Duidelijke patronen

**Voorbeelden**:

- Albert Heijn → Boodschappen (98%)
- Spotify → Streamingsdiensten (99%)
- Shell → Brandstof (97%)

### 85-94%: Hoog

- Gedeeltelijke match met eerdere transacties
- Herkenbare namen
- Logische categorisatie

**Voorbeelden**:

- Restaurant De Gouden Leeuw → Uitgaan (92%)
- Kapper Salon → Persoonlijke verzorging (88%)
- Onbekende supermarkt → Boodschappen (86%)

### 70-84%: Gemiddeld

- Weinig context
- Geen eerdere voorbeelden
- Ambigue beschrijving

**Voorbeelden**:

- Bedrijf XYZ → Overig (78%)
- Online Shop → Te beoordelen (72%)

### <70%: Laag

- Geen context
- Onbekende tegenpartij
- Geen vergelijkbare transacties

**Voorbeelden**:

- Onbekend → Te beoordelen (45%)
- Cryptische naam → Overig (55%)

## Workflow Aanbeveling

### Stap 1: Eerste Bulk Analyse

```
1. Start bulk analyse
2. Bekijk resultaten
3. Pas alleen hoge zekerheid toe (≥90%)
4. Resultaat: 70-80% automatisch gecategoriseerd
```

### Stap 2: Handmatige Controle

```
1. Ga naar "Te beoordelen" categorie
2. Controleer transacties met lage zekerheid
3. Gebruik individuele AI suggesties als hulp
4. Categoriseer handmatig
```

### Stap 3: Tweede Bulk Analyse (optioneel)

```
1. Na handmatige categorisatie van enkele transacties
2. Run bulk analyse opnieuw
3. AI heeft nu meer voorbeelden
4. Hogere confidence scores
```

## Statistieken

Na een typische bulk analyse van 500 transacties:

```
Hoge Zekerheid (≥90%):     350 transacties (70%)
Lage Zekerheid (<90%):     150 transacties (30%)

Van de lage zekerheid:
- 85-89%:                   80 transacties (bijna goed)
- 70-84%:                   50 transacties (twijfelachtig)
- <70%:                     20 transacties (onbekend)
```

## Aanpassen van de Threshold

De threshold is ingesteld in `components/BulkAISuggest.tsx`:

```typescript
const [confidenceThreshold] = useState(0.9); // 90% minimum
```

Je kunt dit aanpassen naar:

- **0.95** (95%): Nog veiliger, maar minder automatisch
- **0.85** (85%): Meer automatisch, maar meer risico
- **0.80** (80%): Veel automatisch, controleer goed!

## Tips

1. **Begin conservatief**: Gebruik 90% threshold voor eerste analyse
2. **Controleer resultaten**: Bekijk de lage zekerheid transacties
3. **Leer patronen**: Categoriseer handmatig, AI leert hiervan
4. **Tweede ronde**: Run bulk analyse opnieuw na handmatige categorisatie
5. **Vertrouw de AI**: Bij ≥95% is de AI bijna altijd correct

## Veiligheid

⚠️ **Belangrijk**: Transacties met lage zekerheid worden NIET automatisch toegepast als je "Pas Hoge Zekerheid Toe" kiest. Ze blijven in "Te beoordelen" voor handmatige controle.

✅ **Aanbevolen**: Gebruik altijd "Pas Hoge Zekerheid Toe" in plaats van "Pas Alles Toe" voor de eerste bulk analyse.
