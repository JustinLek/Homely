import { eq, and, like, isNull, sql, desc } from 'drizzle-orm';
import { db } from '../drizzle/client';
import { transactions, accounts, categories, subcategories } from '../drizzle/schema';
import { ITransactionRepository } from '@/core/repositories/transaction.repository';
import { TransactionEntity } from '@/core/entities/transaction.entity';
import { normalizeCounterparty } from '@/core/lib/utils';
import { DatabaseError, NotFoundError } from '@/core/lib/errors';

/**
 * Transaction Repository Implementation using Drizzle ORM
 */
export class TransactionRepository implements ITransactionRepository {
  /**
   * Map database row to entity (simple version without joins)
   */
  private mapToEntity(row: typeof transactions.$inferSelect): TransactionEntity {
    return new TransactionEntity(
      row.id,
      row.date,
      row.description,
      row.counterparty,
      row.counterpartyNormalized,
      row.amount,
      row.accountId,
      row.categoryId,
      row.subcategoryId,
      row.userContext,
      new Date(row.createdAt),
      new Date(row.updatedAt)
    );
  }

  /**
   * Map database row with joins to entity (includes related data)
   */
  private mapToEntityWithRelations(row: any): TransactionEntity {
    return new TransactionEntity(
      row.id,
      row.date,
      row.description,
      row.counterparty,
      row.counterpartyNormalized,
      row.amount,
      row.accountId,
      row.categoryId,
      row.subcategoryId,
      row.userContext,
      new Date(row.createdAt),
      new Date(row.updatedAt),
      // Related entities
      row.account_name
        ? {
            id: row.accountId!,
            name: row.account_name,
            color: row.account_color,
          }
        : null,
      row.category_key
        ? {
            id: row.categoryId!,
            key: row.category_key,
            name: row.category_name,
            icon: row.category_icon || '',
            color: row.category_color || '',
          }
        : null,
      row.subcategory_name
        ? {
            id: row.subcategoryId!,
            name: row.subcategory_name,
          }
        : null
    );
  }

  async findAll(): Promise<TransactionEntity[]> {
    try {
      const rows = await db
        .select({
          id: transactions.id,
          date: transactions.date,
          description: transactions.description,
          counterparty: transactions.counterparty,
          counterpartyNormalized: transactions.counterpartyNormalized,
          amount: transactions.amount,
          accountId: transactions.accountId,
          categoryId: transactions.categoryId,
          subcategoryId: transactions.subcategoryId,
          userContext: transactions.userContext,
          createdAt: transactions.createdAt,
          updatedAt: transactions.updatedAt,
          account_name: accounts.name,
          account_color: accounts.color,
          category_key: categories.key,
          category_name: categories.name,
          category_icon: categories.icon,
          category_color: categories.color,
          subcategory_name: subcategories.name,
        })
        .from(transactions)
        .leftJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .leftJoin(subcategories, eq(transactions.subcategoryId, subcategories.id))
        .orderBy(desc(transactions.date));

      return rows.map((row) => this.mapToEntityWithRelations(row));
    } catch (error) {
      throw new DatabaseError('Failed to fetch transactions', error);
    }
  }

