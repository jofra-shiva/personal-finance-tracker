import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Calendar,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const [stats, setStats] = useState({
    summaryStats: [],
    monthlyStats: [],
    categoryStats: []
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, transRes] = await Promise.all([
        axios.get('http://localhost:5000/api/transactions/stats'),
        axios.get('http://localhost:5000/api/transactions?limit=5')
      ]);
      setStats(statsRes.data);
      setTransactions(transRes.data.transactions);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getSummary = (type) => {
    const item = stats.summaryStats.find(s => s._id === type);
    return item ? item.total : 0;
  };

  const income = getSummary('income');
  const expense = getSummary('expense');
  const balance = income - expense;

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Financial Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening with your money.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20">
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 rounded-bl-2xl">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Income</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ${income.toLocaleString()}
          </h3>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-rose-500/10 rounded-bl-2xl">
            <TrendingDown className="w-6 h-6 text-rose-500" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Expenses</p>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            ${expense.toLocaleString()}
          </h3>
          <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${(expense / (income || 1)) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-primary-500/10 rounded-bl-2xl">
            <Wallet className="w-6 h-6 text-primary-500" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Current Balance</p>
          <h3 className={`text-2xl font-bold ${balance >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-rose-600'}`}>
            ${balance.toLocaleString()}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
            <Calendar className="w-3 h-3" />
            As of {format(new Date(), 'MMMM d, yyyy')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm text-primary-600 hover:underline font-medium">View All</Link>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.length > 0 ? transactions.map((t) => (
                <div key={t._id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'}`}>
                      {t.type === 'income' ? <TrendingUp className={`w-5 h-5 text-emerald-600`} /> : <TrendingDown className={`w-5 h-5 text-rose-600`} />}
                    </div>
                    <div>
                      <p className="font-semibold">{t.title}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{t.category?.name || 'Uncategorized'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">{format(new Date(t.date), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-500">No transactions found</div>
              )}
            </div>
          </div>
        </div>

        {/* Expense Categories Preview */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Expense by Category</h2>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 h-[400px] flex flex-col justify-center">
            {stats.categoryStats.length > 0 ? (
              <div className="space-y-4">
                {stats.categoryStats.map((cat) => (
                  <div key={cat._id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{cat._id}</span>
                      <span className="text-slate-500">${cat.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${(cat.totalAmount / expense) * 100}%`,
                          backgroundColor: cat.color || '#3b82f6'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add missing import
import { Link } from 'react-router-dom';

export default Dashboard;
