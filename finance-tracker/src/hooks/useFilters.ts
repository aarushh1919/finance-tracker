import { useState, useMemo } from 'react';
import type { Transaction, TransactionType } from '../types';

export type FilterType = TransactionType | 'all';

export function useFilters(transactions: Transaction[]) {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return transactions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(t => filterType === 'all' || t.type === filterType)
      .filter(t => filterCat === 'all' || t.category === filterCat)
      .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));
  }, [transactions, filterType, filterCat, search]);

  return { filtered, filterType, filterCat, search, setFilterType, setFilterCat, setSearch };
}
