'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Spinner } from '@/presentation/components/ui/spinner';
import { Lightbulb, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { getMonthlyInsights } from '@/application/actions/insights.actions';
import { cn } from '@/core/lib/utils';

interface MonthComparison {
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

interface CategoryInsight {
  category: string;
  categoryName: string;
  total: number;
  count: number;
  percentage: number;
}

interface Outlier {
  transaction: {
    counterparty: string;
    amount: number;
    date: string;
    category: string;
  };
  categoryAverage: number;
  deviationPercentage: number;
  reason: string;
}

interface Insights {
  comparison: MonthComparison;
  topCategories: CategoryInsight[];
  outliers: Outlier[];
}

interface MonthInsightsProps {
  month: string;
}

export function MonthInsights({ month }: MonthInsightsProps) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      setLoading(true);
      try {
        const result = await getMonthlyInsights({ month });

        if (result.success && result.insights) {
          setInsights(result.insights);
        }
      } catch (error) {
        console.error('Error loading insights:', error);
      }
      setLoading(false);
    };

    loadInsights();
  }, [month]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Spinner size="sm" />
            <span className="text-blue-700">Inzichten laden...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) return null;

  const { comparison, topCategories, outliers } = insights;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-2xl font-bold text-blue-900">💡 Slimme Inzichten</h3>
              <p className="text-sm text-blue-700">AI-gedreven analyses van je uitgavenpatronen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Month Comparison */}
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Vergelijking met gemiddelde</div>
            <div
              className={cn(
                'text-2xl font-bold',
                comparison.differenceFromAverage > 0 ? 'text-red-600' : 'text-green-600'
              )}
            >
              {comparison.differenceFromAverage > 0 ? '+' : ''}€{' '}
              {Math.abs(comparison.differenceFromAverage).toLocaleString('nl-NL', {
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {comparison.percentageFromAverage > 0 ? '+' : ''}
              {comparison.percentageFromAverage.toFixed(1)}% t.o.v. gemiddeld
            </div>
          </CardContent>
        </Card>

        {/* Top Category */}
        {topCategories.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Grootste uitgavencategorie</div>
              <div className="text-lg font-bold text-foreground truncate">
                {topCategories[0].categoryName}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                € {topCategories[0].total.toLocaleString('nl-NL', { maximumFractionDigits: 0 })} •{' '}
                {topCategories[0].percentage.toFixed(0)}%
              </div>
            </CardContent>
          </Card>
        )}

        {/* Outliers */}
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">Ongebruikelijke uitgaven</div>
            <div className="text-2xl font-bold text-orange-600">{outliers.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {outliers.length > 0 ? 'Bekijk details hieronder' : 'Geen gevonden'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="space-y-4">
        {/* Month Comparison Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Maandvergelijking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deze maand:</span>
                <span className="font-bold">
                  € {comparison.currentTotal.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                </span>
              </div>
              {comparison.previousMonth && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vorige maand:</span>
                  <span>
                    €{' '}
                    {comparison.previousTotal?.toLocaleString('nl-NL', {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gemiddelde:</span>
                <span>
                  € {comparison.averageTotal.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                </span>
              </div>
              {comparison.difference !== null && (
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Verschil met vorige maand:</span>
                  <span
                    className={cn(
                      'font-bold',
                      comparison.difference > 0 ? 'text-red-600' : 'text-green-600'
                    )}
                  >
                    {comparison.difference > 0 ? '+' : ''}€{' '}
                    {comparison.difference.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                    {comparison.percentageChange !== null &&
                      ` (${comparison.percentageChange > 0 ? '+' : ''}${comparison.percentageChange.toFixed(1)}%)`}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Top 5 Uitgavencategorieën
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topCategories.map((cat, idx) => (
                <div key={cat.category} className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-muted-foreground w-6">{idx + 1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{cat.categoryName}</span>
                      <span className="font-bold text-red-600">
                        € {cat.total.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{cat.count} transacties</span>
                      <span>{cat.percentage.toFixed(1)}% van totaal</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outliers */}
        {outliers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Ongebruikelijke Uitgaven
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {outliers.slice(0, 5).map((outlier, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-orange-400 pl-3 py-2 bg-orange-50 rounded-r"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {outlier.transaction.counterparty}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{outlier.reason}</div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="font-bold text-orange-600">
                          €{' '}
                          {Math.abs(outlier.transaction.amount).toLocaleString('nl-NL', {
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Gem: €{' '}
                          {outlier.categoryAverage.toLocaleString('nl-NL', {
                            maximumFractionDigits: 0,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