  async findById(id: number): Promise<TransactionEntity | null> {
    try {
      const rows = await db.select().from(transactions).where(eq(transactions.id, id));
      return rows.length > 0 ? this.mapToEntity(rows[0]) : null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch transaction ${id}`, error);
    }
  }

  async findByMonth(year: number, month: number): Promise<TransactionEntity[]> {
    try {
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      const rows = await db
        .select()
        .from(transactions)
        .where(like(transactions.date, `${monthStr}%`))
        .orderBy(desc(transactions.date));
      return rows.map((row) => this.mapToEntity(row));
    } catch (error) {
      throw new DatabaseError(`Failed to fetch transactions for ${year}-${month}`, error);
    }
  }

  async findByCategory(categoryId: number): Promise<TransactionEntity[]> {
    try {
      const rows = await db
        .select()
        .from(transactions)
        .where(eq(transactions.categoryId, categoryId))
        .orderBy(desc(transactions.date));
      return rows.map((row) => this.mapToEntity(row));
    } catch (error) {
      throw new DatabaseError(`Failed to fetch transactions for category ${categoryId}`, error);
    }
  }

  async findByAccount(accountId: number): Promise<TransactionEntity[]> {
    try {
      const rows = await db
        .select()
        .from(transactions)
        .where(eq(transactions.accountId, accountId))
        .orderBy(desc(transactions.date));
      return rows.map((row) => this.mapToEntity(row));
    } catch (error) {
      throw new DatabaseError(`Failed to fetch transactions for account ${accountId}`, error);
    }
  }

  async findUncategorized(): Promise<TransactionEntity[]> {
    try {
      const rows = await db
        .select()
        .from(transactions)
        .where(isNull(transactions.categoryId))
        .orderBy(desc(transactions.date));
      return rows.map((row) => this.mapToEntity(row));
    } catch (error) {
      throw new DatabaseError('Failed to fetch uncategorized transactions', error);
    }
  }

  async create(data: {
    date: string;
    description: string;
    counterparty: string;
    amount: number;
    accountId: number | null;
    categoryId?: number | null;
    subcategoryId?: number | null;
    userContext?: string | null;
  }): Promise<TransactionEntity> {
    try {
      const normalized = normalizeCounterparty(data.counterparty);
      const result = await db
        .insert(transactions)
        .values({
          date: data.date,
          description: data.description,
          counterparty: data.counterparty,
          counterpartyNormalized: normalized,
          amount: data.amount,
          accountId: data.accountId,
          categoryId: data.categoryId ?? null,
          subcategoryId: data.subcategoryId ?? null,
          userContext: data.userContext ?? null,
        })
        .returning();

      return this.mapToEntity(result[0]);
    } catch (error) {
      throw new DatabaseError('Failed to create transaction', error);
    }
  }

  async updateCategory(
    id: number,
    categoryId: number,
    subcategoryId: number
  ): Promise<TransactionEntity> {
    try {
      const result = await db
        .update(transactions)
        .set({
          categoryId,
          subcategoryId,
          updatedAt: sql`(unixepoch())`,
        })
        .where(eq(transactions.id, id))
        .returning();

      if (result.length === 0) {
        throw new NotFoundError('Transaction', id);
      }

      return this.mapToEntity(result[0]);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Failed to update transaction ${id}`, error);
    }
  }

  async updateUserContext(id: number, userContext: string): Promise<TransactionEntity> {
    try {
      const result = await db
        .update(transactions)
        .set({
          userContext,
          updatedAt: sql`(unixepoch())`,
        })
        .where(eq(transactions.id, id))
        .returning();

      if (result.length === 0) {
        throw new NotFoundError('Transaction', id);
      }

      return this.mapToEntity(result[0]);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(`Failed to update transaction context ${id}`, error);
    }
  }

  async bulkUpdateCategories(
    updates: Array<{ id: number; categoryId: number; subcategoryId: number }>
  ): Promise<void> {
    try {
      await db.transaction(async (tx) => {
        for (const update of updates) {
          await tx
            .update(transactions)
            .set({
              categoryId: update.categoryId,
              subcategoryId: update.subcategoryId,
              updatedAt: sql`(unixepoch())`,
            })
            .where(eq(transactions.id, update.id));
        }
      });
    } catch (error) {
      throw new DatabaseError('Failed to bulk update transactions', error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await db.delete(transactions).where(eq(transactions.id, id));
    } catch (error) {
      throw new DatabaseError(`Failed to delete transaction ${id}`, error);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await db.delete(transactions);
    } catch (error) {
      throw new DatabaseError('Failed to delete all transactions', error);
    }
  }

  async count(): Promise<number> {
    try {
      const result = await db.select({ count: sql<number>`count(*)` }).from(transactions);
      return result[0].count;
    } catch (error) {
      throw new DatabaseError('Failed to count transactions', error);
    }
  }

  async findSimilarCategorized(
    counterparty: string,
    limit: number = 5,
    excludeMonth?: string
  ): Promise<TransactionEntity[]> {
    try {
      // Build conditions
      const conditions = [sql`${transactions.categoryId} IS NOT NULL`];

      if (excludeMonth) {
        conditions.push(sql`strftime('%Y-%m', ${transactions.date}) != ${excludeMonth}`);
      }

      // Exact or close matches
      const exactRows = await db
        .select()
        .from(transactions)
        .where(
          and(
            ...conditions,
            sql`(LOWER(${transactions.counterparty}) = LOWER(${counterparty}) OR LOWER(${transactions.counterparty}) LIKE LOWER(${'%' + counterparty + '%'}))`
          )
        )
        .orderBy(
          sql`CASE WHEN LOWER(${transactions.counterparty}) = LOWER(${counterparty}) THEN 0 ELSE 1 END`,
          sql`CASE WHEN ${transactions.userContext} IS NOT NULL AND ${transactions.userContext} != '' THEN 0 ELSE 1 END`,
          desc(transactions.updatedAt)
        )
        .limit(limit);

      return exactRows.map((row) => this.mapToEntity(row));
    } catch (error) {
      throw new DatabaseError('Failed to find similar transactions', error);
    }
  }
}
