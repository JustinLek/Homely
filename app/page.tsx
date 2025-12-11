import { getTransactions } from '@/application/actions/transaction.actions';
import { MonthlyOverview } from '@/presentation/components/features/home/monthly-overview';

export default async function Home() {
  // Fetch data directly in Server Component
  const result = await getTransactions();
  const transactions = result.success ? result.transactions : [];

  return <MonthlyOverview transactions={transactions} />;
}
