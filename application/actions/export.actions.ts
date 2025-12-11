'use server';

export interface ExportTransaction {
  date: string;
  description: string;
  counterparty: string;
  amount: number;
  account: string;
  category: string;
  subcategory: string;
}

/**
 * Export transactions grouped by category
 */
export async function exportTransactions(transactions: ExportTransaction[]) {
  try {
    // Group transactions by category
    const categorized: Record<string, ExportTransaction[]> = {};

    transactions.forEach((t) => {
      const category = t.category || 'te_beoordelen';
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push({
        date: t.date,
        description: t.description,
        counterparty: t.counterparty,
        amount: t.amount,
        account: t.account,
        category: t.category,
        subcategory: t.subcategory,
      });
    });

    return {
      success: true,
      data: categorized,
    };
  } catch (error) {
    console.error('Export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export data',
    };
  }
}
