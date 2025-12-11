# Gezinsuitgaven App - Gebruiksaanwijzing

## 🚀 Snel Starten

De app draait al op: **http://localhost:3000**

## 📱 Navigatie

### Hoofdpagina (/)

Op de hoofdpagina zie je een overzicht van alle maanden als kaarten:

- **Mei 2025** tot **November 2025**
- Elke kaart toont:
  - Totale inkomsten (groen)
  - Totale uitgaven (rood)
  - Saldo (blauw of rood)
- Klik op een maandkaart om naar de detailpagina te gaan

### Maandpagina (/maand/[maand])

Op de maandpagina zie je:

- **Categorieën** met totaalbedragen
- **Subcategorieën** met hun eigen totalen
- Klik op een subcategorie om de individuele transacties te zien
- Klik op het potlood icoon om een transactie te bewerken

### Totaal Overzicht (/overzicht)

Hier zie je:

- Totale inkomsten en uitgaven over alle maanden
- Breakdown per categorie met percentages
- Visuele balken die de verhoudingen tonen

## ✏️ Transacties Bewerken

1. Ga naar een maandpagina
2. Klik op een categorie om deze uit te klappen
3. Klik op een subcategorie om de transacties te zien
4. Klik op het **potlood icoon** bij een transactie
5. Selecteer de nieuwe **categorie** en **subcategorie**
6. Klik op **"Opslaan"**

## 💾 Data Exporteren

1. Klik op de **"Exporteer Data"** knop rechtsboven op de hoofdpagina
2. De app downloadt voor elke categorie een JSON bestand
3. Deze bestanden bevatten alle transacties met hun huidige categorisatie

## 📊 Categorieën

### Vaste Lasten

- **Woning**: Hypotheek, huur, servicekosten
- **Energie & lokale lasten**: Gas, elektriciteit, water, gemeentelijke belastingen
- **Verzekeringen**: Zorg, aansprakelijkheid, inboedel, auto, reis
- **Abonnementen & telecom**: Internet, telefoon, streaming (Spotify, Kobo Plus)
- **Vervoer**: Motorrijtuigenbelasting, brandstof, OV
- **Overige vaste lasten**: Kinderopvang, sportschool

### Variabele Uitgaven

- **Kleding & schoenen**: Kleding, schoenen, accessoires
- **Huishoudelijke uitgaven**:
  - Boodschappen (Albert Heijn, Jumbo, etc.)
  - Persoonlijke verzorging (Etos, Kruidvat, kapper)
  - Diversen (cadeaus, bloemen, etc.)
- **Vrijetijdsuitgaven**:
  - Vakantie en weekendjes weg
  - Uitgaan (restaurants, bioscoop)
  - Hobby's en speelgoed

### Speciale Categorieën

- **Inkomsten**: Salaris en overige inkomsten
- **Interne transacties**: Overboekingen tussen eigen rekeningen (ING ↔ Rabobank, spaarrekeningen)
- **Te beoordelen**: Transacties die nog gecategoriseerd moeten worden (oranje kaart)

## 🎯 Tips voor de Afspraak

1. **Begin met "Te beoordelen"**: Deze categorie (oranje) bevat ~528 transacties die je nog kunt categoriseren
2. **Check de subcategorieën**: Op de maandpagina's zie je precies hoeveel je per subcategorie uitgeeft
3. **Gebruik het totaaloverzicht**: Zie in één oogopslag waar het meeste geld naartoe gaat
4. **Exporteer voor de afspraak**: Download de data zodat je een backup hebt

## 🔍 Wat te Verwachten

### Huidige Status (automatisch gecategoriseerd):

- ✅ **926 transacties** correct gecategoriseerd
- ⚠️ **528 transacties** in "Te beoordelen"
- 🔄 **179 interne transacties** herkend
- 💰 **133 inkomsten** geïdentificeerd

### Grootste Uitgavencategorieën:

1. Huishoudelijke uitgaven (~€9.000)
2. Energie & lokale lasten (~€3.800)
3. Verzekeringen (~€3.200)
4. Vrijetijdsuitgaven (~€3.700)

## 🛠️ Technische Details

- De app werkt volledig in de browser
- Wijzigingen worden lokaal opgeslagen (in het geheugen)
- Gebruik "Exporteer Data" om wijzigingen permanent op te slaan
- De originele CSV bestanden blijven ongewijzigd

## 📞 Hulp Nodig?

- Refresh de pagina als iets niet werkt
- Check de browser console (F12) voor eventuele foutmeldingen
- De app werkt het beste in Chrome, Firefox of Safari

Veel succes met de afspraak! 💪
