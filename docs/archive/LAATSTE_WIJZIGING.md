# 🔄 Re-analyseer Maand Verplaatst

## Wijziging

De **"Re-analyseer Maand"** functionaliteit is verplaatst van de **"📊 Overzicht"** tab naar de **"📋 Te Beoordelen"** tab.

## Reden

Dit is logischer omdat:

- Re-analyse is bedoeld om transacties opnieuw te categoriseren
- Het past beter bij de workflow van het beoordelen van transacties
- De overview tab blijft nu puur voor het bekijken van uitgaven

## Nieuwe Tab Structuur

### 📊 Overzicht Tab

- Uitgaven per categorie
- Subcategorieën met totalen
- Interne transacties (indien aanwezig)
- ❌ Geen Re-analyseer Maand meer

### 💡 Inzichten Tab

- Samenvatting cards (3x)
- Maandvergelijking
- Top 5 categorieën
- Ongebruikelijke uitgaven

### 📋 Te Beoordelen Tab

- ✅ **Re-analyseer Maand** (nieuw hier!)
- Bulk AI Suggestie
- Te beoordelen transacties lijst

## Voordelen

1. **Betere workflow**: Re-analyse → Bulk AI → Individuele beoordeling
2. **Logische groepering**: Alle AI-functies bij elkaar
3. **Schonere overview**: Overzicht tab is nu puur voor bekijken

## Gebruik

1. Ga naar een maandpagina
2. Klik op **"📋 Te Beoordelen"** tab
3. Bovenaan zie je nu:
   - **Re-analyseer Maand** (paars/roze)
   - **AI Bulk Categorisatie** (blauw)
   - **Te Beoordelen lijst** (oranje)

## Gewijzigd Bestand

- `app/maand/[month]/page.tsx`
  - ❌ Verwijderd: ReAnalyzeMonth van overview tab
  - ✅ Toegevoegd: ReAnalyzeMonth aan review tab (bovenaan)

## Volgorde in Te Beoordelen Tab

```
┌─────────────────────────────────────────┐
│ 🔄 Re-analyseer Maand                   │
│ Analyseer alle transacties opnieuw      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 🤖 AI Bulk Categorisatie                │
│ Categoriseer te beoordelen transacties  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 📋 Te Beoordelen                        │
│ Individuele transacties beoordelen      │
└─────────────────────────────────────────┘
```

## Workflow

1. **Re-analyseer Maand**: Analyseer ALLE transacties opnieuw met nieuwste AI kennis
2. **Bulk AI**: Categoriseer alleen de "Te Beoordelen" transacties
3. **Individueel**: Bekijk en pas individuele transacties aan

Perfect voor het opschonen van je data! 🎉
