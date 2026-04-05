import { useEffect, useState } from 'react';

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleError = (event) => {
            console.error('ErrorBoundary caught error:', event.error);
            setHasError(true);
            setError(event.error);
        };

        const handleRejection = (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            setHasError(true);
            setError(event.reason);
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    if (hasError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full bg-card rounded-lg shadow-lg border border-border p-6">
                    <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
                    <pre className="bg-background p-4 rounded text-sm overflow-auto mb-4 max-h-48 text-foreground">
                        {error?.message || 'Unknown error'}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default ErrorBoundary;
