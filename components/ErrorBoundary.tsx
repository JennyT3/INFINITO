"use client";
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { InfinitoError } from './ErrorComponents';
import logger from '../lib/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `ERR_${Date.now()}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React Error Boundary', 'ERROR_BOUNDARY', error, {
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <InfinitoError
            title="Something went wrong"
            message="An unexpected error occurred. Please try again."
            actions={[
              {
                label: "Try Again",
                onClick: this.resetError,
                variant: 'primary'
              },
              {
                label: "Go Home",
                onClick: () => window.location.href = '/dashboard',
                variant: 'secondary'
              }
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple HOC wrapper
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
) {
  return (props: P) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
