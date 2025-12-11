'use client';

import { useState } from 'react';
import { Transaction } from '@/presentation/types';
import { Button } from '@/presentation/components/ui/button';
import { Separator } from '@/presentation/components/ui/separator';
import { Pencil, Sparkles } from 'lucide-react';
import { AccountBadge } from './account-badge';
import { TransactionContextInput } from './transaction-context-input';
import { CategorySelector } from '../categories/category-selector';
import { AISuggestionCard } from '../ai/ai-suggestion-card';
import { cn } from '@/core/lib/utils';
import { suggestCategorization } from '@/application/actions/ai.actions';

interface TransactionItemProps {
  transaction: Transaction;
  onUpdateTransaction: (
    transaction: Transaction,
    newCategory: string,
    newSubcategory: string
  ) => void;
}

interface AISuggestion {
  category: string;
  subcategory: string;
  confidence: number;
  reasoning: string;
}

export function TransactionItem({ transaction, onUpdateTransaction }: TransactionItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(transaction.category || 'te_beoordelen');
  const [selectedSubcategory, setSelectedSubcategory] = useState(transaction.subcategory);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const date = new Date(transaction.date);
  const dateStr = date.toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const amountClass = transaction.amount >= 0 ? 'text-green-600' : 'text-red-600';

  const getSuggestion = async () => {
    setLoadingSuggestion(true);
    try {
      const result = await suggestCategorization({
        counterparty: transaction.counterparty,
        amount: transaction.amount,
        description: transaction.description,
        userContext: transaction.user_context,
      });

      if (result.success && result.suggestion) {
        setAiSuggestion(result.suggestion);
        setShowSuggestion(true);
      }
    } catch (error) {
      console.error('Error getting suggestion:', error);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const applySuggestion = () => {
    if (aiSuggestion) {
      setSelectedCategory(aiSuggestion.category);
      setSelectedSubcategory(aiSuggestion.subcategory);
      setShowSuggestion(false);
    }
  };

  const handleSave = () => {
    onUpdateTransaction(transaction, selectedCategory, selectedSubcategory);
    setIsEditing(false);
    setShowSuggestion(false);
    setAiSuggestion(null);
  };

  const handleCancel = () => {
    setSelectedCategory(transaction.category || 'te_beoordelen');
    setSelectedSubcategory(transaction.subcategory);
    setIsEditing(false);
    setShowSuggestion(false);
    setAiSuggestion(null);
  };

  return (
    <div className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          {/* Transaction Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground">{dateStr}</span>
              <AccountBadge account={transaction.account} />
            </div>
            <div
              className="font-medium text-foreground mb-1 truncate"
              title={transaction.counterparty}
            >
              {transaction.counterparty}
            </div>
            {transaction.description && (
              <div
                className="text-sm text-muted-foreground mb-1 truncate"
                title={transaction.description}
              >
                {transaction.description}
              </div>
            )}
            <div className="text-sm text-muted-foreground">{transaction.subcategory}</div>
          </div>

          {/* Amount and Actions */}
          <div className="flex items-center gap-3">
            <div className={cn('text-lg font-bold whitespace-nowrap', amountClass)}>
              €{' '}
              {Math.abs(transaction.amount).toLocaleString('nl-NL', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mt-4 pt-4 space-y-3">
            <Separator />

            {/* Context Input */}
            <TransactionContextInput
              transactionId={transaction.id!}
              initialContext={transaction.user_context}
              category={transaction.category}
            />

            {/* AI Suggestion Button */}
            <Button
              onClick={getSuggestion}
              disabled={loadingSuggestion}
              variant="outline"
              className="w-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loadingSuggestion ? 'AI denkt na...' : 'Vraag AI om suggestie'}
            </Button>

            {/* AI Suggestion Result */}
            {showSuggestion && aiSuggestion && (
              <AISuggestionCard
                suggestion={aiSuggestion}
                onApply={applySuggestion}
                onDismiss={() => setShowSuggestion(false)}
              />
            )}

            {/* Category Selection */}
            <CategorySelector
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onCategoryChange={setSelectedCategory}
              onSubcategoryChange={setSelectedSubcategory}
            />

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                Opslaan
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                Annuleren
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
