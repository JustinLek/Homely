'use client';

import { useState } from 'react';
import { Transaction } from '@/presentation/types';
import { CATEGORIES } from '@/core/constants';
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TransactionItem } from '../transactions/transaction-item';
import { cn } from '@/core/lib/utils';

interface CategoryCardProps {
  categoryKey: string;
  transactions: Transaction[];
  onUpdateTransaction: (
    transaction: Transaction,
    newCategory: string,
    newSubcategory: string
  ) => void;
  showSubcategoryTotals?: boolean;
}

export function CategoryCard({
  categoryKey,
  transactions,
  onUpdateTransaction,
  showSubcategoryTotals = false,
}: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(categoryKey === 'te_beoordelen');
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({});

  const category = CATEGORIES[categoryKey];
  const categoryName = category?.name || categoryKey;
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  const toggleSubcategory = (subcategory: string) => {
    setExpandedSubcategories((prev) => ({
      ...prev,
      [subcategory]: !prev[subcategory],
    }));
  };

  // Determine header color
  const getHeaderClass = () => {
    if (categoryKey === 'te_beoordelen') return 'bg-orange-500 hover:bg-orange-600';
    if (categoryKey === 'inkomsten') return 'bg-green-600 hover:bg-green-700';
    if (categoryKey === 'interne_transacties') return 'bg-gray-500 hover:bg-gray-600';
    return 'bg-gray-700 hover:bg-gray-800';
  };

  // Group by subcategory
  const subcategoryGroups: Record<string, Transaction[]> = {};
  transactions.forEach((t) => {
    const subcat = t.subcategory || 'Onbekend';
    if (!subcategoryGroups[subcat]) {
      subcategoryGroups[subcat] = [];
    }
    subcategoryGroups[subcat].push(t);
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <CardHeader className="p-0">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          className={cn(
            'w-full h-auto p-4 rounded-none justify-between text-white',
            getHeaderClass()
          )}
        >
          <span className="font-bold text-lg">{categoryName}</span>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">
              €{' '}
              {total.toLocaleString('nl-NL', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <ChevronDown
              className={cn('h-5 w-5 transition-transform', isExpanded && 'rotate-180')}
            />
          </div>
        </Button>
      </CardHeader>

      {/* Transaction List */}
      {isExpanded && (
        <CardContent className="p-0 max-h-96 overflow-y-auto">
          {sortedTransactions.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground italic">Geen transacties</div>
          ) : showSubcategoryTotals ? (
            // Show grouped by subcategory with totals
            <div>
              {Object.entries(subcategoryGroups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([subcategory, subTransactions]) => {
                  const subcategoryTotal = subTransactions.reduce((sum, t) => sum + t.amount, 0);
                  const isSubExpanded = expandedSubcategories[subcategory] || false;

                  return (
                    <div key={subcategory} className="border-b last:border-b-0">
                      <Button
                        onClick={() => toggleSubcategory(subcategory)}
                        variant="ghost"
                        className="w-full h-auto p-4 justify-between rounded-none"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 transition-transform',
                              isSubExpanded && 'rotate-90'
                            )}
                          />
                          <div className="text-left">
                            <div className="font-medium text-foreground">{subcategory}</div>
                            <div className="text-sm text-muted-foreground">
                              {subTransactions.length} transacties
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            'text-lg font-bold',
                            subcategoryTotal >= 0 ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          €{' '}
                          {Math.abs(subcategoryTotal).toLocaleString('nl-NL', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </Button>
                      {isSubExpanded && (
                        <div className="bg-muted/50">
                          {subTransactions
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((transaction, index) => (
                              <TransactionItem
                                key={`${transaction.date}-${transaction.amount}-${index}`}
                                transaction={transaction}
                                onUpdateTransaction={onUpdateTransaction}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            // Show all transactions
            sortedTransactions.map((transaction, index) => (
              <TransactionItem
                key={`${transaction.date}-${transaction.amount}-${index}`}
                transaction={transaction}
                onUpdateTransaction={onUpdateTransaction}
              />
            ))
          )}
        </CardContent>
      )}
    </Card>
  );
}
