'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES, MONTHS } from '@/core/constants';
import { BulkAISuggestion } from '@/presentation/components/features/ai/bulk-ai-suggestion';
import { ReAnalyzeMonth } from '@/presentation/components/features/ai/re-analyze-month';
import { TransactionItem } from '@/presentation/components/features/transactions/transaction-item';
import { MonthInsights } from '@/presentation/components/features/insights/month-insights';
import {
  updateTransaction as updateTransactionAction,
  bulkUpdateTransactions,
} from '@/application/actions/transaction.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';

// Type for transaction data from Server Action
type TransactionData = {
  id: number;
  date: string;
  description: string;
  counterparty: string;
  amount: number;
  account: string;
  category: string;
  subcategory: string;
  user_context: string | null;
};

interface MonthDetailViewProps {
  monthKey: string;
  initialTransactions: TransactionData[];
}

export function MonthDetailView({ monthKey, initialTransactions }: MonthDetailViewProps) {
  const [transactions, setTransactions] = useState<TransactionData[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'review'>('overview');
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({});

  const updateTransaction = async (
    transaction: any,
    newCategory: string,
    newSubcategory: string
  ) => {
    try {
      const result = await updateTransactionAction({
        id: transaction.id,
        categoryKey: newCategory,
        subcategoryName: newSubcategory,
      });

      if (result.success) {
        const updatedTransactions = transactions.map((t: any) => {
          if (t.id === transaction.id) {
            return { ...t, category: newCategory, subcategory: newSubcategory };
          }
          return t;
        });
        setTransactions(updatedTransactions);
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const toggleSubcategory = (categoryKey: string, subcategoryName: string) => {
    const key = `${categoryKey}-${subcategoryName}`;
    setExpandedSubcategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const applyBulkSuggestions = async (
    suggestions: Array<{ transaction: any; category: string; subcategory: string }>
  ) => {
    try {
      const updates = suggestions.map(({ transaction, category, subcategory }) => ({
        id: transaction.id,
        categoryKey: category,
        subcategoryName: subcategory,
      }));

      const result = await bulkUpdateTransactions({ updates });

      if (result.success) {
        // Update local state with new categories
        const updatedTransactions = transactions.map((t) => {
          const update = suggestions.find((s) => s.transaction.id === t.id);
          if (update) {
            return { ...t, category: update.category, subcategory: update.subcategory };
          }
          return t;
        });
        setTransactions(updatedTransactions);
      }
    } catch (error) {
      console.error('Error applying bulk suggestions:', error);
    }
  };

  // Filter transactions for this month
  const monthTransactions = transactions.filter((t) => t.date.startsWith(monthKey));

  // Parse month for display
  const [year, month] = monthKey.split('-');
  const monthName = MONTHS[parseInt(month) - 1];

  // Group transactions by category and subcategory
  const groupedTransactions: Record<string, Record<string, TransactionData[]>> = {};
  monthTransactions.forEach((t) => {
    const category = t.category || 'te_beoordelen';
    const subcategory = t.subcategory || 'Onbekend';

    if (!groupedTransactions[category]) {
      groupedTransactions[category] = {};
    }
    if (!groupedTransactions[category][subcategory]) {
      groupedTransactions[category][subcategory] = [];
    }
    groupedTransactions[category][subcategory].push(t);
  });

  // Calculate totals
  const totalIncome = monthTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = Math.abs(
    monthTransactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
  );

  const balance = totalIncome - totalExpense;

  // Get uncategorized transactions
  const uncategorizedTransactions = monthTransactions.filter((t) => t.category === 'te_beoordelen');

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar overzicht
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                {monthName} {year}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-2">Inkomsten</p>
                  <p className="text-2xl font-bold text-green-600">€{totalIncome.toFixed(2)}</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-2">Uitgaven</p>
                  <p className="text-2xl font-bold text-red-600">€{totalExpense.toFixed(2)}</p>
                </div>
                <div
                  className={`text-center p-4 rounded-lg ${balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}
                >
                  <p className="text-sm font-medium text-slate-900 mb-2">Saldo</p>
                  <p
                    className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}
                  >
                    €{balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overzicht</TabsTrigger>
            <TabsTrigger value="insights">Inzichten</TabsTrigger>
            <TabsTrigger value="review">
              Te Beoordelen
              {uncategorizedTransactions.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {uncategorizedTransactions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {Object.entries(groupedTransactions)
                .filter(([category]) => category !== 'te_beoordelen')
                .map(([categoryKey, subcategories]) => {
                  const categoryInfo = CATEGORIES[categoryKey];
                  const categoryTotal = Object.values(subcategories)
                    .flat()
                    .reduce((sum, t) => sum + t.amount, 0);

                  return (
                    <Card key={categoryKey}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="flex items-center gap-2">
                            <span>{categoryInfo?.icon || '📁'}</span>
                            <span>{categoryInfo?.name || categoryKey}</span>
                          </CardTitle>
                          <Badge variant={categoryTotal < 0 ? 'destructive' : 'default'}>
                            €{Math.abs(categoryTotal).toFixed(2)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(subcategories).map(([subcategoryName, txs]) => {
                            const subcategoryTotal = txs.reduce((sum, t) => sum + t.amount, 0);
                            const isExpanded =
                              expandedSubcategories[`${categoryKey}-${subcategoryName}`];

                            return (
                              <div key={subcategoryName} className="border rounded-lg p-4">
                                <button
                                  onClick={() => toggleSubcategory(categoryKey, subcategoryName)}
                                  className="w-full flex justify-between items-center text-left"
                                >
                                  <div className="flex items-center gap-2">
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                    <span className="font-medium">{subcategoryName}</span>
                                    <Badge variant="outline">{txs.length} transacties</Badge>
                                  </div>
                                  <span
                                    className={`font-semibold ${subcategoryTotal < 0 ? 'text-red-600' : 'text-green-600'}`}
                                  >
                                    €{Math.abs(subcategoryTotal).toFixed(2)}
                                  </span>
                                </button>

                                {isExpanded && (
                                  <div className="mt-4 space-y-2">
                                    {txs.map((transaction) => (
                                      <TransactionItem
                                        key={transaction.id}
                                        transaction={transaction}
                                        onUpdate={updateTransaction}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <MonthInsights monthKey={monthKey} />
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle>Te Beoordelen Transacties</CardTitle>
              </CardHeader>
              <CardContent>
                {uncategorizedTransactions.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">
                    Alle transacties zijn gecategoriseerd! 🎉
                  </p>
                ) : (
                  <>
                    <div className="mb-6 flex gap-4">
                      <BulkAISuggestion
                        transactions={uncategorizedTransactions}
                        onApply={applyBulkSuggestions}
                      />
                      <ReAnalyzeMonth
                        monthKey={monthKey}
                        onComplete={() => window.location.reload()}
                      />
                    </div>

                    <div className="space-y-2">
                      {uncategorizedTransactions.map((transaction) => (
                        <TransactionItem
                          key={transaction.id}
                          transaction={transaction}
                          onUpdate={updateTransaction}
                        />
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
