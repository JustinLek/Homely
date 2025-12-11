/**
 * Import CSV files from ING and Rabobank into the database
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'data', 'transactions.db');
const db = new Database(dbPath);

console.log('🚀 Starting CSV import...\n');

// Helper function to normalize counterparty name
function normalizeCounterparty(counterparty: string): string {
  return counterparty
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// Get account IDs
const ingAccount = db
  .prepare('SELECT id FROM accounts WHERE name = ?')
  .get('ING Betaalrekening') as
  | {
      id: number;
    }
  | undefined;
const raboAccount = db
  .prepare('SELECT id FROM accounts WHERE name = ?')
  .get('ING Spaarrekening') as
  | {
      id: number;
    }
  | undefined;

if (!ingAccount) {
  console.error('❌ ING Betaalrekening account not found in database');
  process.exit(1);
}

// Get "te_beoordelen" category
const teBeoordelenCategory = db
  .prepare('SELECT id FROM categories WHERE key = ?')
  .get('te_beoordelen') as { id: number } | undefined;

if (!teBeoordelenCategory) {
  console.error('❌ "te_beoordelen" category not found in database');
  process.exit(1);
}

// Prepare insert statement
const insertStmt = db.prepare(`
  INSERT INTO transactions (
    date, description, counterparty, counterparty_normalized, 
    amount, account_id, category_id, subcategory_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
`);

let totalImported = 0;

// Import ING CSV files
// Try multiple locations: docs/csv-data/, data/csv/, data/, parent directory
const ingCsvFilenames = [
  'NL69INGB0688197191_01-01-2025_30-04-2025.csv',
  'NL69INGB0688197191_01-05-2025_30-11-2025.csv',
];

for (const ingCsvFilename of ingCsvFilenames) {
  const ingCsvLocations = [
    path.join(process.cwd(), 'docs', 'csv-data', ingCsvFilename),
    path.join(process.cwd(), 'data', 'csv', ingCsvFilename),
    path.join(process.cwd(), 'data', ingCsvFilename),
    path.join(process.cwd(), '..', ingCsvFilename),
  ];

  const ingCsvPath = ingCsvLocations.find((p) => fs.existsSync(p));

  if (ingCsvPath) {
    console.log(`📥 Importing ING transactions from ${ingCsvFilename}...`);

    const ingContent = fs.readFileSync(ingCsvPath, 'utf-8');
    const ingRecords = parse(ingContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ';',
    });

    for (const record of ingRecords) {
      const date = record['Datum'];
      const formattedDate = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;

      let amount = parseFloat(record['Bedrag (EUR)'].replace(',', '.'));
      if (record['Af Bij'] === 'Af') {
        amount = -amount;
      }

      const counterparty = record['Naam / Omschrijving'] || 'Onbekend';
      const description = `${record['Naam / Omschrijving']} ${record['Mededelingen']}`.trim();

      insertStmt.run(
        formattedDate,
        description,
        counterparty,
        normalizeCounterparty(counterparty),
        amount,
        ingAccount.id,
        teBeoordelenCategory.id
      );

      totalImported++;
    }

    console.log(`✅ Imported ${ingRecords.length} ING transactions\n`);
  } else {
    console.log(`⚠️  ${ingCsvFilename} not found. Tried locations:`);
    ingCsvLocations.forEach((loc) => console.log(`   - ${loc}`));
    console.log();
  }
}

// Import Rabobank CSV files (using ING Spaarrekening account)
const raboCsvFilenames = [
  'CSV_A_NL50RABO0330139916_EUR_20250101_20250430.csv',
  'CSV_A_NL50RABO0330139916_EUR_20250501_20251130.csv',
];

for (const raboCsvFilename of raboCsvFilenames) {
  const raboCsvLocations = [
    path.join(process.cwd(), 'docs', 'csv-data', raboCsvFilename),
    path.join(process.cwd(), 'data', 'csv', raboCsvFilename),
    path.join(process.cwd(), 'data', raboCsvFilename),
    path.join(process.cwd(), '..', raboCsvFilename),
  ];

  const raboCsvPath = raboCsvLocations.find((p) => fs.existsSync(p));

  if (raboCsvPath && raboAccount) {
    console.log(`📥 Importing Rabobank transactions from ${raboCsvFilename}...`);

    const raboContent = fs.readFileSync(raboCsvPath, 'latin1');
    const raboRecords = parse(raboContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    });

    for (const record of raboRecords) {
      const amount = parseFloat(record['Bedrag'].replace(',', '.'));

      const description = [
        record['Omschrijving-1'],
        record['Omschrijving-2'],
        record['Omschrijving-3'],
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

      const counterparty = record['Naam tegenpartij'] || 'Onbekend';

      insertStmt.run(
        record['Datum'],
        description,
        counterparty,
        normalizeCounterparty(counterparty),
        amount,
        raboAccount.id,
        teBeoordelenCategory.id
      );

      totalImported++;
    }

    console.log(`✅ Imported ${raboRecords.length} Rabobank transactions\n`);
  } else {
    if (!raboCsvPath) {
      console.log(`⚠️  ${raboCsvFilename} not found. Tried locations:`);
      raboCsvLocations.forEach((loc) => console.log(`   - ${loc}`));
      console.log();
    }
    if (!raboAccount) {
      console.log('⚠️  ING Spaarrekening account not found in database\n');
    }
  }
}

// Verify import
const count = db.prepare('SELECT COUNT(*) as count FROM transactions').get() as { count: number };
console.log(`✨ Import complete! Total transactions in database: ${count.count}`);
console.log('🎯 All transactions are set to "te_beoordelen" - ready for AI categorization!\n');

db.close();
