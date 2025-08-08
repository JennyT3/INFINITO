"use client";
import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
  loading?: boolean;
  disabled?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
  disabled = false
}: ConfirmationDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error in confirmation action:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          bgColor: 'bg-red-50'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          bgColor: 'bg-yellow-50'
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-blue-600',
          buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          bgColor: 'bg-blue-50'
        };
    }
  };

  const variantStyles = getVariantStyles();
  const IconComponent = variantStyles.icon;
  const isDisabled = disabled || loading || isProcessing;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${variantStyles.bgColor}`}>
              <IconComponent className={`w-5 h-5 ${variantStyles.iconColor}`} />
            </div>
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 justify-end mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDisabled}
            className="min-w-[80px]"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isDisabled}
            className={`min-w-[80px] ${variantStyles.buttonColor}`}
          >
            {isProcessing || loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 