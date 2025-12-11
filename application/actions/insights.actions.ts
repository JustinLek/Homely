'use server';

import { TransactionRepository } from '@/infrastructure/database/repositories/transaction.repository.impl';
import { GetMonthlyInsightsUseCase } from '@/core/use-cases/insights/get-monthly-insights.use-case';

// Initialize repository
const transactionRepository = new TransactionRepository();

/**
 * Get monthly insights for a specific month
 */
export async function getMonthlyInsights(params: {
  month: string; // Format: YYYY-MM
  topCategoriesLimit?: number;
  outlierThreshold?: number;
}) {
  try {
    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(params.month)) {
      return {
        success: false,
        error: 'Invalid month format. Use YYYY-MM',
      };
    }

    const useCase = new GetMonthlyInsightsUseCase(transactionRepository);
    const result = await useCase.execute({
      month: params.month,
      topCategoriesLimit: params.topCategoriesLimit || 5,
      outlierThreshold: params.outlierThreshold || 2.0,
    });

    return {
      success: true,
      month: params.month,
      insights: {
        comparison: result.comparison,
        topCategories: result.topCategories,
        outliers: result.outliers.map((o) => ({
          transaction: {
            id: o.transaction.id,
            counterparty: o.transaction.counterparty,
            amount: o.transaction.amount,
            date: o.transaction.date,
            category: o.transaction.category?.key || 'te_beoordelen',
          },
          categoryAverage: o.categoryAverage,
          deviationPercentage: o.deviationPercentage,
          reason: o.reason,
        })),
      },
    };
  } catch (error) {
    console.error('Error getting monthly insights:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get insights',
    };
  }
}
