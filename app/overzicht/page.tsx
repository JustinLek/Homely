import { CATEGORIES } from '@/core/constants';
import Link from 'next/link';
import { getTransactions } from '@/application/actions/transaction.actions';

export default async function OverzichtPage() {
  // Fetch data directly in Server Component
  const result = await getTransactions();
  const transactions = result.success ? result.transactions : [];

  // Calculate statistics per month (category and subcategory)
  // Use 'total' instead of separate income/expense to properly handle returns
  const categoryMonthData: Record<string, Record<string, { total: number; count: number }>> = {};
  const subcategoryMonthData: Record<
    string,
    Record<string, Record<string, { total: number; count: number }>>
  > = {};
  const months = new Set<string>();

  transactions.forEach((t) => {
    const category = t.category || 'te_beoordelen';
    const subcategory = t.subcategory || 'Onbekend';
    const month = t.date.substring(0, 7); // "2024-06"

    months.add(month);

    // Category data
    if (!categoryMonthData[category]) {
      categoryMonthData[category] = {};
    }
    if (!categoryMonthData[category][month]) {
      categoryMonthData[category][month] = { total: 0, count: 0 };
    }

    categoryMonthData[category][month].count += 1;
    categoryMonthData[category][month].total += t.amount; // Add all amounts (negative expenses, positive returns)

    // Subcategory data
    if (!subcategoryMonthData[category]) {
      subcategoryMonthData[category] = {};
    }
    if (!subcategoryMonthData[category][subcategory]) {
      subcategoryMonthData[category][subcategory] = {};
    }
    if (!subcategoryMonthData[category][subcategory][month]) {
      subcategoryMonthData[category][subcategory][month] = { total: 0, count: 0 };
    }

    subcategoryMonthData[category][subcategory][month].count += 1;
    subcategoryMonthData[category][subcategory][month].total += t.amount; // Add all amounts
  });

  const monthCount = months.size;

  // Calculate totals and averages per category
  const categoryStats: Record<
    string,
    {
      total: number;
      average: number;
      count: number;
      monthsPresent: number;
      subcategories: Record<
        string,
        {
          total: number;
          average: number;
          count: number;
          monthsPresent: number;
        }
      >;
    }
  > = {};

  Object.entries(categoryMonthData).forEach(([category, monthData]) => {
    let total = 0;
    let count = 0;
    const monthsPresent = Object.keys(monthData).length;

    Object.values(monthData).forEach((data) => {
      total += data.total; // This includes returns (positive amounts subtract from expenses)
      count += data.count;
    });

    // Calculate subcategory stats
    // Use category's monthsPresent as divider so subcategory averages sum to category average
    const subcategories: Record<string, any> = {};
    if (subcategoryMonthData[category]) {
      Object.entries(subcategoryMonthData[category]).forEach(([subcategory, subMonthData]) => {
        let subTotal = 0;
        let subCount = 0;
        const subMonthsPresent = Object.keys(subMonthData).length;

        Object.values(subMonthData).forEach((data) => {
          subTotal += data.total; // This includes returns
          subCount += data.count;
        });

        subcategories[subcategory] = {
          total: subTotal,
          // Divide by category's monthsPresent, not subcategory's
          // This ensures subcategory averages sum to category average
          average: subTotal / monthsPresent,
          count: subCount,
          monthsPresent: subMonthsPresent,
        };
      });
    }

    categoryStats[category] = {
      total,
      average: total / monthsPresent,
      count,
      monthsPresent,
      subcategories,
    };
  });

  // Separate income and expense categories
  const totalIncome = Object.entries(categoryStats)
    .filter(([key]) => key === 'inkomsten')
    .reduce((sum, [, cat]) => sum + cat.total, 0);

  const totalExpense = Object.entries(categoryStats)
    .filter(
      ([key]) => key !== 'inkomsten' && key !== 'interne_transacties' && key !== 'te_beoordelen'
    )
    .reduce((sum, [, cat]) => sum + cat.total, 0);

  const balance = totalIncome + totalExpense;

  const avgIncome = totalIncome / monthCount;
  const avgExpense = totalExpense / monthCount;
  const avgBalance = balance / monthCount;

  // Sort categories by average (most negative first = highest expenses)
  const sortedCategories = Object.entries(categoryStats)
    .filter(
      ([key]) => key !== 'interne_transacties' && key !== 'inkomsten' && key !== 'te_beoordelen'
    )
    .sort(([, a], [, b]) => a.average - b.average);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900">📊 Gemiddelden per Categorie</h1>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ← Terug naar maandoverzicht
            </Link>
          </div>
          <p className="text-gray-600 text-lg">Gebaseerd op {monthCount} maanden data</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-2">Gemiddelde Inkomsten per Maand</div>
            <div className="text-3xl font-bold text-green-600">
              €{' '}
              {avgIncome.toLocaleString('nl-NL', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Totaal: € {totalIncome.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-2">Gemiddelde Uitgaven per Maand</div>
            <div className="text-3xl font-bold text-red-600">
              €{' '}
              {Math.abs(avgExpense).toLocaleString('nl-NL', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Totaal: €{' '}
              {Math.abs(totalExpense).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-2">Gemiddeld Saldo per Maand</div>
            <div
              className={`text-3xl font-bold ${avgBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}
            >
              €{' '}
              {avgBalance.toLocaleString('nl-NL', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Totaal: € {balance.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
            <h2 className="text-2xl font-bold">Gemiddelde Uitgaven per Categorie</h2>
            <p className="text-purple-100 text-sm mt-1">Per maand gemiddeld</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {sortedCategories.map(([categoryKey, stats]) => {
                const category = CATEGORIES[categoryKey];
                const percentage = (Math.abs(stats.average) / Math.abs(avgExpense)) * 100;

                // Sort subcategories by average (most negative first)
                const sortedSubcategories = Object.entries(stats.subcategories).sort(
                  ([, a], [, b]) => a.average - b.average
                );

                return (
                  <div key={categoryKey} className="border-b border-gray-200 pb-6 last:border-b-0">
                    {/* Category Header */}
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="font-bold text-lg text-gray-900">
                          {category?.name || categoryKey}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stats.count} transacties • {stats.monthsPresent} van {monthCount} maanden
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-red-600">
                          €{' '}
                          {Math.abs(stats.average).toLocaleString('nl-NL', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {percentage.toFixed(1)}% • Totaal: €
                          {Math.abs(stats.total).toLocaleString('nl-NL', {
                            minimumFractionDigits: 0,
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Category Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className="bg-purple-600 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    {/* Subcategories */}
                    {sortedSubcategories.length > 0 && (
                      <div className="ml-6 space-y-2 mt-3">
                        {sortedSubcategories.map(([subcategoryName, subStats]) => {
                          const subPercentage =
                            (Math.abs(subStats.average) / Math.abs(stats.average)) * 100;

                          return (
                            <div
                              key={subcategoryName}
                              className="flex justify-between items-center py-2 border-l-2 border-purple-300 pl-4"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">{subcategoryName}</div>
                                <div className="text-xs text-gray-500">
                                  {subStats.count} transacties • {subStats.monthsPresent} maanden
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="font-bold text-red-600">
                                  €{' '}
                                  {Math.abs(subStats.average).toLocaleString('nl-NL', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {subPercentage.toFixed(1)}% van categorie
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
