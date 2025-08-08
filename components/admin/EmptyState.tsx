"use client";
import { Package, Search, Filter, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: 'contributions' | 'products';
  hasFilters: boolean;
  onClearFilters?: () => void;
  onRefresh?: () => void;
  className?: string;
}

export default function EmptyState({ 
  type, 
  hasFilters, 
  onClearFilters, 
  onRefresh,
  className 
}: EmptyStateProps) {
  const getEmptyStateConfig = () => {
    const baseConfig = {
      contributions: {
        icon: Package,
        title: 'No contributions found',
        description: hasFilters 
          ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
          : 'There are no contributions in the system yet.',
        actionText: hasFilters ? 'Clear all filters' : 'Refresh data'
      },
      products: {
        icon: Package,
        title: 'No products found',
        description: hasFilters 
          ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
          : 'There are no products in the marketplace yet.',
        actionText: hasFilters ? 'Clear all filters' : 'Refresh data'
      }
    };

    return baseConfig[type];
  };

  const config = getEmptyStateConfig();
  const IconComponent = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          {hasFilters ? (
            <Search className="w-8 h-8 text-gray-400" />
          ) : (
            <IconComponent className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {config.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-6">
          {config.description}
        </p>

        <div className="flex gap-3">
          {hasFilters && onClearFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear filters
            </Button>
          )}
          
          {onRefresh && (
            <Button
              onClick={onRefresh}
              className="flex items-center gap-2"
            >
              <IconComponent className="w-4 h-4" />
              {config.actionText}
            </Button>
          )}
        </div>

        {hasFilters && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-800">
                  No results match your current filters
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Try removing some filters or broadening your search criteria
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 