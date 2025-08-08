"use client";
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationFeedbackProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  title?: string;
  className?: string;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export default function ValidationFeedback({
  type,
  message,
  title,
  className,
  showIcon = true,
  dismissible = false,
  onDismiss
}: ValidationFeedbackProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          titleColor: 'text-red-900'
        };
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          titleColor: 'text-green-900'
        };
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-900'
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-900'
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  return (
    <div className={cn(
      'p-4 rounded-lg border',
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <IconComponent className={cn('w-5 h-5 mt-0.5 flex-shrink-0', config.iconColor)} />
        )}
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('text-sm font-medium mb-1', config.titleColor)}>
              {title}
            </h4>
          )}
          <p className={cn('text-sm', config.textColor)}>
            {message}
          </p>
        </div>

        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'p-1 rounded-full hover:bg-black/5 transition-colors',
              config.textColor
            )}
            aria-label="Dismiss message"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
} 