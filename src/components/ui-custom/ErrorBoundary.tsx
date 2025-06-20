
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: (props: { error: Error; resetErrorBoundary: () => void }) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Show a toast notification
    toast.error('An unexpected error occurred. The application will continue to function, but some features may be limited.');
  }

  public resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback({ 
          error: this.state.error, 
          resetErrorBoundary: this.resetErrorBoundary 
        });
      }
      
      return (
        <div className="p-4 border border-red-300 rounded bg-red-50 text-red-800">
          <h2 className="text-lg font-medium">Something went wrong</h2>
          <p className="mt-1">An unexpected error occurred. Please try again later.</p>
          <button
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={this.resetErrorBoundary}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
