/**
 * Transaction type for presentation layer
 * This is the shape of data returned from Server Actions
 */
export interface Transaction {
  id: number;
  date: string;
  description: string;
  counterparty: string;
  amount: number;
  account: string;
  category: string;
  subcategory: string;
  user_context: string | null;
}
