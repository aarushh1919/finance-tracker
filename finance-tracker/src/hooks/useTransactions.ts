import { useState, useCallback, useEffect } from 'react';
import type { Transaction, MonthlyData, CategoryBreakdown, Insight } from '../types';
import type { TransactionFormData } from '../lib/schemas';
import { MONTHS } from '../lib/constants';
import { fmt, getCat } from '../lib/utils';
import { api } from '../services/api';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getTransactions();

      // Backend returns { success: true, data: [...] } or { success: true, data: { data: [...] } }
      const transactionData = response.data?.data || response.data;
      
      if (response.success && Array.isArray(transactionData)) {
        // Transform API data to match frontend format
        const transformed = transactionData.map((t: any) => ({
          id: t._id,
          name: t.description,
          amount: t.amount,
          type: t.type,
          category: typeof t.category === 'string' ? t.category : (t.category?.name?.toLowerCase() || 'other'),
          date: t.date ? t.date.split('T')[0] : new Date().toISOString().split('T')[0],
          note: t.notes || '',
        }));
        setTransactions(transformed);
      } else if (response.success) {
        // Empty or unexpected data format, set empty array
        setTransactions([]);
      } else {
        setError(response.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.getCategories();
      console.log('Categories API response:', response);
      // Backend returns { success: true, count: X, data: [...] }
      const categoryData = response.data || [];
      if (response.success && categoryData) {
        setCategories(categoryData);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  // Fetch accounts from API
  const fetchAccounts = useCallback(async () => {
    try {
      const response = await api.getAccounts();
      console.log('Accounts API response:', response);
      // Backend returns { success: true, count: X, data: [...] }
      const accountData = response.data || [];
      if (response.success && accountData) {
        setAccounts(accountData);
      }
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchAccounts();
  }, [fetchTransactions, fetchCategories, fetchAccounts]);

  // Add transaction to API
  const addTransaction = useCallback(async (data: TransactionFormData) => {
    setLoading(true);
    setError(null);

    console.log('Adding transaction:', data);
    console.log('Available categories:', categories);
    console.log('Available accounts:', accounts);

    // Wait for categories to load
    if (categories.length === 0) {
      setError('Categories still loading. Please wait a moment and try again.');
      setLoading(false);
      return false;
    }

    try {
      // Find category by matching frontend ID to backend name (case-insensitive)
      const categoryObj = categories.find(c => {
        const catNameLower = c.name.toLowerCase();
        const dataCatLower = data.category.toLowerCase();
        const match = catNameLower === dataCatLower || c._id === data.category;
        console.log(`Checking: ${c.name} vs ${data.category} -> ${match}`);
        return match;
      });

      // Use first account if none specified
      const accountObj = accounts[0];

      if (!categoryObj) {
        console.error('Category not found:', data.category, 'Available:', categories.map(c => c.name));
        setError(`Category "${data.category}" not found. Available: ${categories.map(c => c.name).join(', ')}`);
        setLoading(false);
        return false;
      }

      if (!accountObj) {
        setError('No account available. Please create an account first.');
        setLoading(false);
        return false;
      }

      console.log('Found category:', categoryObj);
      console.log('Found account:', accountObj);

      const response = await api.createTransaction({
        description: data.name,
        amount: data.amount,
        type: data.type,
        category: categoryObj._id,
        account: accountObj._id,
        date: new Date(data.date).toISOString(),
        notes: data.note || '',
      });

      if (response.success) {
        // Refresh the list
        await fetchTransactions();
        return true;
      } else {
        setError(response.message || 'Failed to add transaction');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, categories, accounts]);

  // Delete transaction from API
  const deleteTransaction = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.deleteTransaction(String(id));

      if (response.success) {
        await fetchTransactions();
        return true;
      } else {
        setError(response.message || 'Failed to delete transaction');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, categories, accounts]);

  // Stats calculations
  const getMonthStats = useCallback(() => {
    const now = new Date();
    const cm = now.getMonth(), cy = now.getFullYear();
    const thisMonth = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === cm && d.getFullYear() === cy;
    });
    const income = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense, count: thisMonth.length };
  }, [transactions]);

  const getMonthlyData = useCallback((): MonthlyData[] => {
    const map: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = MONTHS[d.getMonth()] + ' ' + String(d.getFullYear()).slice(2);
      if (!map[key]) map[key] = { income: 0, expense: 0 };
      map[key][t.type] += t.amount;
    });
    return Object.keys(map).slice(-6).map(k => ({ label: k.split(' ')[0], ...map[k] }));
  }, [transactions]);

  const getCategoryBreakdown = useCallback((): CategoryBreakdown[] => {
    const now = new Date();
    const cm = now.getMonth(), cy = now.getFullYear();
    const expenses = transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && d.getMonth() === cm && d.getFullYear() === cy;
    });
    const total = expenses.reduce((s, t) => s + t.amount, 0);
    const map: Record<string, number> = {};
    expenses.forEach(t => { map[t.category] = (map[t.category] ?? 0) + t.amount; });
    return Object.entries(map)
      .map(([cat, amt]) => ({ cat: cat as any, amt, pct: total ? Math.round(amt / total * 100) : 0 }))
      .sort((a, b) => b.amt - a.amt);
  }, [transactions]);

  const getInsights = useCallback((): Insight[] => {
    const { income, expense, balance } = getMonthStats();
    const ratio = income ? expense / income : 0;
    const bd = getCategoryBreakdown();
    const insights: Insight[] = [];

    if (ratio > 0.8)
      insights.push({ type: 'warn', text: `You've spent ${Math.round(ratio * 100)}% of your income this month. Hold back!` });
    else if (ratio < 0.5)
      insights.push({ type: 'good', text: `Great job! You're currently saving ${100 - Math.round(ratio * 100)}% of your income.` });
    else if (ratio > 0)
      insights.push({ type: 'info', text: `Spending is at ${Math.round(ratio * 100)}% of your income. You're on track.` });

    if (bd.length > 0) {
      const top = bd[0];
      const c = getCat(top.cat);
      const targetSavings = income * 0.20;
      const currentSavings = income - expense;
      if (currentSavings < targetSavings) {
        const diff = targetSavings - currentSavings;
        insights.push({ type: 'warn', text: `If you cut ${fmt(Math.min(diff, top.amt / 2))} from your top expense (${c.label}), you'll hit your 20% savings goal!` });
      } else {
        insights.push({ type: 'info', text: `${c.label} is your top expense at ${fmt(top.amt)} (${top.pct}%).` });
      }
    }

    if (balance > 0)
      insights.push({ type: 'good', text: `Positive balance of ${fmt(balance)} this month.` });
    else if (balance < 0)
      insights.push({ type: 'warn', text: `You are ${fmt(Math.abs(balance))} over budget.` });

    return insights;
  }, [getMonthStats, getCategoryBreakdown]);

  return {
    transactions,
    categories,
    accounts,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    getMonthStats,
    getMonthlyData,
    getCategoryBreakdown,
    getInsights,
    refresh: fetchTransactions,
  };
}
