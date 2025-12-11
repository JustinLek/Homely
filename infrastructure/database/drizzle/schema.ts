import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Accounts table - Bank accounts
 */
export const accounts = sqliteTable('accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  type: text('type').notNull(), // 'checking', 'savings'
  color: text('color').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Categories table - Main expense categories
 */
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  icon: text('icon'),
  color: text('color'),
  sortOrder: integer('sort_order').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Subcategories table - Detailed expense subcategories
 */
export const subcategories = sqliteTable(
  'subcategories',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
    name: text('name').notNull(),
    sortOrder: integer('sort_order').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    categoryIdx: index('idx_subcategory_category').on(table.categoryId),
  })
);

/**
 * Transactions table - All financial transactions
 */
export const transactions = sqliteTable(
  'transactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    date: text('date').notNull(), // ISO date format YYYY-MM-DD
    description: text('description').notNull(),
    counterparty: text('counterparty').notNull(),
    counterpartyNormalized: text('counterparty_normalized').notNull(),
    amount: real('amount').notNull(),
    accountId: integer('account_id').references(() => accounts.id),
    categoryId: integer('category_id').references(() => categories.id),
    subcategoryId: integer('subcategory_id').references(() => subcategories.id),
    userContext: text('user_context'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    dateIdx: index('idx_transaction_date').on(table.date),
    categoryIdx: index('idx_transaction_category').on(table.categoryId),
    accountIdx: index('idx_transaction_account').on(table.accountId),
    counterpartyIdx: index('idx_transaction_counterparty_normalized').on(
      table.counterpartyNormalized
    ),
    dateAccountIdx: index('idx_transaction_date_account').on(table.date, table.accountId),
  })
);

/**
 * AI Suggestions Cache table - Cache AI categorization suggestions
 */
export const aiSuggestionsCache = sqliteTable(
  'ai_suggestions_cache',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    counterpartyNormalized: text('counterparty_normalized').notNull().unique(),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
    subcategoryId: integer('subcategory_id')
      .notNull()
      .references(() => subcategories.id),
    confidence: real('confidence').notNull(),
    reasoning: text('reasoning'),
    source: text('source').notNull(), // 'ai', 'prefilter', 'user'
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    createdAtIdx: index('idx_ai_cache_created').on(table.createdAt),
    counterpartyIdx: index('idx_ai_cache_counterparty').on(table.counterpartyNormalized),
  })
);

/**
 * Budgets table - Budget tracking (future feature)
 */
export const budgets = sqliteTable(
  'budgets',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    categoryId: integer('category_id').references(() => categories.id),
    subcategoryId: integer('subcategory_id').references(() => subcategories.id),
    amount: real('amount').notNull(),
    period: text('period').notNull(), // 'monthly', 'yearly'
    startDate: text('start_date').notNull(),
    endDate: text('end_date'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    categoryIdx: index('idx_budget_category').on(table.categoryId),
    periodIdx: index('idx_budget_period').on(table.period, table.startDate),
  })
);

/**
 * Type exports for TypeScript
 */
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Subcategory = typeof subcategories.$inferSelect;
export type NewSubcategory = typeof subcategories.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type AISuggestionCache = typeof aiSuggestionsCache.$inferSelect;
export type NewAISuggestionCache = typeof aiSuggestionsCache.$inferInsert;

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
