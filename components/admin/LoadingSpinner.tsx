"use client";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
  text?: string;
  showText?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className,
  text = 'Loading...',
  showText = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variantClasses = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-gray-300 border-t-current",
            sizeClasses[size],
            variantClasses[variant]
          )}
          role="status"
          aria-label="Loading"
        />
        {showText && (
          <span className="text-sm text-gray-600 animate-pulse">
            {text}
          </span>
        )}
      </div>
    </div>
  );
} 