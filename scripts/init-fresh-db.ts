/**
 * Initialize a fresh database with schema and seed data
 */

import Database from 'better-sqlite3';
import path from 'path';
import { CATEGORIES } from '../core/constants';

const dbPath = path.join(process.cwd(), 'data', 'transactions.db');
const db = new Database(dbPath);

console.log('🚀 Initializing fresh database...\n');

// Step 1: Create tables
console.log('📋 Step 1: Creating tables...');

db.exec(`
  -- Accounts table
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    color TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  -- Categories table
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  -- Subcategories table
  CREATE TABLE IF NOT EXISTS subcategories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    UNIQUE(category_id, name)
  );

  -- Transactions table
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    counterparty TEXT NOT NULL,
    counterparty_normalized TEXT NOT NULL,
    amount REAL NOT NULL,
    account_id INTEGER,
    category_id INTEGER,
    subcategory_id INTEGER,
    user_context TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
  );

  -- AI Suggestions Cache table
  CREATE TABLE IF NOT EXISTS ai_suggestions_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    counterparty_normalized TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    subcategory_id INTEGER NOT NULL,
    confidence REAL NOT NULL,
    reasoning TEXT,
    source TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
  );

  -- Budgets table (for future use)
  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    subcategory_id INTEGER,
    amount REAL NOT NULL,
    period TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_subcategory_category ON subcategories(category_id);
  CREATE INDEX IF NOT EXISTS idx_transaction_date ON transactions(date);
  CREATE INDEX IF NOT EXISTS idx_transaction_category ON transactions(category_id);
  CREATE INDEX IF NOT EXISTS idx_transaction_account ON transactions(account_id);
  CREATE INDEX IF NOT EXISTS idx_transaction_counterparty_normalized ON transactions(counterparty_normalized);
  CREATE INDEX IF NOT EXISTS idx_transaction_date_account ON transactions(date, account_id);
  CREATE INDEX IF NOT EXISTS idx_ai_cache_created ON ai_suggestions_cache(created_at);
  CREATE INDEX IF NOT EXISTS idx_ai_cache_counterparty ON ai_suggestions_cache(counterparty_normalized);
  CREATE INDEX IF NOT EXISTS idx_budget_category ON budgets(category_id);
  CREATE INDEX IF NOT EXISTS idx_budget_period ON budgets(period, start_date);
`);

console.log('✅ Tables created\n');

// Step 2: Seed accounts
console.log('📋 Step 2: Seeding accounts...');

const accountsStmt = db.prepare(`
  INSERT OR IGNORE INTO accounts (name, type, color) VALUES (?, ?, ?)
`);

const accounts = [
  { name: 'ING Betaalrekening', type: 'checking', color: '#FF6200' },
  { name: 'ING Spaarrekening', type: 'savings', color: '#00A3E0' },
];

for (const account of accounts) {
  accountsStmt.run(account.name, account.type, account.color);
}

console.log(`✅ Seeded ${accounts.length} accounts\n`);

// Step 3: Seed categories and subcategories
console.log('📋 Step 3: Seeding categories and subcategories...');

const categoryStmt = db.prepare(`
  INSERT OR IGNORE INTO categories (key, name, sort_order) VALUES (?, ?, ?)
`);

const subcategoryStmt = db.prepare(`
  INSERT OR IGNORE INTO subcategories (category_id, name, sort_order) VALUES (?, ?, ?)
`);

let categoryCount = 0;
let subcategoryCount = 0;

for (const [key, category] of Object.entries(CATEGORIES)) {
  categoryStmt.run(key, category.name, categoryCount);
  categoryCount++;

  const categoryId = db.prepare('SELECT id FROM categories WHERE key = ?').get(key) as {
    id: number;
  };

  let subOrder = 0;
  for (const subcategory of category.subcategories) {
    subcategoryStmt.run(categoryId.id, subcategory, subOrder);
    subcategoryCount++;
    subOrder++;
  }
}

console.log(`✅ Seeded ${categoryCount} categories and ${subcategoryCount} subcategories\n`);

console.log('✅ Database initialized successfully!\n');

db.close();
