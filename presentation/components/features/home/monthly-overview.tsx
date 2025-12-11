'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MONTHS } from '@/core/constants';
import { exportTransactions } from '@/application/actions/export.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Download, TrendingDown, TrendingUp, Calendar } from 'lucide-react';

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

interface MonthlyOverviewProps {
  transactions: TransactionData[];
}

export function MonthlyOverview({ transactions }: MonthlyOverviewProps) {
  const [exporting, setExporting] = useState(false);

  const groupByMonth = (transactions: TransactionData[]) => {
    const grouped: Record<string, Record<string, TransactionData[]>> = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const category = t.category || 'te_beoordelen';

      if (!grouped[monthKey]) {
        grouped[monthKey] = {};
      }
      if (!grouped[monthKey][category]) {
        grouped[monthKey][category] = [];
      }
      grouped[monthKey][category].push(t);
    });

    return grouped;
  };

  const exportData = async () => {
    setExporting(true);
    try {
      const result = await exportTransactions(transactions);

      if (result.success && result.data) {
        Object.entries(result.data).forEach(([category, data]) => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${category}.json`;
          a.click();
          URL.revokeObjectURL(url);
        });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setExporting(false);
    }
  };

  const monthlyData = groupByMonth(transactions);
  const sortedMonths = Object.keys(monthlyData).sort().reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Gezinsuitgaven</h1>
            <p className="text-slate-600">Overzicht van alle transacties per maand</p>
          </div>
          <Button onClick={exportData} disabled={exporting} variant="outline" size="lg">
            <Download className="mr-2 h-5 w-5" />
            {exporting ? 'Exporteren...' : 'Exporteer Data'}
          </Button>
        </div>

        {/* Monthly Cards */}
        <div className="grid gap-6">
          {sortedMonths.map((monthKey) => {
            const [year, month] = monthKey.split('-');
            const monthName = MONTHS[parseInt(month) - 1];
            const categories = monthlyData[monthKey];

            const totalIncome = Object.values(categories)
              .flat()
              .filter((t) => t.amount > 0)
              .reduce((sum, t) => sum + t.amount, 0);

            const totalExpense = Math.abs(
              Object.values(categories)
                .flat()
                .filter((t) => t.amount < 0)
                .reduce((sum, t) => sum + t.amount, 0)
            );

            const balance = totalIncome - totalExpense;

            return (
              <Card key={monthKey} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-6 w-6 text-slate-600" />
                      <CardTitle className="text-2xl">
                        {monthName} {year}
                      </CardTitle>
                    </div>
                    <Link href={`/maand/${monthKey}`}>
                      <Button>Bekijk Details</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <p className="text-sm font-medium text-green-900">Inkomsten</p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">€{totalIncome.toFixed(2)}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <p className="text-sm font-medium text-red-900">Uitgaven</p>
                      </div>
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

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(categories).map(([category, txs]) => {
                      const total = txs.reduce((sum, t) => sum + t.amount, 0);
                      return (
                        <Badge key={category} variant={total < 0 ? 'destructive' : 'default'}>
                          {category}: €{Math.abs(total).toFixed(2)}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
