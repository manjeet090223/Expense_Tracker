import { useContext } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import GlobalContext from '../context/GlobalContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const ExpenseChart = () => {
    const { transactions } = useContext(GlobalContext);


    const expenses = transactions.filter(t => t.type === 'expense');


    const dataObj = expenses.reduce((acc, current) => {
        if (acc[current.category]) {
            acc[current.category] += Math.abs(current.amount);
        } else {
            acc[current.category] = Math.abs(current.amount);
        }
        return acc;
    }, {});

    const data = Object.keys(dataObj).map(key => ({
        name: key,
        value: dataObj[key]
    }));

    if (data.length === 0) {
        return (
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Add expenses to see the chart</p>
            </div>
        )
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border h-80">
            <h3 className="text-lg font-bold mb-4 border-b border-border pb-2">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseChart;
