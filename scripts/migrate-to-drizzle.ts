/**
 * Migration script to migrate existing data to new Drizzle schema
 *
 * This script:
 * 1. Creates new tables with Drizzle schema
 * 2. Seeds categories and subcategories
 * 3. Creates accounts
 * 4. Migrates existing transactions
 * 5. Migrates AI suggestions cache
 */

import Database from 'better-sqlite3';
import path from 'path';
import { CATEGORIES } from '../core/constants';

const dbPath = path.join(process.cwd(), 'data', 'transactions.db');
const db = new Database(dbPath);

console.log('🚀 Starting migration to Drizzle schema...\n');

// Step 1: Create new tables
console.log('📋 Step 1: Creating new tables...');

db.exec(`
  -- Accounts table
  CREATE TABLE IF NOT EXISTS accounts_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    color TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  -- Categories table
  CREATE TABLE IF NOT EXISTS categories_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    sort_order INTEGER NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  -- Subcategories table
  CREATE TABLE IF NOT EXISTS subcategories_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL REFERENCES categories_new(id),
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE INDEX IF NOT EXISTS idx_subcategory_category_new ON subcategories_new(category_id);

  -- Transactions table
  CREATE TABLE IF NOT EXISTS transactions_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    counterparty TEXT NOT NULL,
    counterparty_normalized TEXT NOT NULL,
    amount REAL NOT NULL,
    account_id INTEGER REFERENCES accounts_new(id),
    category_id INTEGER REFERENCES categories_new(id),
    subcategory_id INTEGER REFERENCES subcategories_new(id),
    user_context TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE INDEX IF NOT EXISTS idx_transaction_date_new ON transactions_new(date);
  CREATE INDEX IF NOT EXISTS idx_transaction_category_new ON transactions_new(category_id);
  CREATE INDEX IF NOT EXISTS idx_transaction_account_new ON transactions_new(account_id);
  CREATE INDEX IF NOT EXISTS idx_transaction_counterparty_normalized_new ON transactions_new(counterparty_normalized);
  CREATE INDEX IF NOT EXISTS idx_transaction_date_account_new ON transactions_new(date, account_id);

  -- AI Suggestions Cache table
  CREATE TABLE IF NOT EXISTS ai_suggestions_cache_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    counterparty_normalized TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL REFERENCES categories_new(id),
    subcategory_id INTEGER NOT NULL REFERENCES subcategories_new(id),
    confidence REAL NOT NULL,
    reasoning TEXT,
    source TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE INDEX IF NOT EXISTS idx_ai_cache_created_new ON ai_suggestions_cache_new(created_at);
  CREATE INDEX IF NOT EXISTS idx_ai_cache_counterparty_new ON ai_suggestions_cache_new(counterparty_normalized);

  -- Budgets table (for future use)
  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER REFERENCES categories_new(id),
    subcategory_id INTEGER REFERENCES subcategories_new(id),
    amount REAL NOT NULL,
    period TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE INDEX IF NOT EXISTS idx_budget_category ON budgets(category_id);
  CREATE INDEX IF NOT EXISTS idx_budget_period ON budgets(period, start_date);
`);

console.log('✅ Tables created\n');

// Step 2: Seed accounts
console.log('📋 Step 2: Seeding accounts...');

const accountsData = [
  { name: 'ING', type: 'checking', color: 'bg-orange-500' },
  { name: 'Rabobank', type: 'checking', color: 'bg-blue-700' },
];

const insertAccount = db.prepare(`
  INSERT INTO accounts_new (name, type, color)
  VALUES (?, ?, ?)
  ON CONFLICT(name) DO NOTHING
`);

for (const account of accountsData) {
  insertAccount.run(account.name, account.type, account.color);
}

console.log(`✅ Seeded ${accountsData.length} accounts\n`);

// Step 3: Seed categories and subcategories
console.log('📋 Step 3: Seeding categories and subcategories...');

const insertCategory = db.prepare(`
  INSERT INTO categories_new (key, name, icon, color, sort_order)
  VALUES (?, ?, ?, ?, ?)
  ON CONFLICT(key) DO NOTHING
`);

const insertSubcategory = db.prepare(`
  INSERT INTO subcategories_new (category_id, name, sort_order)
  VALUES (?, ?, ?)
`);

let sortOrder = 0;
let totalSubcategories = 0;

for (const [key, category] of Object.entries(CATEGORIES)) {
  insertCategory.run(
    category.key,
    category.name,
    null, // icon will be added later
    null, // color will be added later
    sortOrder++
  );

  // Get the category ID
  const categoryRow = db
    .prepare('SELECT id FROM categories_new WHERE key = ?')
    .get(category.key) as { id: number };

  if (categoryRow) {
    let subSortOrder = 0;
    for (const subcategoryName of category.subcategories) {
      insertSubcategory.run(categoryRow.id, subcategoryName, subSortOrder++);
      totalSubcategories++;
    }
  }
}

console.log(
  `✅ Seeded ${Object.keys(CATEGORIES).length} categories and ${totalSubcategories} subcategories\n`
);

// Step 4: Migrate existing transactions
console.log('📋 Step 4: Migrating existing transactions...');

