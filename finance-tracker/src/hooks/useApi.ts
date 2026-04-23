import { useState, useCallback } from 'react';
import { api, type ApiResponse } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

type ApiFunction<T, Args extends any[]> = (...args: Args) => Promise<ApiResponse<T>>;

export function useApi<T, Args extends any[]>(apiFunction: ApiFunction<T, Args>) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: Args): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiFunction(...args);
      
      if (response.success && response.data !== undefined) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        return true;
      } else {
        setState({
          data: null,
          loading: false,
          error: response.message || 'An error occurred',
        });
        return false;
      }
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'An error occurred',
      });
      return false;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Pre-built hooks for common operations
export function useTransactions() {
  const getTransactions = useApi(api.getTransactions);
  const createTransaction = useApi(api.createTransaction);
  const updateTransaction = useApi(api.updateTransaction);
  const deleteTransaction = useApi(api.deleteTransaction);
  const getStats = useApi(api.getTransactionStats);

  return {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getStats,
  };
}

export function useCategories() {
  const getCategories = useApi(api.getCategories);
  const createCategory = useApi(api.createCategory);
  const updateCategory = useApi(api.updateCategory);
  const deleteCategory = useApi(api.deleteCategory);

  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}

export function useAccounts() {
  const getAccounts = useApi(api.getAccounts);
  const createAccount = useApi(api.createAccount);
  const updateAccount = useApi(api.updateAccount);
  const deleteAccount = useApi(api.deleteAccount);

  return {
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  };
}

export function useBudgets() {
  const getBudgets = useApi(api.getBudgets);
  const createBudget = useApi(api.createBudget);
  const updateBudget = useApi(api.updateBudget);
  const deleteBudget = useApi(api.deleteBudget);
  const updateSpending = useApi(api.updateBudgetSpending);

  return {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    updateSpending,
  };
}
