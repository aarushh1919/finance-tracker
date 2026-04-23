import { useEffect } from 'react';
import { useTransactions, useCategories, useAccounts } from '../../hooks/useApi';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function ApiExample() {
  const { 
    data: transactions, 
    loading: transactionsLoading, 
    error: transactionsError, 
    execute: fetchTransactions 
  } = useTransactions().getTransactions;

  const { 
    data: categories, 
    loading: categoriesLoading, 
    error: categoriesError, 
    execute: fetchCategories 
  } = useCategories().getCategories;

  const { 
    data: accounts, 
    loading: accountsLoading, 
    error: accountsError, 
    execute: fetchAccounts 
  } = useAccounts().getAccounts;

  useEffect(() => {
    // Fetch data on component mount
    fetchTransactions();
    fetchCategories();
    fetchAccounts();
  }, [fetchTransactions, fetchCategories, fetchAccounts]);

  const handleCreateTransaction = async () => {
    // Example: Create a new transaction
    // This is just an example - replace with actual form data
    const { createTransaction } = useTransactions();
    const success = await createTransaction.execute({
      description: 'Grocery shopping',
      amount: 50.00,
      type: 'expense',
      category: 'category_id_here',
      account: 'account_id_here',
      date: new Date().toISOString(),
    });

    if (success) {
      console.log('Transaction created successfully');
      fetchTransactions(); // Refresh the list
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Integration Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Transactions Section */}
            <div>
              <h3 className="font-semibold mb-2">Transactions</h3>
              {transactionsLoading && <p>Loading transactions...</p>}
              {transactionsError && <p className="text-red-500">Error: {transactionsError}</p>}
              {transactions && (
                <div className="space-y-2">
                  {transactions.data?.slice(0, 5).map((transaction) => (
                    <div key={transaction._id} className="p-2 bg-gray-100 rounded">
                      {transaction.description} - ${transaction.amount}
                    </div>
                  ))}
                </div>
              )}
              <Button onClick={fetchTransactions} variant="outline" size="sm" className="mt-2">
                Refresh Transactions
              </Button>
            </div>

            {/* Categories Section */}
            <div>
              <h3 className="font-semibold mb-2">Categories</h3>
              {categoriesLoading && <p>Loading categories...</p>}
              {categoriesError && <p className="text-red-500">Error: {categoriesError}</p>}
              {categories && (
                <div className="flex flex-wrap gap-2">
                  {categories?.slice(0, 5).map((category) => (
                    <span 
                      key={category._id} 
                      className="px-2 py-1 rounded text-sm"
                      style={{ backgroundColor: category.color || '#ccc' }}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Accounts Section */}
            <div>
              <h3 className="font-semibold mb-2">Accounts</h3>
              {accountsLoading && <p>Loading accounts...</p>}
              {accountsError && <p className="text-red-500">Error: {accountsError}</p>}
              {accounts && (
                <div className="space-y-2">
                  {accounts?.slice(0, 5).map((account) => (
                    <div key={account._id} className="p-2 bg-gray-100 rounded flex justify-between">
                      <span>{account.name}</span>
                      <span className="font-semibold">${account.balance}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleCreateTransaction} className="mt-4">
              Create Example Transaction
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApiExample;