// Helper function to normalize counterparty
function normalizeCounterparty(counterparty: string): string {
  return counterparty
    .toLowerCase()
    .replace(/\d+/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

// Get account ID mapping
const accountMapping = new Map<string, number>();
const accounts = db.prepare('SELECT id, name FROM accounts_new').all() as Array<{
  id: number;
  name: string;
}>;
for (const account of accounts) {
  accountMapping.set(account.name, account.id);
}

// Get category/subcategory mapping
const categoryMapping = new Map<string, number>();
const subcategoryMapping = new Map<string, Map<string, number>>();

const categories = db.prepare('SELECT id, key FROM categories_new').all() as Array<{
  id: number;
  key: string;
}>;
for (const cat of categories) {
  categoryMapping.set(cat.key, cat.id);

  const subcats = db
    .prepare('SELECT id, name FROM subcategories_new WHERE category_id = ?')
    .all(cat.id) as Array<{ id: number; name: string }>;
  const subMap = new Map<string, number>();
  for (const subcat of subcats) {
    subMap.set(subcat.name, subcat.id);
  }
  subcategoryMapping.set(cat.key, subMap);
}

// Migrate transactions
const oldTransactions = db.prepare('SELECT * FROM transactions').all() as Array<any>;

const insertTransaction = db.prepare(`
  INSERT INTO transactions_new (
    date, description, counterparty, counterparty_normalized,
    amount, account_id, category_id, subcategory_id, user_context,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let migratedCount = 0;
let skippedCount = 0;

for (const oldTx of oldTransactions) {
  try {
    const accountId = accountMapping.get(oldTx.account) || null;
    const normalized = normalizeCounterparty(oldTx.counterparty);

    let categoryId = null;
    let subcategoryId = null;

    if (oldTx.category && oldTx.category !== 'te_beoordelen') {
      categoryId = categoryMapping.get(oldTx.category) || null;
      if (categoryId && oldTx.subcategory) {
        const subMap = subcategoryMapping.get(oldTx.category);
        subcategoryId = subMap?.get(oldTx.subcategory) || null;
      }
    }

    const createdAt = oldTx.created_at
      ? new Date(oldTx.created_at).getTime() / 1000
      : Math.floor(Date.now() / 1000);
    const updatedAt = oldTx.updated_at ? new Date(oldTx.updated_at).getTime() / 1000 : createdAt;

    insertTransaction.run(
      oldTx.date,
      oldTx.description,
      oldTx.counterparty,
      normalized,
      oldTx.amount,
      accountId,
      categoryId,
      subcategoryId,
      oldTx.user_context || null,
      createdAt,
      updatedAt
    );

    migratedCount++;
  } catch (error) {
    console.error(`Failed to migrate transaction ${oldTx.id}:`, error);
    skippedCount++;
  }
}

console.log(`✅ Migrated ${migratedCount} transactions (${skippedCount} skipped)\n`);

// Step 5: Migrate AI suggestions cache
console.log('📋 Step 5: Migrating AI suggestions cache...');

const oldCache = db.prepare('SELECT * FROM ai_suggestions_cache').all() as Array<any>;

const insertCache = db.prepare(`
  INSERT INTO ai_suggestions_cache_new (
    counterparty_normalized, category_id, subcategory_id,
    confidence, reasoning, source, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(counterparty_normalized) DO NOTHING
`);

let cacheCount = 0;
let cacheSkipped = 0;

for (const oldEntry of oldCache) {
  try {
    const categoryId = categoryMapping.get(oldEntry.category) || null;
    let subcategoryId = null;

    if (categoryId && oldEntry.subcategory) {
      const subMap = subcategoryMapping.get(oldEntry.category);
      subcategoryId = subMap?.get(oldEntry.subcategory) || null;
    }

    if (!categoryId || !subcategoryId) {
      cacheSkipped++;
      continue;
    }

    const createdAt = oldEntry.created_at
      ? new Date(oldEntry.created_at).getTime() / 1000
      : Math.floor(Date.now() / 1000);

    insertCache.run(
      oldEntry.counterparty_normalized,
      categoryId,
      subcategoryId,
      oldEntry.confidence,
      oldEntry.reasoning || null,
      'ai', // default source
      createdAt
    );

    cacheCount++;
  } catch (error) {
    console.error(`Failed to migrate cache entry:`, error);
    cacheSkipped++;
  }
}

console.log(`✅ Migrated ${cacheCount} cache entries (${cacheSkipped} skipped)\n`);

// Step 6: Rename tables
console.log('📋 Step 6: Swapping old and new tables...');

db.exec(`
  -- Backup old tables
  DROP TABLE IF EXISTS transactions_old;
  DROP TABLE IF EXISTS ai_suggestions_cache_old;

  ALTER TABLE transactions RENAME TO transactions_old;
  ALTER TABLE ai_suggestions_cache RENAME TO ai_suggestions_cache_old;

  -- Rename new tables
  ALTER TABLE accounts_new RENAME TO accounts;
  ALTER TABLE categories_new RENAME TO categories;
  ALTER TABLE subcategories_new RENAME TO subcategories;
  ALTER TABLE transactions_new RENAME TO transactions;
  ALTER TABLE ai_suggestions_cache_new RENAME TO ai_suggestions_cache;
`);

console.log('✅ Tables swapped\n');

// Step 7: Summary
console.log('🎉 Migration completed successfully!\n');
console.log('Summary:');
console.log(`  - Accounts: ${accountsData.length}`);
console.log(`  - Categories: ${Object.keys(CATEGORIES).length}`);
console.log(`  - Subcategories: ${totalSubcategories}`);
console.log(`  - Transactions: ${migratedCount} migrated, ${skippedCount} skipped`);
console.log(`  - Cache entries: ${cacheCount} migrated, ${cacheSkipped} skipped`);
console.log('\n⚠️  Old tables backed up as transactions_old and ai_suggestions_cache_old');
console.log('   You can drop them once you verify the migration:\n');
console.log('   DROP TABLE transactions_old;');
console.log('   DROP TABLE ai_suggestions_cache_old;\n');

db.close();
