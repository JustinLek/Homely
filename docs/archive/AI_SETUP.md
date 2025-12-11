# AI Suggesties Setup

## OpenAI API Key Instellen

Om de AI suggestie functie te gebruiken, heb je een OpenAI API key nodig.

### Stap 1: API Key Verkrijgen

1. Ga naar [OpenAI Platform](https://platform.openai.com/api-keys)
2. Log in of maak een account aan
3. Klik op "Create new secret key"
4. Kopieer de API key (deze wordt maar 1 keer getoond!)

### Stap 2: API Key Configureren

1. Kopieer het voorbeeld bestand:

   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` en vervang de placeholder:

   ```
   OPENAI_API_KEY=sk-jouw-echte-api-key-hier
   ```

3. Herstart de development server:
   ```bash
   npm run dev
   ```

## Kosten

De AI suggesties gebruiken het `gpt-4o-mini` model, wat zeer goedkoop is:

- ~€0.15 per 1 miljoen input tokens
- ~€0.60 per 1 miljoen output tokens

Voor 500 transacties kost dit ongeveer **€0.05 - €0.10** in totaal.

## Hoe Werkt Het?

### Individuele Suggestie

1. Ga naar een maandpagina
2. Klik op een transactie in "Te beoordelen"
3. Klik op de **"AI Suggestie"** knop (blauw/paars gradient)
4. AI analyseert de transactie en geeft een suggestie met:
   - Categorie
   - Subcategorie
   - Zekerheidspercentage
   - Uitleg waarom deze categorisatie past
5. Klik op **"Suggestie Toepassen"** om de suggestie over te nemen
6. Of pas handmatig aan en klik **"Opslaan"**

### Bulk Suggestie

1. Ga naar een maandpagina met "Te beoordelen" transacties
2. Bovenaan zie je een blauwe box: **"AI Bulk Categorisatie"**
3. Klik op **"Start AI Analyse"**
4. Wacht terwijl AI alle transacties analyseert (met voortgangsbalk)
5. Bekijk de resultaten
6. Klik op **"Alle Suggesties Toepassen"** om alles in één keer te categoriseren

## AI Analyse

De AI analyseert:

- **Tegenpartij naam**: Wie heeft betaald of ontvangen?
- **Beschrijving**: Extra details over de transactie
- **Bedrag**: Positief (inkomsten) of negatief (uitgaven)
- **Rekening**: ING of Rabobank

De AI herkent:

- Nederlandse winkels en bedrijven
- Vaste lasten (hypotheek, verzekeringen, energie)
- Abonnementen (Spotify, Netflix, etc.)
- Supermarkten en boodschappen
- Restaurants en uitgaan
- Kleding winkels
- Interne overboekingen

## Troubleshooting

### "Failed to generate suggestion"

- Check of je API key correct is ingesteld in `.env.local`
- Check of je voldoende credits hebt op je OpenAI account
- Herstart de development server

### AI geeft verkeerde suggesties

- De AI is niet perfect, controleer altijd de suggesties
- Je kunt suggesties altijd handmatig aanpassen
- De AI leert niet van je correcties (dit is stateless)

### Bulk analyse duurt lang

- Dit is normaal! Elke transactie wordt individueel geanalyseerd
- Voor 100 transacties duurt het ~2-3 minuten
- Je kunt de pagina niet sluiten tijdens het proces

## Privacy

- Transactie data wordt alleen naar OpenAI gestuurd voor analyse
- OpenAI bewaart de data niet (volgens hun API beleid)
- De data blijft in je browser en wordt niet opgeslagen op een server
- Gebruik op eigen risico met gevoelige financiële data

## Tips

- Begin met de bulk analyse voor een snelle eerste categorisatie
- Controleer daarna de "Te beoordelen" categorie voor resterende items
- Gebruik individuele suggesties voor twijfelgevallen
- De AI is het beste met bekende Nederlandse bedrijven en winkels
