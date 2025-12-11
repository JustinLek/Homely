# Database Setup - Gezinsuitgaven App

## Overzicht

De app gebruikt nu een **SQLite database** om alle transacties op te slaan. Dit betekent dat:

- ✅ Alle wijzigingen permanent worden opgeslagen
- ✅ AI categorisaties blijven behouden
- ✅ Je kunt de app sluiten en later verder gaan
- ✅ Geen JSON bestanden meer nodig

## Database Locatie

De database bevindt zich in:

```
gezinsuitgaven-app/data/transactions.db
```

## Eerste Keer Setup

### 1. CSV Bestanden Importeren

Alle transacties uit de CSV bestanden zijn al geïmporteerd! Er zijn **1454 transacties** in de database geladen:

- 1306 ING transacties
- 148 Rabobank transacties

Alle transacties zijn ingesteld op categorie **"te_beoordelen"** - klaar voor AI categorisatie!

### 2. Opnieuw Importeren (indien nodig)

Als je de CSV bestanden opnieuw wilt importeren:

```bash
cd gezinsuitgaven-app
npm run import
```

⚠️ **Let op**: Dit verwijdert ALLE bestaande transacties en categorisaties!

## Database Schema

```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  counterparty TEXT NOT NULL,
  amount REAL NOT NULL,
  account TEXT NOT NULL,
  category TEXT DEFAULT 'te_beoordelen',
  subcategory TEXT DEFAULT 'Onbekend',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Hoe Het Werkt

### Transacties Laden

De app haalt transacties op via de API route:

```
GET /api/transactions
```

### Transacties Updaten

Wanneer je een transactie categoriseert (handmatig of met AI):

```
PATCH /api/transactions
{
  "id": 123,
  "category": "huishoudelijke_uitgaven",
  "subcategory": "Boodschappen"
}
```

### Bulk Updates

Bij AI bulk categorisatie:

```
PATCH /api/transactions
{
  "bulk": true,
  "updates": [
    { "id": 123, "category": "...", "subcategory": "..." },
    { "id": 124, "category": "...", "subcategory": "..." }
  ]
}
```

## Database Beheer

### Database Bekijken

Je kunt de database bekijken met een SQLite viewer zoals:

- [DB Browser for SQLite](https://sqlitebrowser.org/) (gratis)
- [TablePlus](https://tableplus.com/) (gratis voor 2 tabs)
- Command line: `sqlite3 data/transactions.db`

### Database Backup

Maak regelmatig een backup:

```bash
cp data/transactions.db data/transactions-backup-$(date +%Y%m%d).db
```

### Database Statistieken

Aantal transacties per categorie:

```sql
SELECT category, COUNT(*) as count, SUM(amount) as total
FROM transactions
GROUP BY category
ORDER BY count DESC;
```

## Migratie van Oude Setup

De oude Python scripts en JSON bestanden zijn verwijderd:

- ❌ `categorize_transactions.py`
- ❌ `generate_html.py`
- ❌ `data/*.json`
- ❌ `venv/`

Alles werkt nu via de database! 🎉

## Troubleshooting

### "Database is locked"

- Sluit alle andere programma's die de database gebruiken
- Herstart de development server

### "No such table: transactions"

- Run het import script opnieuw: `npm run import`

### Transacties zijn verdwenen

- Check of de database file bestaat: `ls -la data/transactions.db`
- Herstel van backup indien beschikbaar

## Volgende Stappen

Nu de database werkt, kun je:

1. ✅ AI gebruiken om transacties te categoriseren
2. ✅ Wijzigingen worden automatisch opgeslagen
3. ✅ De app sluiten en later verder gaan
4. ✅ Exporteren naar JSON voor backup of delen

Veel succes! 🚀
