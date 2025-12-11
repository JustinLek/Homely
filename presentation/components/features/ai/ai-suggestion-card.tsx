import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Lightbulb, X } from 'lucide-react';
import { CATEGORIES } from '@/core/constants';
import { AIConfidenceBadge } from './ai-confidence-badge';

interface AISuggestion {
  category: string;
  subcategory: string;
  confidence: number;
  reasoning: string;
}

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onApply: () => void;
  onDismiss: () => void;
}

export function AISuggestionCard({ suggestion, onApply, onDismiss }: AISuggestionCardProps) {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-blue-900">AI Suggestie</span>
          </div>
          <div className="flex items-center gap-2">
            <AIConfidenceBadge confidence={suggestion.confidence} />
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 hover:bg-blue-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-700">Categorie: </span>
            <span className="text-sm font-bold text-blue-900">
              {CATEGORIES[suggestion.category]?.name}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Subcategorie: </span>
            <span className="text-sm font-bold text-blue-900">{suggestion.subcategory}</span>
          </div>
          <div className="text-sm text-gray-600 italic">&quot;{suggestion.reasoning}&quot;</div>
        </div>

        <Button onClick={onApply} className="w-full bg-blue-600 hover:bg-blue-700">
          Suggestie Toepassen
        </Button>
      </CardContent>
    </Card>
  );
}
