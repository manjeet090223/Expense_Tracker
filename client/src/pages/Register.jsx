import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { name, email, password, confirmPassword } = formData;
    const [localError, setLocalError] = useState('');

    const navigate = useNavigate();
    const { register, error, user, clearError, isLoading } = useContext(AuthContext);


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
        setLocalError('');
        
        console.log('Registration form submitted:', { name, email, password: '***', confirmPassword: '***' });
        
        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        try {
            console.log('Calling register function...');
            await register({ name, email, password });
            console.log('Registration successful');
            toast.success('Account created successfully! Redirecting...');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl shadow-lg border border-border">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                        Create your account
                    </h2>
                </div>
                {(error || localError) && (
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error || localError}</span>
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground bg-background rounded-t-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                                value={name}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground bg-background focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground bg-background focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground bg-background rounded-b-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                value={confirmPassword}
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
                            {isLoading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
