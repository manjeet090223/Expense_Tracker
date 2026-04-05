import { useContext, useEffect } from 'react';
import GlobalContext from '../context/GlobalContext';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Skeleton } from './ui/Skeleton';

const DashboardAnalytics = ({ currency = '$' }) => {
    const { getAnalytics, analytics, loading } = useContext(GlobalContext);

    useEffect(() => {
        getAnalytics();
    }, []);

    if (loading && !analytics.monthlyStats.length) {
        return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
        </div>;
    }

   
    const chartData = analytics.monthlyStats.reduce((acc, curr) => {
        const key = `${curr._id.year}-${curr._id.month}`;
        if (!acc[key]) {
            acc[key] = { name: new Date(curr._id.year, curr._id.month - 1).toLocaleString('default', { month: 'short' }), Income: 0, Expense: 0 };
        }
        if (curr._id.type === 'income') acc[key].Income += curr.total;
        if (curr._id.type === 'expense') acc[key].Expense += curr.total;
        return acc;
    }, {});

    const formattedMonthlyData = Object.values(chartData);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Financial Activity</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={formattedMonthlyData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${currency}${val}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Area type="monotone" dataKey="Income" stackId="1" stroke="#4ade80" fill="#4ade80" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="Expense" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>


            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Expense Breakdown</h3>
                <div className="h-72 w-full flex items-center justify-center">
                    {analytics.categoryStats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.categoryStats}
                                    dataKey="total"
                                    nameKey="_id"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {analytics.categoryStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => `${currency}${value}`}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-muted-foreground">No expense data yet</p>
                    )}
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {analytics.categoryStats.map((cat, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                            <span>{cat._id}: {currency}{cat.total}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardAnalytics;
