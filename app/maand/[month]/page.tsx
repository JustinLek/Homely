import { getTransactions } from '@/application/actions/transaction.actions';
import { MonthDetailView } from '@/presentation/components/features/month/month-detail-view';

interface PageProps {
  params: Promise<{ month: string }>;
}

export default async function MaandPage({ params }: PageProps) {
  const { month: monthKey } = await params;

  // Fetch data directly in Server Component
  const result = await getTransactions();
  const transactions = result.success ? result.transactions : [];

  return <MonthDetailView monthKey={monthKey} initialTransactions={transactions} />;
}
