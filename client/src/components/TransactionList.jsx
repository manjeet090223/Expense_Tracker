import { useContext, useEffect } from 'react';
import GlobalContext from '../context/GlobalContext';
import AuthContext from '../context/AuthContext';
import { cn, getCurrencySymbol } from '../lib/utils';
import { Trash2 } from 'lucide-react';

export const TransactionList = () => {
    const { transactions, getTransactions, deleteTransaction } = useContext(GlobalContext);
    const { user } = useContext(AuthContext);
    const currency = getCurrencySymbol(user?.currency);

    useEffect(() => {
        getTransactions();
    }, []);

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">History</h3>
            <ul className="space-y-3">
                {transactions.map((transaction) => (
                    <li
                        key={transaction._id}
                        className={cn(
                            "flex justify-between items-center p-3 rounded-md border border-border bg-background shadow-sm relative group",
                            transaction.amount < 0 ? "border-r-4 border-r-red-500" : "border-r-4 border-r-green-500"
                        )}
                    >
                        <div>
                            <span className="font-medium text-foreground block">{transaction.text}</span>
                            <span className="text-xs text-muted-foreground">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={transaction.amount < 0 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                                {transaction.amount < 0 ? '-' : '+'}{currency}{Math.abs(transaction.amount)}
                            </span>
                            <button
                                onClick={() => deleteTransaction(transaction._id)}
                                className="text-destructive hover:text-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </li>
                ))}
                {transactions.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No transactions found.</p>
                )}
            </ul>
        </div>
    );
};
