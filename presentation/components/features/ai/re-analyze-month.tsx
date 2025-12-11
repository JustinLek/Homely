'use client';

import { useState } from 'react';
import { Transaction } from '@/presentation/types';
import { CATEGORIES } from '@/core/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { cn } from '@/core/lib/utils';
import { bulkSuggestCategorization } from '@/application/actions/ai.actions';

interface ReAnalyzeMonthProps {
  transactions: Transaction[];
  onApplyChanges: (
    changes: Array<{ transaction: Transaction; newCategory: string; newSubcategory: string }>
  ) => void;
}

interface SuggestedChange {
  transaction: Transaction;
  currentCategory: string;
  currentSubcategory: string;
  suggestedCategory: string;
  suggestedSubcategory: string;
  confidence: number;
  reasoning: string;
  selected: boolean;
}

export function ReAnalyzeMonth({ transactions, onApplyChanges }: ReAnalyzeMonthProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [changes, setChanges] = useState<SuggestedChange[]>([]);
  const [showResults, setShowResults] = useState(false);

  const analyzeMonth = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setChanges([]);

    try {
      const result = await bulkSuggestCategorization({
        transactions: transactions.map((t) => ({
          id: t.id!,
          counterparty: t.counterparty,
          amount: t.amount,
          description: t.description,
          userContext: t.user_context,
        })),
        skipCache: true, // Skip cache for fresh AI analysis
      });

      if (result.success && result.suggestions) {
        const suggestedChanges: SuggestedChange[] = [];

        result.suggestions.forEach((s) => {
          const transaction = transactions.find((t) => t.id === s.id);
          if (!transaction) return;

          // Only include if it's different from current categorization
          if (
            s.suggestion.category !== transaction.category ||
            s.suggestion.subcategory !== transaction.subcategory
          ) {
            suggestedChanges.push({
              transaction,
              currentCategory: transaction.category || 'te_beoordelen',
              currentSubcategory: transaction.subcategory,
              suggestedCategory: s.suggestion.category,
              suggestedSubcategory: s.suggestion.subcategory,
              confidence: s.suggestion.confidence,
              reasoning: s.suggestion.reasoning,
              selected: s.suggestion.confidence >= 0.9, // Auto-select high confidence
            });
          }
        });

        setChanges(suggestedChanges);
        setShowResults(true);
        console.log(`📊 Re-analyse complete: ${suggestedChanges.length} wijzigingen voorgesteld`);
      }
    } catch (error) {
      console.error('Error analyzing month:', error);
    } finally {
      setIsAnalyzing(false);
      setProgress(100);
    }
  };

  const toggleChange = (index: number) => {
    setChanges((prev) =>
      prev.map((change, i) => (i === index ? { ...change, selected: !change.selected } : change))
    );
  };

  const toggleAll = (selected: boolean) => {
    setChanges((prev) => prev.map((change) => ({ ...change, selected })));
  };

  const applySelectedChanges = () => {
    const selectedChanges = changes
      .filter((c) => c.selected)
      .map((c) => ({
        transaction: c.transaction,
        newCategory: c.suggestedCategory,
        newSubcategory: c.suggestedSubcategory,
      }));

    onApplyChanges(selectedChanges);
    setShowResults(false);
    setChanges([]);
  };

  const selectedCount = changes.filter((c) => c.selected).length;
  const highConfidenceCount = changes.filter((c) => c.confidence >= 0.9).length;

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 mb-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <RefreshCw className="h-8 w-8 text-purple-600" />
          <div>
            <CardTitle className="text-purple-900">Re-analyseer Maand</CardTitle>
            <p className="text-sm text-purple-700 mt-1">
              Analyseer alle transacties opnieuw met de nieuwste AI kennis en context
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!isAnalyzing && !showResults && (
          <Button
            onClick={analyzeMonth}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Start Re-analyse ({transactions.length} transacties)
          </Button>
        )}

        {isAnalyzing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-purple-900">
              <span className="font-medium">Analyseren...</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {showResults && changes.length > 0 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Voorgestelde Wijzigingen</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {changes.length} wijzigingen gevonden ({highConfidenceCount} met hoge
                      zekerheid ≥90%)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => toggleAll(true)} variant="outline" size="sm">
                      Alles selecteren
                    </Button>
                    <Button onClick={() => toggleAll(false)} variant="outline" size="sm">
                      Alles deselecteren
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {changes.map((change, index) => (
                    <div
                      key={index}
                      className={cn(
                        'border rounded-lg p-3',
                        change.selected ? 'border-purple-300 bg-purple-50' : 'border-border bg-card'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={change.selected}
                          onCheckedChange={() => toggleChange(index)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <div
                                className="font-medium text-foreground truncate"
                                title={change.transaction.counterparty}
                              >
                                {change.transaction.counterparty}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                €
                                {Math.abs(change.transaction.amount).toLocaleString('nl-NL', {
                                  minimumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                            <Badge variant={change.confidence >= 0.9 ? 'default' : 'secondary'}>
                              {Math.round(change.confidence * 100)}%
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-red-50 border border-red-200 rounded p-2">
                              <div className="text-xs text-red-600 font-medium mb-1">Huidig:</div>
                              <div className="text-red-900 font-medium">
                                {CATEGORIES[change.currentCategory]?.name || change.currentCategory}
                              </div>
                              <div className="text-xs text-red-700">
                                {change.currentSubcategory}
                              </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded p-2">
                              <div className="text-xs text-green-600 font-medium mb-1">
                                Voorgesteld:
                              </div>
                              <div className="text-green-900 font-medium">
                                {CATEGORIES[change.suggestedCategory]?.name ||
                                  change.suggestedCategory}
                              </div>
                              <div className="text-xs text-green-700">
                                {change.suggestedSubcategory}
                              </div>
                            </div>
                          </div>

                          {change.reasoning && (
                            <div className="mt-2 text-xs text-muted-foreground italic">
                              💡 {change.reasoning}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Button
                    onClick={applySelectedChanges}
                    disabled={selectedCount === 0}
                    className="flex-1"
                  >
                    Pas {selectedCount} Wijziging{selectedCount !== 1 ? 'en' : ''} Toe
                  </Button>
                  <Button
                    onClick={() => {
                      setShowResults(false);
                      setChanges([]);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Annuleren
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showResults && changes.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
              <h4 className="font-bold text-foreground mb-2">Geen wijzigingen nodig!</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Alle transacties zijn al correct gecategoriseerd volgens de huidige AI kennis.
              </p>
              <Button onClick={() => setShowResults(false)} variant="outline">
                Sluiten
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
