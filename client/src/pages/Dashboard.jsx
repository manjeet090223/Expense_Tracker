import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../context/GlobalContext';
import AuthContext from '../context/AuthContext';
import DashboardAnalytics from '../components/DashboardAnalytics';
import { Plus, ArrowRight } from 'lucide-react';
import { getCurrencySymbol } from '../lib/utils';

const Dashboard = () => {
    const { transactions, getTransactions, getAnalytics } = useContext(GlobalContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {

        getTransactions({ limit: 5 }); 
        getAnalytics();
    }, []); 

    let totalIncome = 0;
    let totalExpense = 0;

    const { analytics } = useContext(GlobalContext);

    if (analytics && analytics.monthlyStats) {
        analytics.monthlyStats.forEach(stat => {
            if (stat._id.type === 'income') totalIncome += stat.total;
            if (stat._id.type === 'expense') totalExpense += Math.abs(stat.total);
        });
    }

    const totalBalance = totalIncome - totalExpense;
    const currency = getCurrencySymbol(user?.currency);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user && user.name}</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                    <button onClick={() => navigate('/transactions')} className="flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                        View History
                    </button>
                    <button onClick={() => navigate('/add-transaction')} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> Add New
                    </button>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Balance</h3>
                    <p className="text-3xl font-bold mt-2 text-foreground">{currency}{totalBalance.toFixed(2)}</p>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Income</h3>
                    <p className="text-3xl font-bold mt-2 text-green-500">+{currency}{totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Expense</h3>
                    <p className="text-3xl font-bold mt-2 text-red-500">-{currency}{totalExpense.toFixed(2)}</p>
                </div>
            </div>


            <DashboardAnalytics currency={currency} />


            <div className="bg-card rounded-lg shadow-sm border border-border">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
                    <button onClick={() => navigate('/transactions')} className="text-sm text-primary hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="p-6">
                    {transactions.length > 0 ? (
                        <div className="space-y-4">
                            {transactions.map(t => (
                                <div key={t._id} className="flex justify-between items-center py-2 border-b border-border last:border-0 hover:bg-muted/50 p-2 rounded-md transition-colors">
                                    <div>
                                        <p className="font-medium text-foreground">{t.text}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`font-bold ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.amount > 0 ? '+' : '-'}{currency}{Math.abs(t.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No recent transactions</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
