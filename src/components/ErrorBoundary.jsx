import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            errorInfo: null,
            customMessage: ''
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Tool crashed:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-red-100 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-red-900">
                        A Tool Crashed
                    </h2>
                    <p className="max-w-md text-red-700">
                        Don't worry, the rest of the application is fine! Switch to a different tool from the sidebar.
                    </p>
                    <button
                        onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
                        className="px-6 py-3 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700">
                        Return to Dashboard Safe
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
