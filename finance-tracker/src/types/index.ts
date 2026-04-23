export interface Transaction {
  id: string | number;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note?: string;
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
