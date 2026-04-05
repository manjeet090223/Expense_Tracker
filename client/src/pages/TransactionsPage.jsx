import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../context/GlobalContext';
import AuthContext from '../context/AuthContext';
import { getCurrencySymbol } from '../lib/utils';
import Modal from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { Search, Trash2, Edit2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TransactionsPage = () => {
    const navigate = useNavigate();
    const { transactions, getTransactions, deleteTransaction, updateTransaction, pagination, loading } = useContext(GlobalContext);
    const { user } = useContext(AuthContext);
    const currency = getCurrencySymbol(user?.currency);


    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);


    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchTransactions();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [keyword, category, type, page]);

    const fetchTransactions = () => {
        getTransactions({
            keyword,
            category,
            type,
            page,
            limit: 10
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await deleteTransaction(id);
                toast.success("Transaction deleted");

                fetchTransactions();
            } catch (error) {
                toast.error("Failed to delete transaction");
            }
        }
    };

    const handleEditClick = (transaction) => {
        setCurrentTransaction(transaction);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
       
            const updatedData = {
                text: currentTransaction.text,
                amount: Number(currentTransaction.amount),
                category: currentTransaction.category
            };

            await updateTransaction(currentTransaction._id, updatedData);
            setIsEditModalOpen(false);
            toast.success("Transaction updated");
            fetchTransactions();
        } catch (error) {
            toast.error("Failed to update transaction");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
                <button
                    onClick={() => navigate('/add-transaction')}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Add New
                </button>
            </div>


            <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Rent">Rent</option>
                        <option value="Travel">Travel</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Income">Income</option>
                        <option value="Other">Other</option>
                    </select>

                    <select
                        className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </div>


            <div className="space-y-4">
                {loading ? (
                    Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                ) : transactions.length > 0 ? (
                    transactions.map((t) => (
                        <div key={t._id} className="bg-card p-4 rounded-lg shadow-sm border border-border flex justify-between items-center group">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-12 rounded-full ${t.amount > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                <div>
                                    <h3 className="font-semibold text-foreground">{t.text}</h3>
                                    <p className="text-sm text-muted-foreground">{t.category} • {format(new Date(t.date), 'MMM dd, yyyy')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.amount > 0 ? '+' : '-'}{currency}{Math.abs(t.amount)}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditClick(t)} className="p-2 hover:bg-muted rounded-full text-foreground"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(t._id)} className="p-2 hover:bg-destructive/10 rounded-full text-destructive"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">No transactions found matching your filters.</div>
                )}
            </div>


            {pagination.pages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="p-2 border border-input rounded-md disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="flex items-center px-4 font-medium">Page {page} of {pagination.pages}</span>
                    <button
                        disabled={page === pagination.pages}
                        onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                        className="p-2 border border-input rounded-md disabled:opacity-50"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}


            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Transaction">
                {currentTransaction && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <input
                                type="text"
                                value={currentTransaction.text}
                                onChange={(e) => setCurrentTransaction({ ...currentTransaction, text: e.target.value })}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount</label>
                            <input
                                type="number"
                                value={currentTransaction.amount}
                                onChange={(e) => setCurrentTransaction({ ...currentTransaction, amount: e.target.value })}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                value={currentTransaction.category}
                                onChange={(e) => setCurrentTransaction({ ...currentTransaction, category: e.target.value })}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                            >
                                <option value="Food">Food</option>
                                <option value="Rent">Rent</option>
                                <option value="Travel">Travel</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Health">Health</option>
                                <option value="Income">Income</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90">
                            Save Changes
                        </button>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default TransactionsPage;
