"use client";
import { X } from 'lucide-react';
import { FilterOptions } from './AdvancedFilters';

interface ActiveFiltersChipsProps {
  filters: FilterOptions;
  onRemoveFilter: (key: keyof FilterOptions, value?: string) => void;
}

export default function ActiveFiltersChips({ filters, onRemoveFilter }: ActiveFiltersChipsProps) {
  const getActiveFilters = () => {
    const active: Array<{ key: keyof FilterOptions; label: string; value: string }> = [];

    // Search filter
    if (filters.search) {
      active.push({ key: 'search', label: 'Search', value: filters.search });
    }

    // Type filter
    if (filters.type) {
      active.push({ key: 'type', label: 'Type', value: filters.type });
    }

    // Status filter
    if (filters.status) {
      active.push({ key: 'status', label: 'Status', value: filters.status });
    }

    // Classification filter
    if (filters.classification) {
      active.push({ key: 'classification', label: 'Classification', value: filters.classification });
    }

    // Destination filter
    if (filters.destination) {
      active.push({ key: 'destination', label: 'Destination', value: filters.destination });
    }

    // Decision filter
    if (filters.decision) {
      active.push({ key: 'decision', label: 'Decision', value: filters.decision });
    }

    // Date range filters
    if (filters.dateRange.start || filters.dateRange.end) {
      if (filters.dateRange.start && filters.dateRange.end) {
        active.push({ 
          key: 'dateRange', 
          label: 'Date Range', 
          value: `${filters.dateRange.start} to ${filters.dateRange.end}` 
        });
      } else if (filters.dateRange.start) {
        active.push({ 
          key: 'dateRange', 
          label: 'From Date', 
          value: filters.dateRange.start 
        });
      } else if (filters.dateRange.end) {
        active.push({ 
          key: 'dateRange', 
          label: 'To Date', 
          value: filters.dateRange.end 
        });
      }
    }

    // Price range filters
    if (filters.priceRange.min || filters.priceRange.max) {
      if (filters.priceRange.min && filters.priceRange.max) {
        active.push({ 
          key: 'priceRange', 
          label: 'Price Range', 
          value: `€${filters.priceRange.min} - €${filters.priceRange.max}` 
        });
      } else if (filters.priceRange.min) {
        active.push({ 
          key: 'priceRange', 
          label: 'Min Price', 
          value: `€${filters.priceRange.min}+` 
        });
      } else if (filters.priceRange.max) {
        active.push({ 
          key: 'priceRange', 
          label: 'Max Price', 
          value: `€${filters.priceRange.max}-` 
        });
      }
    }

    // Verified filter
    if (filters.verified) {
      active.push({ 
        key: 'verified', 
        label: 'Verification', 
        value: filters.verified === 'true' ? 'Verified' : 'Not Verified' 
      });
    }

    // Certificate filter
    if (filters.hasCertificate) {
      active.push({ 
        key: 'hasCertificate', 
        label: 'Certificate', 
        value: filters.hasCertificate === 'true' ? 'Has Certificate' : 'No Certificate' 
      });
    }

    return active;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  const handleRemoveFilter = (filter: { key: keyof FilterOptions; label: string; value: string }) => {
    if (filter.key === 'dateRange') {
      onRemoveFilter('dateRange');
    } else if (filter.key === 'priceRange') {
      onRemoveFilter('priceRange');
    } else {
      onRemoveFilter(filter.key);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Active filters:</span>
        {activeFilters.map((filter, index) => (
          <div
            key={`${filter.key}-${index}`}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200"
          >
            <span className="text-xs text-blue-600">{filter.label}:</span>
            <span>{filter.value}</span>
            <button
              onClick={() => handleRemoveFilter(filter)}
              className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 