"use client";
import React from 'react';
import { AlertCircle, Wifi, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface ErrorAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// Main error component
export function InfinitoError({
  title = "Something went wrong",
  message,
  actions = []
}: {
  title?: string;
  message: string;
  actions?: ErrorAction[];
}) {
  const router = useRouter();

  const defaultActions: ErrorAction[] = [
    {
      label: "Try Again",
      onClick: () => window.location.reload(),
      variant: 'primary'
    },
    {
      label: "Go Home",
      onClick: () => router.push('/dashboard'),
      variant: 'secondary'
    }
  ];

  const finalActions = actions.length > 0 ? actions : defaultActions;

  return (
    <div className="infinito-card max-w-md mx-auto text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {title}
      </h3>

      <p className="text-gray-600 mb-6">
        {message}
      </p>

      <div className="space-y-3">
        {finalActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`w-full px-6 py-3 rounded-xl font-medium transition-all ${
              action.variant === 'primary' 
                ? 'infinito-button infinito-green text-white'
                : 'infinito-glass text-gray-700 hover:bg-white/30'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Network error
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <InfinitoError
      title="Connection Error"
      message="Please check your internet connection and try again."
      actions={[
        {
          label: "Try Again",
          onClick: onRetry || (() => window.location.reload()),
          variant: 'primary'
        }
      ]}
    />
  );
}

// 404 error
export function NotFoundError() {
  const router = useRouter();

  return (
    <InfinitoError
      title="Page Not Found"
      message="The page you're looking for doesn't exist."
      actions={[
        {
          label: "Go Home",
          onClick: () => router.push('/dashboard'),
          variant: 'primary'
        }
      ]}
    />
  );
}

// Simple error hook
export function useErrorHandler() {
  const [error, setError] = React.useState<string | null>(null);

  const handleError = React.useCallback((error: Error) => {
    setError(error.message);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError
  };
}
