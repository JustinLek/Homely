import { TransactionEntity } from '../entities/transaction.entity';

/**
 * Transaction Repository Interface
 * Defines contract for transaction data access
 */
export interface ITransactionRepository {
  /**
   * Get all transactions
   */
  findAll(): Promise<TransactionEntity[]>;

  /**
   * Get transaction by ID
   */
  findById(id: number): Promise<TransactionEntity | null>;

  /**
   * Get transactions by month
   */
  findByMonth(year: number, month: number): Promise<TransactionEntity[]>;

  /**
   * Get transactions by category
   */
  findByCategory(categoryId: number): Promise<TransactionEntity[]>;

  /**
   * Get transactions by account
   */
  findByAccount(accountId: number): Promise<TransactionEntity[]>;

  /**
   * Get uncategorized transactions
   */
  findUncategorized(): Promise<TransactionEntity[]>;

  /**
   * Create new transaction
   */
  create(data: {
    date: string;
    description: string;
    counterparty: string;
    amount: number;
    accountId: number | null;
    categoryId?: number | null;
    subcategoryId?: number | null;
    userContext?: string | null;
  }): Promise<TransactionEntity>;

  /**
   * Update transaction category
   */
  updateCategory(id: number, categoryId: number, subcategoryId: number): Promise<TransactionEntity>;

  /**
   * Update transaction user context
   */
  updateUserContext(id: number, userContext: string): Promise<TransactionEntity>;

  /**
   * Bulk update transactions
   */
  bulkUpdateCategories(
    updates: Array<{ id: number; categoryId: number; subcategoryId: number }>
  ): Promise<void>;

  /**
   * Delete transaction
   */
  delete(id: number): Promise<void>;

  /**
   * Delete all transactions
   */
  deleteAll(): Promise<void>;

  /**
   * Get transaction count
   */
  count(): Promise<number>;

  /**
   * Find similar categorized transactions
   */
  findSimilarCategorized(
    counterparty: string,
    limit?: number,
    excludeMonth?: string
  ): Promise<TransactionEntity[]>;
}
