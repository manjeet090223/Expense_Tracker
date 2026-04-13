import { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const AppReducer = (state, action) => {
    switch (action.type) {
        case 'GET_TRANSACTIONS':
            return {
                ...state,
                loading: false,
                transactions: action.payload.transactions,
                pagination: {
                    page: action.payload.page,
                    pages: action.payload.pages,
                    total: action.payload.total
                }
            };
        case 'GET_ANALYTICS':
            return {
                ...state,
                loading: false,
                analytics: action.payload
            };
        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(
                    (transaction) => transaction._id !== action.payload
                ),
            };
        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
            };
        case 'UPDATE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.map(t => t._id === action.payload._id ? action.payload : t)
            };
        case 'TRANSACTION_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
};

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const initialState = {
        transactions: [],
        analytics: {
            categoryStats: [],
            monthlyStats: []
        },
        pagination: {
            page: 1,
            pages: 1,
            total: 0
        },
        error: null,
        loading: true,
    };

    const [state, dispatch] = useReducer(AppReducer, initialState);
    const { user, logout } = useContext(AuthContext);

    // Helper to get token
    const config = () => {
        return {
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        }
    }

    async function getTransactions(params = {}) {
        try {
            // dispatch({ type: 'SET_LOADING' }); // Optional: loading state for refetch
            const query = new URLSearchParams(params).toString();
            const res = await axios.get(`http://localhost:3001/api/transactions?${query}`, config());

            dispatch({
                type: 'GET_TRANSACTIONS',
                payload: res.data,
            });
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
            }
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Error fetching transactions',
            });
        }
    }

    async function getAnalytics() {
        try {
            const res = await axios.get('http://localhost:3001/api/transactions/analytics', config());
            dispatch({
                type: 'GET_ANALYTICS',
                payload: res.data,
            });
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
            }
            console.error("Analytics Error", err);
        }
    }

    async function deleteTransaction(id) {
        try {
            await axios.delete(`http://localhost:3001/api/transactions/${id}`, config());

            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: id,
            });
            getAnalytics();
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
            }
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Error deleting transaction',
            });
        }
    }

    async function addTransaction(transaction) {
        try {
            const res = await axios.post('http://localhost:3001/api/transactions', transaction, config());

            dispatch({
                type: 'ADD_TRANSACTION',
                payload: res.data,
            });
            // Refresh analytics
            getAnalytics();
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
            }
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Error adding transaction',
            });
        }
    }

    async function updateTransaction(id, updatedData) {
        try {
            const res = await axios.put(`http://localhost:3001/api/transactions/${id}`, updatedData, config());
            dispatch({
                type: 'UPDATE_TRANSACTION',
                payload: res.data,
            });
            getAnalytics();
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
            }
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Error updating transaction',
            });
        }
    }

    return (
        <GlobalContext.Provider
            value={{
                transactions: state.transactions,
                analytics: state.analytics,
                pagination: state.pagination,
                error: state.error,
                loading: state.loading,
                getTransactions,
                getAnalytics,
                deleteTransaction,
                addTransaction,
                updateTransaction
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalContext;
