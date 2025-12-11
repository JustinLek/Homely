# 💡 Slimme Inzichten Feature

## Overzicht

De Slimme Inzichten feature biedt AI-gedreven analyses van je uitgavenpatronen. Deze Quick Wins implementatie bevat:

1. **Maandvergelijkingen** - Vergelijk huidige maand met vorige maanden en gemiddelden
2. **Top Uitgaven per Categorie** - Zie waar je het meeste geld aan uitgeeft
3. **Outlier Detectie** - Identificeer ongebruikelijke grote uitgaven

## Hoe Werkt Het?

### Automatische Analyses

De insights worden automatisch gegenereerd op basis van je transactiedata:

- **Maandvergelijking**: Berekent verschillen met vorige maand en gemiddelde
- **Top categorieën**: Rangschikt uitgaven per categorie
- **Outliers**: Vindt uitgaven die 2x hoger zijn dan het gemiddelde

### UI Component

Op elke maandpagina zie je nu een **"💡 Inzichten"** tab met:

**Samenvatting (3 cards):**

- Vergelijking met gemiddelde (€ verschil en %)
- Grootste uitgavencategorie
- Aantal ongebruikelijke uitgaven

**Gedetailleerde inzichten:**

- Volledige maandvergelijking met vorige maand
- Top 5 uitgavencategorieën met percentages
- Lijst van ongebruikelijke uitgaven met uitleg

## API Endpoint

### GET `/api/insights?month=YYYY-MM`

Haal alle inzichten op voor een specifieke maand.

**Parameters:**

- `month` (required): Maand in formaat `YYYY-MM` (bijv. `2025-05`)
- `type` (optional): Specifiek type insight: `comparison`, `top`, of `outliers`

**Voorbeeld:**

```bash
# Alle inzichten voor mei 2025
GET /api/insights?month=2025-05

# Alleen maandvergelijking
GET /api/insights?month=2025-05&type=comparison
```

**Response:**

```json
{
  "success": true,
  "month": "2025-05",
  "insights": {
    "comparison": {...},
    "topCategories": [...],
    "outliers": [...]
  }
}
```

## Technische Details

### Nieuwe Bestanden

1. **`lib/insights.ts`** - Analyse functies
   - `compareMonths()` - Vergelijkt maanden
   - `getTopCategories()` - Top uitgaven per categorie
   - `detectOutliers()` - Vindt ongebruikelijke uitgaven

2. **`app/api/insights/route.ts`** - API endpoint
   - GET endpoint voor het ophalen van inzichten
   - Ondersteunt filtering op type

3. **`components/MonthInsights.tsx`** - UI component
   - Toont inzichten op maandpagina
   - Uitklapbare details
   - Visuele indicatoren (kleuren, iconen)

### Integratie

Het `MonthInsights` component is toegevoegd aan:

- `app/maand/[month]/page.tsx` - In een eigen "💡 Inzichten" tab

## Gebruik

1. **Start de development server:**

   ```bash
   cd gezinsuitgaven-app
   npm run dev
   ```

2. **Navigeer naar een maandpagina:**
   - Ga naar http://localhost:3000
   - Klik op een maand

3. **Bekijk de inzichten:**
   - Klik op de "💡 Inzichten" tab
   - Alle analyses worden automatisch getoond

## Voorbeelden

### Maandvergelijking

```
Deze maand: € 2.450
Vorige maand: € 2.100
Verschil: +€ 350 (+16.7%)
Gemiddelde: € 2.200
```

### Outliers

```
⚠️ Mediamarkt - € 899,00
150% hoger dan gemiddelde voor Inboedel, huis & tuin
(Gemiddelde: € 360)
```

## Toekomstige Uitbreidingen

Deze Quick Wins vormen de basis voor:

1. **AI-gedreven Adviezen** - Concrete besparingstips
2. **Budget Voorstellen** - Automatische budgettering
3. **Voorspellingen** - Toekomstige uitgaven voorspellen
4. **Chat Interface** - Conversational AI voor vragen
5. **Maandelijkse Rapporten** - Automatische samenvattingen

## Kosten

Deze feature gebruikt **geen** OpenAI API calls - alle analyses gebeuren lokaal met JavaScript/TypeScript. Dus **€ 0,00** kosten! 🎉

## Troubleshooting

### Geen inzichten zichtbaar

- Controleer of er transacties zijn voor de geselecteerde maand
- Check de browser console voor errors
- Ververs de pagina

### Verkeerde berekeningen

- Zorg dat transacties correct gecategoriseerd zijn
- Interne transacties en "Te beoordelen" worden uitgesloten van analyses

### API errors

- Check of de development server draait
- Controleer de maand parameter (formaat: YYYY-MM)
