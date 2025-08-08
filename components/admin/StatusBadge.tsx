"use client";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, XCircle, Package, Palette, Recycle, Gift } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  type?: 'status' | 'classification' | 'type' | 'decision';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export default function StatusBadge({ 
  status, 
  type = 'status',
  size = 'md',
  showIcon = true,
  className 
}: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (type) {
      case 'status':
        return {
          pendiente: { 
            label: 'Pending', 
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: Clock
          },
          entregado: { 
            label: 'Delivered', 
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: Package
          },
          verificado: { 
            label: 'Verified', 
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: CheckCircle
          },
          certificado_disponible: { 
            label: 'Certified', 
            color: 'bg-purple-100 text-purple-800 border-purple-200',
            icon: CheckCircle
          },
          published: { 
            label: 'Published', 
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: CheckCircle
          },
          sold: { 
            label: 'Sold', 
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: CheckCircle
          },
          draft: { 
            label: 'Draft', 
            color: 'bg-gray-100 text-gray-800 border-gray-200',
            icon: Clock
          },
          inactive: { 
            label: 'Inactive', 
            color: 'bg-red-100 text-red-800 border-red-200',
            icon: XCircle
          }
        };
      
      case 'classification':
        return {
          reutilizable: { 
            label: 'Reusable', 
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: Package
          },
          reparable: { 
            label: 'Repairable', 
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            icon: Palette
          },
          reciclable: { 
            label: 'Recyclable', 
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: Recycle
          }
        };
      
      case 'type':
        return {
          clothing: { 
            label: 'Clothing', 
            color: 'bg-pink-100 text-pink-800 border-pink-200',
            icon: Package
          },
          art: { 
            label: 'Art', 
            color: 'bg-purple-100 text-purple-800 border-purple-200',
            icon: Palette
          },
          recycle: { 
            label: 'Recycle', 
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: Recycle
          },
          receive: { 
            label: 'Receive', 
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: Gift
          }
        };
      
      case 'decision':
        return {
          donar: { 
            label: 'Donate', 
            color: 'bg-blue-100 text-blue-800 border-blue-200',
            icon: Gift
          },
          vender: { 
            label: 'Sell', 
            color: 'bg-green-100 text-green-800 border-green-200',
            icon: Package
          }
        };
      
      default:
        return {};
    }
  };

  const statusConfig = getStatusConfig();
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium",
        "bg-gray-100 text-gray-800 border-gray-200",
        size === 'lg' && "px-3 py-1.5 text-sm",
        size === 'sm' && "px-1.5 py-0.5 text-xs",
        className
      )}>
        {status}
      </span>
    );
  }

  const IconComponent = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium",
      config.color,
      size === 'lg' && "px-3 py-1.5 text-sm",
      size === 'sm' && "px-1.5 py-0.5 text-xs",
      className
    )}>
      {showIcon && <IconComponent className="w-3 h-3" />}
      {config.label}
    </span>
  );
} 