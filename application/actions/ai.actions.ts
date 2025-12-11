'use server';

import { TransactionRepository } from '@/infrastructure/database/repositories/transaction.repository.impl';
import { CategoryRepository } from '@/infrastructure/database/repositories/category.repository.impl';
import { SuggestCategorizationUseCase } from '@/core/use-cases/ai/suggest-categorization.use-case';

// Initialize repositories
const transactionRepository = new TransactionRepository();
const categoryRepository = new CategoryRepository();

/**
 * Get AI categorization suggestion for a transaction
 */
export async function suggestCategorization(params: {
  counterparty: string;
  amount: number;
  description?: string;
  userContext?: string;
  skipCache?: boolean;
}) {
  try {
    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: 'OpenAI API key not configured',
      };
    }

    const useCase = new SuggestCategorizationUseCase(
      transactionRepository,
      categoryRepository,
      apiKey
    );

    const result = await useCase.execute({
      transaction: {
        counterparty: params.counterparty,
        amount: params.amount,
        description: params.description,
        userContext: params.userContext,
      },
      skipCache: params.skipCache || false,
    });

    return {
      success: true,
      suggestion: result.suggestion,
      source: result.source,
    };
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get suggestion',
    };
  }
}

/**
 * Get bulk AI suggestions for multiple transactions
 */
export async function bulkSuggestCategorization(params: {
  transactions: Array<{
    id: number;
    counterparty: string;
    amount: number;
    description?: string;
    userContext?: string;
  }>;
  skipCache?: boolean;
}) {
  try {
    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: 'OpenAI API key not configured',
        suggestions: [],
      };
    }

    const useCase = new SuggestCategorizationUseCase(
      transactionRepository,
      categoryRepository,
      apiKey
    );

    const suggestions = [];
    const errors = [];

    for (const transaction of params.transactions) {
      try {
        const result = await useCase.execute({
          transaction: {
            counterparty: transaction.counterparty,
            amount: transaction.amount,
            description: transaction.description,
            userContext: transaction.userContext,
          },
          skipCache: params.skipCache || false,
        });

        suggestions.push({
          id: transaction.id,
          suggestion: result.suggestion,
          source: result.source,
        });
      } catch (error) {
        errors.push({
          id: transaction.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      success: errors.length === 0,
      suggestions,
      errors,
    };
  } catch (error) {
    console.error('Error getting bulk AI suggestions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get suggestions',
      suggestions: [],
    };
  }
}
