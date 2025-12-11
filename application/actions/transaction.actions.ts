'use server';

import { revalidatePath } from 'next/cache';
import { TransactionRepository } from '@/infrastructure/database/repositories/transaction.repository.impl';
import {
  CategoryRepository,
  SubcategoryRepository,
} from '@/infrastructure/database/repositories/category.repository.impl';
import { GetTransactionsUseCase } from '@/core/use-cases/transactions/get-transactions.use-case';
import { UpdateTransactionUseCase } from '@/core/use-cases/transactions/update-transaction.use-case';
import { UpdateTransactionContextUseCase } from '@/core/use-cases/transactions/update-transaction-context.use-case';
import { BulkUpdateTransactionsUseCase } from '@/core/use-cases/transactions/bulk-update-transactions.use-case';

// Initialize repositories
const transactionRepository = new TransactionRepository();
const categoryRepository = new CategoryRepository();
const subcategoryRepository = new SubcategoryRepository();

/**
 * Get all transactions with optional filtering
 */
export async function getTransactions(params?: {
  month?: string;
  category?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const useCase = new GetTransactionsUseCase(transactionRepository);
    const result = await useCase.execute(params || {});

    return {
      success: true,
      transactions: result.transactions.map((t) => ({
        id: t.id,
        date: t.date,
        description: t.description,
        counterparty: t.counterparty,
        amount: t.amount,
        account: t.account?.name || 'Onbekend',
        category: t.category?.key || 'te_beoordelen',
        subcategory: t.subcategory?.name || 'Onbekend',
        user_context: t.userContext,
      })),
      total: result.total,
    };
  } catch (error) {
    console.error('Error getting transactions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transactions',
      transactions: [],
      total: 0,
    };
  }
}

/**
 * Update a single transaction's category and subcategory
 */
export async function updateTransaction(params: {
  id: number;
  categoryKey: string;
  subcategoryName: string;
}) {
  try {
    const useCase = new UpdateTransactionUseCase(
      transactionRepository,
      categoryRepository,
      subcategoryRepository
    );

    const result = await useCase.execute({
      id: params.id,
      categoryKey: params.categoryKey,
      subcategoryName: params.subcategoryName,
    });

    // Revalidate all pages that might show this transaction
    revalidatePath('/');
    revalidatePath('/overzicht');
    revalidatePath('/maand/[month]', 'page');

    return {
      success: true,
      transaction: {
        id: result.transaction.id,
        date: result.transaction.date,
        description: result.transaction.description,
        counterparty: result.transaction.counterparty,
        amount: result.transaction.amount,
        account: result.transaction.account?.name || 'Onbekend',
        category: result.transaction.category?.key || 'te_beoordelen',
        subcategory: result.transaction.subcategory?.name || 'Onbekend',
        user_context: result.transaction.userContext,
      },
    };
  } catch (error) {
    console.error('Error updating transaction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update transaction',
    };
  }
}

/**
 * Update a transaction's user context
 */
export async function updateTransactionContext(params: { id: number; context: string }) {
  try {
    const useCase = new UpdateTransactionContextUseCase(transactionRepository);

    const result = await useCase.execute({
      id: params.id,
      userContext: params.context,
    });

    // Revalidate pages
    revalidatePath('/maand/[month]', 'page');

    return {
      success: true,
      transaction: {
        id: result.transaction.id,
        user_context: result.transaction.userContext,
      },
    };
  } catch (error) {
    console.error('Error updating transaction context:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update context',
    };
  }
}

/**
 * Bulk update multiple transactions
 */
export async function bulkUpdateTransactions(params: {
  updates: Array<{
    id: number;
    categoryKey: string;
    subcategoryName: string;
  }>;
}) {
  try {
    const useCase = new BulkUpdateTransactionsUseCase(
      transactionRepository,
      categoryRepository,
      subcategoryRepository
    );

    const result = await useCase.execute({
      updates: params.updates.map((u) => ({
        id: u.id,
        categoryKey: u.categoryKey,
        subcategoryName: u.subcategoryName,
      })),
    });

    // Revalidate all pages
    revalidatePath('/');
    revalidatePath('/overzicht');
    revalidatePath('/maand/[month]', 'page');

    return {
      success: result.success,
      updatedCount: result.updatedCount,
      errors: result.errors,
    };
  } catch (error) {
    console.error('Error bulk updating transactions:', error);
    return {
      success: false,
      updatedCount: 0,
      errors: [{ id: 0, error: error instanceof Error ? error.message : 'Unknown error' }],
    };
  }
}
