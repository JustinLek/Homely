import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { initDatabase, insertTransaction, getTransactionCount } from '../lib/db';

// Initialise database (does not clear existing data)
initDatabase();

console.log('🗄️  Database initialised');
console.log('📊 Current transaction count:', getTransactionCount().count);

let totalImported = 0;

// Import ING CSV (January - April 2025)
const ingCsvPath = path.join(process.cwd(), '..', 'NL69INGB0688197191_01-01-2025_30-04-2025.csv');
if (fs.existsSync(ingCsvPath)) {
  console.log('📥 Importing ING transactions (Jan-Apr 2025)...');

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

    insertTransaction({
      date: formattedDate,
      description: `${record['Naam / Omschrijving']} ${record['Mededelingen']}`.trim(),
      counterparty: record['Naam / Omschrijving'],
      amount: amount,
      account: 'ING',
      category: 'te_beoordelen',
      subcategory: 'Onbekend',
    });

    totalImported++;
  }

  console.log(`✅ Imported ${ingRecords.length} ING transactions`);
} else {
  console.log('⚠️  ING CSV not found at:', ingCsvPath);
}

// Import Rabobank CSV (January - April 2025)
const raboCsvPath = path.join(
  process.cwd(),
  '..',
  'CSV_A_NL50RABO0330139916_EUR_20250101_20250430.csv'
);
if (fs.existsSync(raboCsvPath)) {
  console.log('📥 Importing Rabobank transactions (Jan-Apr 2025)...');

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

    insertTransaction({
      date: record['Datum'],
      description: description,
      counterparty: record['Naam tegenpartij'],
      amount: amount,
      account: 'Rabobank',
      category: 'te_beoordelen',
      subcategory: 'Onbekend',
    });

    totalImported++;
  }

  console.log(`✅ Imported ${raboRecords.length} Rabobank transactions`);
} else {
  console.log('⚠️  Rabobank CSV not found at:', raboCsvPath);
}

// Verify import
const count = getTransactionCount();
console.log(`\n✨ Import complete! Total transactions in database: ${count.count}`);
console.log(`📊 Added ${totalImported} new transactions`);
console.log('🎯 New transactions are set to "te_beoordelen" - ready for AI categorisation!');
