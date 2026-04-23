export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string | number;
  name: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note?: string;
}

export interface CategoryMeta {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
}

export interface MonthlyData {
  label: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdown {
  cat: string;
  amt: number;
  pct: number;
}

export interface Insight {
  type: 'good' | 'warn' | 'info';
  text: string;
}
