import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUser(user);
                
                // Apply saved theme immediately
                if (user.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            setIsLoading(false);
        };
        checkUserLoggedIn();
    }, []);

    const register = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Sending registration request to:', 'http://localhost:3001/api/users');
            const response = await axios.post('http://localhost:3001/api/users', userData);
            console.log('Registration response:', response.data);
            if (response.data) {
                const completeUserData = {
                    _id: response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                    avatar: response.data.avatar || '',
                    currency: response.data.currency || 'USD',
                    theme: response.data.theme || 'light',
                    token: response.data.token
                };
                localStorage.setItem('user', JSON.stringify(completeUserData));
                setUser(completeUserData);
                
                // Apply theme
                if (completeUserData.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            return response.data;
        } catch (err) {
            console.error('Registration error details:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            
            let errorMsg = 'Registration failed';
            
            // Handle specific error cases
            if (err.response?.status === 400) {
                if (err.response?.data?.message?.includes('already exists')) {
                    errorMsg = 'This email is already registered. Please login instead.';
                } else if (err.response?.data?.message?.includes('all fields')) {
                    errorMsg = 'Please fill in all required fields';
                } else {
                    errorMsg = err.response?.data?.message || 'Invalid registration data';
                }
            } else if (!err.response) {
                errorMsg = 'Unable to connect to server. Please check your connection.';
            }
            
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Sending login request to:', 'http://localhost:3001/api/users/login');
            const response = await axios.post('http://localhost:3001/api/users/login', userData);
            console.log('Login response:', response.data);
            if (response.data) {
                const completeUserData = {
                    _id: response.data._id,
                    name: response.data.name,
                    email: response.data.email,
                    avatar: response.data.avatar || '',
                    currency: response.data.currency || 'USD',
                    theme: response.data.theme || 'light',
                    token: response.data.token
                };
                localStorage.setItem('user', JSON.stringify(completeUserData));
                setUser(completeUserData);
                
                // Apply theme
                if (completeUserData.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            return response.data;
        } catch (err) {
            console.error('Login error details:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            
            let errorMsg = 'Login failed';
            
            // Handle specific error cases
            if (err.response?.status === 400) {
                errorMsg = err.response?.data?.message || 'Invalid email or password';
            } else if (err.response?.status === 401) {
                errorMsg = 'Unauthorized - Invalid credentials';
            } else if (err.response?.status === 404) {
                errorMsg = 'User not found';
            } else if (!err.response) {
                errorMsg = 'Unable to connect to server. Please check your connection.';
            }
            
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setError(null);
    };

    const clearError = () => {
        setError(null);
    };

    const updateUser = (updatedUserData) => {
        // Ensure we have all required fields including token
        const completeUserData = {
            _id: updatedUserData._id,
            name: updatedUserData.name,
            email: updatedUserData.email,
            avatar: updatedUserData.avatar || '',
            currency: updatedUserData.currency || 'USD',
            theme: updatedUserData.theme || 'light',
            token: updatedUserData.token // New token from server
        };
        localStorage.setItem('user', JSON.stringify(completeUserData));
        setUser(completeUserData);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, error, register, login, logout, updateUser, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
