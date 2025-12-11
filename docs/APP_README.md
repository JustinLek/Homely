# Gezinsuitgaven App

Een interactieve Next.js applicatie voor het beheren en categoriseren van gezinsuitgaven.

## Functies

- 📊 **Maandoverzicht**: Bekijk transacties per maand, gegroepeerd per categorie
- ✏️ **Bewerken**: Wijzig de categorie en subcategorie van transacties
- 🤖 **AI Suggesties**: Laat AI transacties automatisch categoriseren (individueel of bulk)
- 📈 **Totaal Overzicht**: Zie statistieken en uitgaven per categorie over de hele periode
- 💾 **Exporteren**: Download de aangepaste data als JSON bestanden
- 📑 **Subcategorie Totalen**: Zie precies hoeveel je per subcategorie uitgeeft

## Installatie

```bash
npm install
```

## AI Suggesties Setup (Optioneel)

Voor AI-powered categorisatie suggesties:

1. Kopieer het voorbeeld bestand:

   ```bash
   cp .env.local.example .env.local
   ```

2. Voeg je OpenAI API key toe aan `.env.local`:
   ```
   OPENAI_API_KEY=sk-jouw-api-key-hier
   ```

Zie [archive/AI_SETUP.md](./archive/AI_SETUP.md) voor gedetailleerde instructies.

## Development

Start de development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## Data Structuur

De app gebruikt een SQLite database (`data/transactions.db`) met Drizzle ORM voor data opslag.

### Database Schema

- `accounts`: Bank rekeningen
- `categories`: Uitgaven categorieën
- `subcategories`: Subcategorieën
- `transactions`: Financiële transacties
- `ai_suggestions_cache`: AI categorisatie cache

### Data Importeren

```bash
# Importeer CSV bestanden
npm run import

# Migreer oude JSON data naar SQLite
npm run migrate
```

## Gebruik

### Transacties Bewerken

1. Klik op een categorie kaart om deze uit te klappen
2. Klik op het potlood icoon bij een transactie
3. **Optioneel**: Klik op "AI Suggestie" voor een automatische categorisatie
4. Selecteer de nieuwe categorie en subcategorie
5. Klik op "Opslaan"

### AI Bulk Categorisatie

1. Ga naar een maandpagina met "Te beoordelen" transacties
2. Klik op **"Start AI Analyse"** in de blauwe box bovenaan
3. Wacht terwijl AI alle transacties analyseert
4. Bekijk de resultaten en klik op **"Alle Suggesties Toepassen"**

### Data Exporteren

1. Klik op de "Exporteer Data" knop rechtsboven
2. De app downloadt voor elke categorie een JSON bestand met de huidige staat van de transacties
3. Deze bestanden kunnen gebruikt worden om de data te bewaren of te delen

### Totaal Overzicht

1. Klik op "Totaal Overzicht" rechtsboven
2. Zie een samenvatting van alle inkomsten en uitgaven
3. Bekijk een breakdown per categorie met percentages

## Categorieën

De app ondersteunt de volgende categorieën:

- **Woning**: Hypotheek, huur, servicekosten
- **Energie & lokale lasten**: Gas, elektriciteit, water, belastingen
- **Verzekeringen**: Zorg, aansprakelijkheid, inboedel, etc.
- **Abonnementen & telecom**: Internet, telefoon, streaming diensten
- **Vervoer**: Auto, brandstof, OV, fiets
- **Kleding & schoenen**
- **Huishoudelijke uitgaven**: Boodschappen, persoonlijke verzorging, diversen
- **Vrijetijdsuitgaven**: Vakantie, hobby's, uitgaan
- **Inkomsten**: Salaris en overige inkomsten
- **Interne transacties**: Overboekingen tussen eigen rekeningen
- **Te beoordelen**: Transacties die nog gecategoriseerd moeten worden

## Technologie

- **Next.js 16** met App Router en Server Components
- **TypeScript** voor type safety
- **Tailwind CSS v4** voor styling
- **Drizzle ORM** met SQLite database
- **shadcn/ui** voor UI components
- **Zod** voor validatie
- **OpenAI API** voor AI categorisatie
- **Clean Architecture** principes

## Tips

- Begin met het categoriseren van transacties in "Te beoordelen" (oranje kaart)
- Gebruik de maandweergave om patronen te herkennen
- Exporteer regelmatig je data om wijzigingen te bewaren
- Check het totaaloverzicht om te zien waar het meeste geld naartoe gaat
