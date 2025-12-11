import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/core/lib/utils';

interface AIConfidenceBadgeProps {
  confidence: number;
  className?: string;
}

export function AIConfidenceBadge({ confidence, className }: AIConfidenceBadgeProps) {
  const percentage = Math.round(confidence * 100);

  const variant = confidence >= 0.9 ? 'default' : confidence >= 0.7 ? 'secondary' : 'destructive';

  const colorClass =
    confidence >= 0.9
      ? 'bg-green-100 text-green-800 hover:bg-green-100'
      : confidence >= 0.7
        ? 'bg-orange-100 text-orange-800 hover:bg-orange-100'
        : 'bg-red-100 text-red-800 hover:bg-red-100';

  return (
    <Badge variant={variant} className={cn(colorClass, 'font-bold', className)}>
      {percentage}% zeker
    </Badge>
  );
}
