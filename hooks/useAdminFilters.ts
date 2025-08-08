import { useState, useMemo } from 'react';
import { FilterOptions } from '@/components/admin/AdvancedFilters';

export function useAdminFilters<T extends Record<string, any>>(
  data: T[],
  type: 'contributions' | 'products'
) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    type: '',
    status: '',
    classification: '',
    destination: '',
    decision: '',
    dateRange: { start: '', end: '' },
    priceRange: { min: '', max: '' },
    verified: '',
    hasCertificate: '',
    method: '',
    seller: '',
    material: '',
    color: '',
    size: '',
    condition: '',
    country: '',
    totalItems: { min: '', max: '' },
    impactRange: { co2Min: '', co2Max: '', waterMin: '', waterMax: '' }
  });

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          item.tracking || '',
          item.name || item.nome || '',
          item.tipo || item.type || '',
          item.sellerName || item.seller || '',
          item.garmentType || '',
          item.material || '',
          item.color || '',
          item.size || ''
        ];
        
        const matchesSearch = searchableFields.some(field => 
          field.toLowerCase().includes(searchLower)
        );
        
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type && item.tipo !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status) {
        const itemStatus = item.status || item.trackingState || item.estado;
        if (itemStatus !== filters.status) {
          return false;
        }
      }

      // Classification filter (contributions only)
      if (type === 'contributions' && filters.classification && item.classification !== filters.classification) {
        return false;
      }

      // Destination filter (contributions only)
      if (type === 'contributions' && filters.destination && item.destination !== filters.destination) {
        return false;
      }

      // Decision filter (contributions only)
      if (type === 'contributions' && filters.decision && item.decision !== filters.decision) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const itemDate = new Date(item.fecha || item.createdAt || item.publishedAt || '');
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
      }

      // Price range filter (products only)
      if (type === 'products' && (filters.priceRange.min || filters.priceRange.max)) {
        const price = parseFloat(item.price || '0');
        const minPrice = filters.priceRange.min ? parseFloat(filters.priceRange.min) : 0;
        const maxPrice = filters.priceRange.max ? parseFloat(filters.priceRange.max) : Infinity;

        if (price < minPrice || price > maxPrice) return false;
      }

      // Verified filter (contributions only)
      if (type === 'contributions' && filters.verified) {
        const isVerified = item.verified === true || item.verified === 'true';
        if (filters.verified === 'true' && !isVerified) return false;
        if (filters.verified === 'false' && isVerified) return false;
      }

      // Certificate filter (contributions only)
      if (type === 'contributions' && filters.hasCertificate) {
        const hasCertificate = !!item.certificateHash;
        if (filters.hasCertificate === 'true' && !hasCertificate) return false;
        if (filters.hasCertificate === 'false' && hasCertificate) return false;
      }

      return true;
    });
  }, [data, filters, type]);

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const removeFilter = (key: keyof FilterOptions) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (key === 'dateRange') {
        newFilters.dateRange = { start: '', end: '' };
      } else if (key === 'priceRange') {
        newFilters.priceRange = { min: '', max: '' };
      } else {
        (newFilters as any)[key] = '';
      }
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      classification: '',
      destination: '',
      decision: '',
      dateRange: { start: '', end: '' },
      priceRange: { min: '', max: '' },
      verified: '',
      hasCertificate: '',
      method: '',
      seller: '',
      material: '',
      color: '',
      size: '',
      condition: '',
      country: '',
      totalItems: { min: '', max: '' },
      impactRange: { co2Min: '', co2Max: '', waterMin: '', waterMax: '' }
    });
  };

  // Get filter statistics
  const filterStats = useMemo(() => {
    const total = data.length;
    const filtered = filteredData.length;
    const activeFilters = Object.values(filters).filter(value => {
      if (typeof value === 'string') return value !== '';
      if (typeof value === 'object') {
        return Object.values(value).some(v => v !== '');
      }
      return false;
    }).length;

    return {
      total,
      filtered,
      activeFilters,
      hasFilters: activeFilters > 0
    };
  }, [data.length, filteredData.length, filters]);

  return {
    filters,
    filteredData,
    updateFilters,
    removeFilter,
    clearFilters,
    filterStats
  };
} 