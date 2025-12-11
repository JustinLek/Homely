import { TransactionRepository } from '@/core/repositories/transaction.repository';
import { TransactionEntity } from '@/core/entities/transaction.entity';

export interface MonthComparison {
  currentMonth: string;
  currentTotal: number;
  previousMonth: string | null;
  previousTotal: number | null;
  difference: number | null;
  percentageChange: number | null;
  averageTotal: number;
  differenceFromAverage: number;
  percentageFromAverage: number;
}

export interface CategoryInsight {
  category: string;
  categoryName: string;
  total: number;
  count: number;
  percentage: number;
}

export interface Outlier {
  transaction: TransactionEntity;
  categoryAverage: number;
  deviationPercentage: number;
  reason: string;
}

export interface GetMonthlyInsightsInput {
  month: string; // Format: YYYY-MM
  topCategoriesLimit?: number;
  outlierThreshold?: number; // Standard deviations
}

export interface GetMonthlyInsightsOutput {
  comparison: MonthComparison;
  topCategories: CategoryInsight[];
  outliers: Outlier[];
}

export class GetMonthlyInsightsUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(input: GetMonthlyInsightsInput): Promise<GetMonthlyInsightsOutput> {
    const { month, topCategoriesLimit = 5, outlierThreshold = 2.0 } = input;

    const allTransactions = await this.transactionRepository.findAll();

    // Filter valid transactions (exclude uncategorized and internal)
    const validTransactions = allTransactions.filter(
      (t) =>
        t.category?.key !== 'te_beoordelen' &&
        t.category?.key !== 'interne_transacties' &&
        t.category?.key !== 'inkomsten'
    );

    // Calculate month comparison
    const comparison = this.calculateMonthComparison(validTransactions, month);

    // Calculate top categories
    const topCategories = this.calculateTopCategories(validTransactions, month, topCategoriesLimit);

    // Detect outliers
    const outliers = this.detectOutliers(validTransactions, month, outlierThreshold);

    return {
      comparison,
      topCategories,
      outliers,
    };
  }

  private calculateMonthComparison(
    transactions: TransactionEntity[],
    targetMonth: string
  ): MonthComparison {
    // Group by month
    const byMonth = new Map<string, number>();
    transactions.forEach((t) => {
      const month = t.date.substring(0, 7);
      const current = byMonth.get(month) || 0;
      byMonth.set(month, current + Math.abs(t.amount));
    });

    const currentTotal = byMonth.get(targetMonth) || 0;

    // Get previous month
    const sortedMonths = Array.from(byMonth.keys()).sort();
    const currentIndex = sortedMonths.indexOf(targetMonth);
    const previousMonth = currentIndex > 0 ? sortedMonths[currentIndex - 1] : null;
    const previousTotal = previousMonth ? byMonth.get(previousMonth) || 0 : null;

    // Calculate average (excluding current month)
    const otherMonths = Array.from(byMonth.entries()).filter(([m]) => m !== targetMonth);
    const averageTotal =
      otherMonths.length > 0
        ? otherMonths.reduce((sum, [, total]) => sum + total, 0) / otherMonths.length
        : 0;

    const difference = previousTotal !== null ? currentTotal - previousTotal : null;
    const percentageChange =
      previousTotal !== null && previousTotal !== 0
        ? ((currentTotal - previousTotal) / previousTotal) * 100
        : null;

    const differenceFromAverage = currentTotal - averageTotal;
    const percentageFromAverage =
      averageTotal !== 0 ? (differenceFromAverage / averageTotal) * 100 : 0;

    return {
      currentMonth: targetMonth,
      currentTotal,
      previousMonth,
      previousTotal,
      difference,
      percentageChange,
      averageTotal,
      differenceFromAverage,
      percentageFromAverage,
    };
  }

  private calculateTopCategories(
    transactions: TransactionEntity[],
    month: string,
    limit: number
  ): CategoryInsight[] {
    // Filter transactions for this month
    const monthTransactions = transactions.filter((t) => t.date.startsWith(month));

    // Group by category
    const byCategory = new Map<string, { total: number; count: number; name: string }>();

    monthTransactions.forEach((t) => {
      if (!t.category) return;

      const key = t.category.key;
      const current = byCategory.get(key) || { total: 0, count: 0, name: t.category.name };
      byCategory.set(key, {
        total: current.total + Math.abs(t.amount),
        count: current.count + 1,
        name: current.name,
      });
    });

    // Calculate total for percentages
    const totalSpending = Array.from(byCategory.values()).reduce((sum, cat) => sum + cat.total, 0);

    // Convert to array and sort by total
    const categories = Array.from(byCategory.entries())
      .map(([key, data]) => ({
        category: key,
        categoryName: data.name,
        total: data.total,
        count: data.count,
        percentage: totalSpending > 0 ? (data.total / totalSpending) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);

    return categories;
  }

  private detectOutliers(
    transactions: TransactionEntity[],
    month: string,
    threshold: number
  ): Outlier[] {
    // Filter transactions for this month
    const monthTransactions = transactions.filter((t) => t.date.startsWith(month));

    // Group by category to calculate averages
    const byCategory = new Map<string, number[]>();
    transactions.forEach((t) => {
      if (!t.category) return;

      const key = t.category.key;
      const amounts = byCategory.get(key) || [];
      amounts.push(Math.abs(t.amount));
      byCategory.set(key, amounts);
    });

    // Calculate category statistics
    const categoryStats = new Map<string, { mean: number; stdDev: number }>();
    byCategory.forEach((amounts, category) => {
      const mean = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
      const variance = amounts.reduce((sum, a) => sum + Math.pow(a - mean, 2), 0) / amounts.length;
      const stdDev = Math.sqrt(variance);
      categoryStats.set(category, { mean, stdDev });
    });

    // Find outliers in current month
    const outliers: Outlier[] = [];
    monthTransactions.forEach((t) => {
      if (!t.category) return;

      const stats = categoryStats.get(t.category.key);
      if (!stats || stats.stdDev === 0) return;

      const amount = Math.abs(t.amount);
      const deviation = (amount - stats.mean) / stats.stdDev;

      if (Math.abs(deviation) >= threshold) {
        outliers.push({
          transaction: t,
          categoryAverage: stats.mean,
          deviationPercentage: ((amount - stats.mean) / stats.mean) * 100,
          reason:
            deviation > 0
              ? `${Math.round(Math.abs(deviation))}x hoger dan gemiddeld voor ${t.category.name}`
              : `${Math.round(Math.abs(deviation))}x lager dan gemiddeld voor ${t.category.name}`,
        });
      }
    });

    // Sort by deviation percentage (highest first)
    return outliers.sort(
      (a, b) => Math.abs(b.deviationPercentage) - Math.abs(a.deviationPercentage)
    );
  }
}
