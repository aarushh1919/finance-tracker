const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface Transaction {
  _id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
  account: Account;
  date: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  budgetLimit?: number;
  isActive: boolean;
}

export interface Account {
  _id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash' | 'other';
  balance: number;
  currency: string;
  bankName?: string;
  accountNumber?: string;
  isActive: boolean;
}

export interface Budget {
  _id: string;
  name: string;
  category: Category;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  spent: number;
  remaining?: number;
  percentageUsed?: number;
  isActive: boolean;
}

export interface CreateTransactionData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  account: string;
  date?: string;
  notes?: string;
  tags?: string[];
}

export interface CreateCategoryData {
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  budgetLimit?: number;
}

export interface CreateAccountData {
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash' | 'other';
  balance?: number;
  currency?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface CreateBudgetData {
  name: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Transactions
  async getTransactions(params?: { 
    page?: number; 
    limit?: number; 
    category?: string; 
    account?: string; 
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ data: Transaction[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    return this.fetch(`/transactions?${queryParams.toString()}`);
  }

  async createTransaction(data: CreateTransactionData): Promise<ApiResponse<Transaction>> {
    return this.fetch('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTransaction(id: string, data: Partial<CreateTransactionData>): Promise<ApiResponse<Transaction>> {
    return this.fetch(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTransaction(id: string): Promise<ApiResponse<void>> {
    return this.fetch(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  async getTransactionStats(params?: { period?: string; startDate?: string; endDate?: string }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    return this.fetch(`/transactions/stats?${queryParams.toString()}`);
  }

  // Categories
  async getCategories(params?: { type?: string; isActive?: boolean }): Promise<ApiResponse<Category[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    return this.fetch(`/categories?${queryParams.toString()}`);
  }

  async createCategory(data: CreateCategoryData): Promise<ApiResponse<Category>> {
    return this.fetch('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: Partial<CreateCategoryData>): Promise<ApiResponse<Category>> {
    return this.fetch(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return this.fetch(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Accounts
  async getAccounts(params?: { type?: string; isActive?: boolean }): Promise<ApiResponse<Account[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    return this.fetch(`/accounts?${queryParams.toString()}`);
  }

  async createAccount(data: CreateAccountData): Promise<ApiResponse<Account>> {
    return this.fetch('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAccount(id: string, data: Partial<CreateAccountData>): Promise<ApiResponse<Account>> {
    return this.fetch(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: string): Promise<ApiResponse<void>> {
    return this.fetch(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Budgets
  async getBudgets(params?: { category?: string; isActive?: boolean; period?: string }): Promise<ApiResponse<Budget[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    return this.fetch(`/budgets?${queryParams.toString()}`);
  }

  async createBudget(data: CreateBudgetData): Promise<ApiResponse<Budget>> {
    return this.fetch('/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBudget(id: string, data: Partial<CreateBudgetData>): Promise<ApiResponse<Budget>> {
    return this.fetch(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBudget(id: string): Promise<ApiResponse<void>> {
    return this.fetch(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  async updateBudgetSpending(id: string): Promise<ApiResponse<Budget>> {
    return this.fetch(`/budgets/${id}/spending`, {
      method: 'PATCH',
    });
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return this.fetch('/health');
  }
}

export const api = new ApiService();
export default api;
