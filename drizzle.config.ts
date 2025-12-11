import type { Config } from 'drizzle-kit';

export default {
  schema: './infrastructure/database/drizzle/schema.ts',
  out: './infrastructure/database/drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data/transactions.db',
  },
} satisfies Config;
