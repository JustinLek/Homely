import { TransactionEntity } from '@/core/entities/transaction.entity';
import { TransactionRepository } from '@/core/repositories/transaction.repository';

export interface GetTransactionsInput {
  month?: string; // Format: YYYY-MM
  category?: string;
  limit?: number;
  offset?: number;
}

export interface GetTransactionsOutput {
  transactions: TransactionEntity[];
  total: number;
}

export class GetTransactionsUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(input: GetTransactionsInput = {}): Promise<GetTransactionsOutput> {
    const { month, category, limit, offset } = input;

    // Get all transactions
    const allTransactions = await this.transactionRepository.findAll();

    // Filter by month if specified
    let filtered = allTransactions;
    if (month) {
      filtered = filtered.filter((t) => t.date.startsWith(month));
    }

    // Filter by category if specified
    if (category) {
      filtered = filtered.filter((t) => t.category?.key === category);
    }

    // Apply pagination if specified
    const total = filtered.length;
    if (limit !== undefined) {
      const start = offset || 0;
      filtered = filtered.slice(start, start + limit);
    }

    return {
      transactions: filtered,
      total,
    };
  }
}
