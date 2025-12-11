'use client';

import { useState } from 'react';
import { Transaction } from '@/presentation/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Lightbulb, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { bulkSuggestCategorization } from '@/application/actions/ai.actions';

interface BulkAISuggestProps {
  transactions: Transaction[];
  onApplySuggestions: (
    suggestions: Array<{ transaction: Transaction; category: string; subcategory: string }>
  ) => void;
}

export function BulkAISuggestion({ transactions, onApplySuggestions }: BulkAISuggestProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [suggestions, setSuggestions] = useState<
    Array<{
      transaction: Transaction;
      category: string;
      subcategory: string;
      confidence: number;
      reasoning: string;
      source?: string;
    }>
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [confidenceThreshold] = useState(0.9); // 90% minimum confidence

  const processBulk = async () => {
    setIsProcessing(true);
    setProgress(0);
    setSuggestions([]);

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
        const formattedSuggestions = result.suggestions.map((s) => {
          const transaction = transactions.find((t) => t.id === s.id);
          return {
            transaction: transaction!,
            category: s.suggestion.category,
            subcategory: s.suggestion.subcategory,
            confidence: s.suggestion.confidence,
            reasoning: s.suggestion.reasoning,
            source: s.source,
          };
        });

        setSuggestions(formattedSuggestions);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error processing bulk suggestions:', error);
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const applyHighConfidence = () => {
    const highConfidenceSuggestions = suggestions.filter(
      (s) => s.confidence >= confidenceThreshold
    );
    onApplySuggestions(highConfidenceSuggestions);
    setShowResults(false);
    setSuggestions([]);
  };

  const applyAll = () => {
    onApplySuggestions(suggestions);
    setShowResults(false);
    setSuggestions([]);
  };

  if (transactions.length === 0) {
    return null;
  }

  const highConfidence = suggestions.filter((s) => s.confidence >= confidenceThreshold);
  const lowConfidence = suggestions.filter((s) => s.confidence < confidenceThreshold);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 mb-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Lightbulb className="h-8 w-8 text-blue-600" />
          <div>
            <CardTitle className="text-blue-900">AI Bulk Categorisatie</CardTitle>
            <p className="text-sm text-blue-700 mt-1">
              Laat AI alle {transactions.length} transacties analyseren en categoriseren
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!isProcessing && !showResults && (
          <Button
            onClick={processBulk}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            <Zap className="mr-2 h-5 w-5" />
            Start AI Analyse
          </Button>
        )}

        {isProcessing && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-blue-900">
              <span>Transacties analyseren...</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-blue-600 text-center">Dit kan even duren... ☕</p>
          </div>
        )}

        {showResults && suggestions.length > 0 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resultaten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-3">
                      <div className="text-sm text-green-700 font-medium">
                        Hoge Zekerheid (≥90%)
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        {highConfidence.length}
                      </div>
                      <div className="text-xs text-green-600">Automatisch toepassen</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-3">
                      <div className="text-sm text-orange-700 font-medium">
                        Lage Zekerheid (&lt;90%)
                      </div>
                      <div className="text-2xl font-bold text-orange-900">
                        {lowConfidence.length}
                      </div>
                      <div className="text-xs text-orange-600">Handmatig controleren</div>
                    </CardContent>
                  </Card>
                </div>

                {/* High Confidence List */}
                {highConfidence.length > 0 && (
                  <div>
                    <h5 className="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Hoge Zekerheid ({highConfidence.length})
                    </h5>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {highConfidence.slice(0, 5).map((suggestion, index) => (
                        <div
                          key={index}
                          className="text-xs bg-green-50 p-2 rounded border border-green-200"
                        >
                          <div className="font-medium text-foreground truncate">
                            {suggestion.transaction.counterparty}
                          </div>
                          <div className="text-green-700">
                            → {suggestion.subcategory} ({Math.round(suggestion.confidence * 100)}%)
                          </div>
                        </div>
                      ))}
                      {highConfidence.length > 5 && (
                        <div className="text-xs text-muted-foreground text-center">
                          ... en {highConfidence.length - 5} meer
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Low Confidence List */}
                {lowConfidence.length > 0 && (
                  <div>
                    <h5 className="text-sm font-bold text-orange-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Lage Zekerheid - Handmatig Controleren ({lowConfidence.length})
                    </h5>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {lowConfidence.slice(0, 5).map((suggestion, index) => (
                        <div
                          key={index}
                          className="text-xs bg-orange-50 p-2 rounded border border-orange-200"
                        >
                          <div className="font-medium text-foreground truncate">
                            {suggestion.transaction.counterparty}
                          </div>
                          <div className="text-orange-700">
                            → {suggestion.subcategory} ({Math.round(suggestion.confidence * 100)}%)
                          </div>
                        </div>
                      ))}
                      {lowConfidence.length > 5 && (
                        <div className="text-xs text-muted-foreground text-center">
                          ... en {lowConfidence.length - 5} meer
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t space-y-2">
                  <div className="flex gap-2">
                    {highConfidence.length > 0 && (
                      <Button
                        onClick={applyHighConfidence}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Pas {highConfidence.length} Hoge Zekerheid Toe
                      </Button>
                    )}
                    <Button onClick={applyAll} className="flex-1">
                      Pas Alles Toe ({suggestions.length})
                    </Button>
                    <Button
                      onClick={() => {
                        setShowResults(false);
                        setSuggestions([]);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Annuleren
                    </Button>
                  </div>
                  {lowConfidence.length > 0 && (
                    <p className="text-xs text-orange-600 text-center">
                      ⚠️ {lowConfidence.length} transacties hebben lage zekerheid en blijven in
                      &quot;Te beoordelen&quot; voor handmatige controle
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
