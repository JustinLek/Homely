import { useState } from 'react';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import { Info } from 'lucide-react';

interface TransactionContextInputProps {
  transactionId: string;
  initialContext?: string;
  category?: string;
  onSave?: (context: string) => void;
}

export function TransactionContextInput({
  transactionId,
  initialContext = '',
  category = 'te_beoordelen',
  onSave,
}: TransactionContextInputProps) {
  const [context, setContext] = useState(initialContext);
  const [isSaving, setIsSaving] = useState(false);
  const [savedContext, setSavedContext] = useState(initialContext);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/transactions/${transactionId}/context`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (response.ok) {
        setSavedContext(context);
        onSave?.(context);
      }
    } catch (error) {
      console.error('Error saving context:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = context !== savedContext;

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="pt-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div>
              <label className="text-sm font-medium text-yellow-900 block mb-1">
                Extra Context voor AI (optioneel)
              </label>
              <p className="text-xs text-yellow-700 mb-2">
                {category === 'te_beoordelen'
                  ? 'Weet je niet in welke categorie dit hoort, maar wel wat de transactie inhoudt? Geef hier extra informatie!'
                  : 'Wil je de categorisatie aanpassen met AI? Voeg context toe voor een betere suggestie!'}
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                onBlur={handleSave}
                placeholder="Bijv: 'Dit was een cadeau voor verjaardag' of 'Reparatie van de wasmachine'"
                className="flex-1 border-yellow-300 focus-visible:ring-yellow-500"
              />
              {hasChanges && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {isSaving ? 'Bezig...' : 'Opslaan'}
                </Button>
              )}
            </div>
            {savedContext && !hasChanges && (
              <div className="text-xs text-yellow-700">
                ✓ Context opgeslagen: &quot;{savedContext}&quot;
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
