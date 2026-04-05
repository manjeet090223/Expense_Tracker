import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { email, password } = formData;

    const navigate = useNavigate();
    const { login, error, user, clearError, isLoading } = useContext(AuthContext);


    useEffect(() => {
        if (clearError) {
            clearError();
        }
    }, [clearError]);

    useEffect(() => {
        if (user) {

            navigate('/', { replace: true });
        }
    }, [user, navigate]);


    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log('Login form submitted:', { email, password: '***' });
        try {
            console.log('Calling login function...');
            await login(formData);
            console.log('Login successful');
            toast.success('Login successful! Redirecting...');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl shadow-lg border border-border">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                        Sign in to your account
                    </h2>
                </div>
                {error && (
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground bg-background rounded-t-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground bg-background rounded-b-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
