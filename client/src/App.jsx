import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, default as AuthContext } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import { useContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import AddTransaction from './pages/AddTransaction';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';


const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user]);

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <Toaster position="top-right" />
            <Navbar />
            <Routes>
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/transactions" element={
                <PrivateRoute>
                  <TransactionsPage />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/add-transaction" element={
                <PrivateRoute>
                  <AddTransaction />
                </PrivateRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
}

export default App;
