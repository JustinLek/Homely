/**
 * Transaction Entity - Domain model for financial transactions
 */
export class TransactionEntity {
  constructor(
    public readonly id: number,
    public readonly date: string,
    public readonly description: string,
    public readonly counterparty: string,
    public readonly counterpartyNormalized: string,
    public readonly amount: number,
    public readonly accountId: number | null,
    public readonly categoryId: number | null,
    public readonly subcategoryId: number | null,
    public readonly userContext: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    // Optional related entities (populated by repository when needed)
    public readonly account?: { id: number; name: string; color: string } | null,
    public readonly category?: {
      id: number;
      key: string;
      name: string;
      icon: string;
      color: string;
    } | null,
    public readonly subcategory?: { id: number; name: string } | null
  ) {}

  /**
   * Check if transaction is income
   */
  isIncome(): boolean {
    return this.amount > 0;
  }

  /**
   * Check if transaction is expense
   */
  isExpense(): boolean {
    return this.amount < 0;
  }

  /**
   * Get absolute amount
   */
  getAbsoluteAmount(): number {
    return Math.abs(this.amount);
  }

  /**
   * Check if transaction is categorized
   */
  isCategorized(): boolean {
    return this.categoryId !== null && this.subcategoryId !== null;
  }

  /**
   * Get month key (YYYY-MM)
   */
  getMonthKey(): string {
    const date = new Date(this.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  /**
   * Check if transaction has user context
   */
  hasUserContext(): boolean {
    return this.userContext !== null && this.userContext.trim().length > 0;
  }
}
