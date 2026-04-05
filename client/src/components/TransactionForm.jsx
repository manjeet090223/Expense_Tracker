import { useState, useContext } from 'react';
import GlobalContext from '../context/GlobalContext';

export const TransactionForm = () => {
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Other');
    const [type, setType] = useState('expense');

    const { addTransaction } = useContext(GlobalContext);

    const onSubmit = (e) => {
        e.preventDefault();

        const newTransaction = {
            text,
            amount: type === 'expense' ? -Math.abs(+amount) : +amount,
            category,
            type
        };

        addTransaction(newTransaction);
        setText('');
        setAmount('');
        setCategory('Other');
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Add new transaction</h3>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Type</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="income"
                                checked={type === 'income'}
                                onChange={(e) => setType(e.target.value)}
                                className="text-primary focus:ring-primary"
                            />
                            <span>Income</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="expense"
                                checked={type === 'expense'}
                                onChange={(e) => setType(e.target.value)}
                                className="text-primary focus:ring-primary"
                            />
                            <span>Expense</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label htmlFor="text" className="block text-sm font-medium text-muted-foreground mb-1">
                        Description
                    </label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text..."
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground mb-1">
                        Amount
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount..."
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                    Add Transaction
                </button>
            </form>
        </div>
    );
};
