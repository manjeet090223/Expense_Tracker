import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut, LayoutDashboard, List, User } from 'lucide-react';
import { cn } from '../lib/utils';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="Expense Tracker Logo"
                            className="w-10 h-10 object-contain dark:invert rounded-full"
                        />
                        <span className="font-bold text-xl text-foreground tracking-tight">ExpenseTracker</span>
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-1 md:gap-4">
                            <div className="hidden md:flex items-center gap-1 mr-4">
                                <Link
                                    to="/"
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive('/') ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                    )}
                                >
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                                <Link
                                    to="/transactions"
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive('/transactions') ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                    )}
                                >
                                    <List className="w-4 h-4" /> Transactions
                                </Link>
                            </div>

                            <div className="flex items-center gap-2 border-l border-border pl-4">
                                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
                                        {user.avatar && user.avatar !== '' ? (
                                            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-bold text-primary">{(user.name || 'U').charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <span className="hidden md:block text-sm font-medium text-foreground">{user.name || 'User'}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="ml-2 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Login</Link>
                            <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium shadow-sm">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
