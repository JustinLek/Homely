import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/core/lib/utils';

interface AccountBadgeProps {
  account: string;
  className?: string;
}

export function AccountBadge({ account, className }: AccountBadgeProps) {
  const colorClass =
    account === 'ING'
      ? 'bg-orange-500 text-white hover:bg-orange-500'
      : 'bg-blue-700 text-white hover:bg-blue-700';

  return <Badge className={cn(colorClass, 'font-bold', className)}>{account}</Badge>;
}
