import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalContext from '../context/GlobalContext';
import { ChevronLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const AddTransaction = () => {
    const navigate = useNavigate();
    const { addTransaction } = useContext(GlobalContext);

    const [formData, setFormData] = useState({
        text: '',
        amount: '',
        type: 'expense',
        category: 'Food', 
        date: new Date().toISOString().split('T')[0], 
        note: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.text || !formData.amount) {
            toast.error("Please fill in required fields");
            return;
        }

        const newTransaction = {
            text: formData.text,
            amount: formData.type === 'expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)),
            category: formData.category,
            type: formData.type,
            date: formData.date
        };

        try {
            await addTransaction(newTransaction);
            toast.success("Transaction added successfully");
            navigate('/transactions'); 
        } catch (error) {
            toast.error("Failed to add transaction");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>

            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-bold text-foreground">Add New Transaction</h1>
                    <p className="text-muted-foreground mt-1">Record your income or expense</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <div>
                        <label className="block text-sm font-medium mb-3 text-foreground">Transaction Type</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 cursor-pointer border rounded-md p-4 flex items-center justify-center transition-all ${formData.type === 'expense' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input hover:border-muted-foreground/50'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="expense"
                                    checked={formData.type === 'expense'}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <span className="font-semibold text-red-500">Expense</span>
                            </label>
                            <label className={`flex-1 cursor-pointer border rounded-md p-4 flex items-center justify-center transition-all ${formData.type === 'income' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input hover:border-muted-foreground/50'}`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="income"
                                    checked={formData.type === 'income'}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <span className="font-semibold text-green-500">Income</span>
                            </label>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Description</label>
                            <input
                                type="text"
                                name="text"
                                placeholder="e.g. Grocery Shopping"
                                value={formData.text}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Amount</label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 font-medium transition-colors shadow-sm">
                            <Save className="w-4 h-4" /> Save Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransaction;
