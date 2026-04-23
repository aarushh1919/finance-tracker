import { useState, useEffect } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { SummaryCards } from './components/dashboard/summaryCards';
import { SpendingChart } from './components/dashboard/SpendingChart';
import { InsightPanel } from './components/dashboard/InsightPanel';
import { TransactionList } from './components/transactions/TransactionList';
import { TransactionForm } from './components/transactions/TransactionForm';
import { LoginPage } from './components/auth/LoginPage';
import { Button } from './components/ui/button';
import { fmt, getCat, formatDate } from './lib/utils';
import { LayoutDashboard, List, Lightbulb, Plus, LogOut, User } from 'lucide-react';
import { MONTHS } from './lib/constants';

type Page = 'dashboard' | 'transactions' | 'insights';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    if (stored === 'true' && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  // Show login page if not authenticated
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard userEmail={userEmail} onLogout={handleLogout} />;
}

function Dashboard({ userEmail, onLogout }: { userEmail: string; onLogout: () => void }) {
  const [page, setPage] = useState<Page>('dashboard');
  const [modalOpen, setModalOpen] = useState(false);

  const {
    transactions, loading, error, addTransaction, deleteTransaction,
    getMonthStats, getMonthlyData, getCategoryBreakdown, getInsights,
  } = useTransactions();

  const handleAddTransaction = async (data: any) => {
    const success = await addTransaction(data);
    if (success) {
      setModalOpen(false);
    }
  };

  const { income, expense, balance, count } = getMonthStats();
  const monthly = getMonthlyData();
  const breakdown = getCategoryBreakdown();
  const insights = getInsights();
  const now = new Date();
  const recent = transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const savingsRate = income ? Math.round((1 - expense / income) * 100) : 0;
  const avgDaily = expense ? Math.round(expense / now.getDate()) : 0;
  const budgetPct = Math.round(Math.max(0, 100 - (income ? expense / income * 100 : 0)));

  const navItems = [
    { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', Icon: List },
    { id: 'insights',     label: 'Insights',     Icon: Lightbulb },
  ] as const;

  return (
    <div className="flex h-screen bg-white font-sans" style={{ backgroundColor: '#ffffff' }}>
      {/* Sidebar */}
      <aside className="w-56 border-r bg-card flex flex-col p-4 gap-1 flex-shrink-0">
        <h1 className="font-serif text-xl mb-4 pb-4 border-b">
          fin<span className="italic text-emerald-600">wise</span>
        </h1>
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors w-full text-left
              ${page === id
                ? 'bg-emerald-50 text-emerald-700 font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
        <div className="mt-auto pt-4 border-t space-y-3">
          {/* User Info */}
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <User size={16} className="text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userEmail.split('@')[0]}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>

          {/* Budget Health */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Budget Health</p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: budgetPct + '%',
                  background: budgetPct > 60 ? '#1D9E75' : budgetPct > 30 ? '#EF9F27' : '#D85A30'
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{budgetPct}% remaining</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-serif">
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {MONTHS[now.getMonth()]} {now.getFullYear()}
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus size={15} /> Add Transaction
          </Button>
        </div>

        {page === 'dashboard' && (
          <>
            <SummaryCards income={income} expense={expense} balance={balance} />
            <SpendingChart monthly={monthly} breakdown={breakdown} />
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 rounded-lg border bg-card p-4">
                <p className="text-sm font-medium mb-3">Recent Transactions</p>
                <div className="divide-y">
                  {recent.map(t => {
                    const cat = getCat(t.category);
                    return (
                      <div key={t.id} className="flex justify-between items-center py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                            style={{ background: cat.bg }}>{cat.icon}</div>
                          <div>
                            <p className="text-sm">{t.name}</p>
                            <p className="text-xs text-muted-foreground">{cat.label}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${t.type === 'income' ? 'text-emerald-600' : 'text-orange-600'}`}>
                            {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <InsightPanel insights={insights} />
            </div>
          </>
        )}

        {page === 'transactions' && (
          <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        )}

        {page === 'insights' && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Savings Rate', val: savingsRate + '%', sub: 'of income saved' },
                { label: 'Avg Daily Spend', val: fmt(avgDaily), sub: 'per day this month' },
                { label: 'Transactions', val: count, sub: 'this month' },
              ].map(s => (
                <div key={s.label} className="rounded-lg border bg-card p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{s.label}</p>
                  <p className="text-2xl font-light text-emerald-600">{s.val}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                </div>
              ))}
            </div>
            <InsightPanel insights={insights} />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm font-medium mb-3">Category Breakdown</p>
                <div className="divide-y">
                  {breakdown.map(item => {
                    const c = getCat(item.cat);
                    return (
                      <div key={item.cat} className="flex justify-between items-center py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                            style={{ background: c.bg }}>{c.icon}</div>
                          <span className="text-sm">{c.label}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-600">{fmt(item.amt)}</p>
                          <p className="text-xs text-muted-foreground">{item.pct}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-50">
          Error: {error}
        </div>
      )}
      <TransactionForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTransaction}
        loading={loading}
      />
    </div>
  );
}
