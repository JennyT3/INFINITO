"use client";
import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, RefreshCw, Calendar, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface FilterOptions {
  search: string;
  type: string;
  status: string;
  classification: string;
  destination: string;
  decision: string;
  dateRange: {
    start: string;
    end: string;
  };
  priceRange: {
    min: string;
    max: string;
  };
  verified: string;
  hasCertificate: string;
  // New filters
  method: string;
  seller: string;
  material: string;
  color: string;
  size: string;
  condition: string;
  country: string;
  totalItems: {
    min: string;
    max: string;
  };
  impactRange: {
    co2Min: string;
    co2Max: string;
    waterMin: string;
    waterMax: string;
  };
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  filters: FilterOptions;
  type: 'contributions' | 'products';
  loading?: boolean;
  onRefresh?: () => void;
  totalItems?: number;
  filteredItems?: number;
}

export default function AdvancedFilters({ 
  onFiltersChange, 
  filters, 
  type, 
  loading = false,
  onRefresh,
  totalItems = 0,
  filteredItems = 0
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  // Apply filters when local filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [localFilters, onFiltersChange]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
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
    };
    setLocalFilters(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => {
    if (typeof value === 'string') return value !== '';
    if (typeof value === 'object') {
      return Object.values(value).some(v => v !== '');
    }
    return false;
  });

  // Options for different filter types
  const typeOptions = [
    { value: 'clothing', label: 'Clothing', color: 'bg-pink-100 text-pink-800' },
    { value: 'art', label: 'Art', color: 'bg-purple-100 text-purple-800' },
    { value: 'recycle', label: 'Recycle', color: 'bg-green-100 text-green-800' },
    { value: 'receive', label: 'Receive', color: 'bg-blue-100 text-blue-800' }
  ];

  const statusOptions = [
    { value: 'pendiente', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'entregado', label: 'Delivered', color: 'bg-blue-100 text-blue-800' },
    { value: 'verificado', label: 'Verified', color: 'bg-green-100 text-green-800' },
    { value: 'certificado_disponible', label: 'Certified', color: 'bg-purple-100 text-purple-800' }
  ];

  const productStatusOptions = [
    { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800' },
    { value: 'sold', label: 'Sold', color: 'bg-blue-100 text-blue-800' },
    { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    { value: 'inactive', label: 'Inactive', color: 'bg-red-100 text-red-800' }
  ];

  const classificationOptions = [
    { value: 'reutilizable', label: 'Reusable', color: 'bg-green-100 text-green-800' },
    { value: 'reparable', label: 'Repairable', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'reciclable', label: 'Recyclable', color: 'bg-blue-100 text-blue-800' }
  ];

  const destinationOptions = [
    { value: 'marketplace', label: 'Marketplace', color: 'bg-green-100 text-green-800' },
    { value: 'donacion', label: 'Donation', color: 'bg-blue-100 text-blue-800' },
    { value: 'artistas', label: 'Artists', color: 'bg-purple-100 text-purple-800' },
    { value: 'reciclaje', label: 'Recycling', color: 'bg-orange-100 text-orange-800' }
  ];

  const decisionOptions = [
    { value: 'donar', label: 'Donate', color: 'bg-blue-100 text-blue-800' },
    { value: 'vender', label: 'Sell', color: 'bg-green-100 text-green-800' }
  ];

  const methodOptions = [
    { value: 'pickup', label: 'Pickup', color: 'bg-blue-100 text-blue-800' },
    { value: 'home', label: 'Home Collection', color: 'bg-green-100 text-green-800' }
  ];

  const materialOptions = [
    { value: 'cotton', label: 'Cotton' },
    { value: 'polyester', label: 'Polyester' },
    { value: 'denim', label: 'Denim' },
    { value: 'silk', label: 'Silk' },
    { value: 'wool', label: 'Wool' },
    { value: 'linen', label: 'Linen' }
  ];

  const colorOptions = [
    { value: 'blue', label: 'Blue' },
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' }
  ];

  const sizeOptions = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' }
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const countryOptions = [
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Spain', label: 'Spain' },
    { value: 'Italy', label: 'Italy' },
    { value: 'France', label: 'France' },
    { value: 'Germany', label: 'Germany' },
    { value: 'UK', label: 'UK' }
  ];

  const verifiedOptions = [
    { value: 'true', label: 'Verified', icon: CheckCircle },
    { value: 'false', label: 'Not Verified', icon: AlertCircle }
  ];

  const certificateOptions = [
    { value: 'true', label: 'Has Certificate', icon: CheckCircle },
    { value: 'false', label: 'No Certificate', icon: AlertCircle }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          
          {/* Results counter */}
          <div className="text-sm text-gray-600">
            {hasActiveFilters ? (
              <span>
                Showing <span className="font-medium">{filteredItems}</span> of{' '}
                <span className="font-medium">{totalItems}</span> {type}
              </span>
            ) : (
              <span>
                <span className="font-medium">{totalItems}</span> {type} total
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
          
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                More
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={`Search ${type}...`}
            value={localFilters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type */}
        <Select value={localFilters.type} onValueChange={(value) => updateFilter('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {typeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Badge color="green" className={option.color}>
                    {option.label}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={localFilters.status} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            {(type === 'contributions' ? statusOptions : productStatusOptions).map(option => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Badge color="green" className={option.color}>
                    {option.label}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Method (Contributions only) */}
        {type === 'contributions' && (
          <Select value={localFilters.method} onValueChange={(value) => updateFilter('method', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Methods</SelectItem>
              {methodOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Badge color="green" className={option.color}>
                      {option.label}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            
            {/* Contributions specific filters */}
            {type === 'contributions' && (
              <>
                {/* Classification */}
                <Select value={localFilters.classification} onValueChange={(value) => updateFilter('classification', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Classifications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classifications</SelectItem>
                    {classificationOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Badge color="green" className={option.color}>
                            {option.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Destination */}
                <Select value={localFilters.destination} onValueChange={(value) => updateFilter('destination', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Destinations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Destinations</SelectItem>
                    {destinationOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Badge color="green" className={option.color}>
                            {option.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Decision */}
                <Select value={localFilters.decision} onValueChange={(value) => updateFilter('decision', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Decisions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Decisions</SelectItem>
                    {decisionOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Badge color="green" className={option.color}>
                            {option.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Verified */}
                <Select value={localFilters.verified} onValueChange={(value) => updateFilter('verified', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Verification Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    {verifiedOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Has Certificate */}
                <Select value={localFilters.hasCertificate} onValueChange={(value) => updateFilter('hasCertificate', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Certificate Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    {certificateOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Total Items Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Total Items</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      value={localFilters.totalItems.min}
                      onChange={(e) => updateFilter('totalItems', { ...localFilters.totalItems, min: e.target.value })}
                      type="number"
                    />
                    <Input
                      placeholder="Max"
                      value={localFilters.totalItems.max}
                      onChange={(e) => updateFilter('totalItems', { ...localFilters.totalItems, max: e.target.value })}
                      type="number"
                    />
                  </div>
                </div>

                {/* Impact Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">CO2 Saved (kg)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      value={localFilters.impactRange.co2Min}
                      onChange={(e) => updateFilter('impactRange', { ...localFilters.impactRange, co2Min: e.target.value })}
                      type="number"
                    />
                    <Input
                      placeholder="Max"
                      value={localFilters.impactRange.co2Max}
                      onChange={(e) => updateFilter('impactRange', { ...localFilters.impactRange, co2Max: e.target.value })}
                      type="number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Water Saved (L)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      value={localFilters.impactRange.waterMin}
                      onChange={(e) => updateFilter('impactRange', { ...localFilters.impactRange, waterMin: e.target.value })}
                      type="number"
                    />
                    <Input
                      placeholder="Max"
                      value={localFilters.impactRange.waterMax}
                      onChange={(e) => updateFilter('impactRange', { ...localFilters.impactRange, waterMax: e.target.value })}
                      type="number"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Products specific filters */}
            {type === 'products' && (
              <>
                {/* Seller */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Seller</label>
                  <Input
                    placeholder="Search seller..."
                    value={localFilters.seller}
                    onChange={(e) => updateFilter('seller', e.target.value)}
                  />
                </div>

                {/* Material */}
                <Select value={localFilters.material} onValueChange={(value) => updateFilter('material', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Materials" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Materials</SelectItem>
                    {materialOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Color */}
                <Select value={localFilters.color} onValueChange={(value) => updateFilter('color', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Colors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Colors</SelectItem>
                    {colorOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Size */}
                <Select value={localFilters.size} onValueChange={(value) => updateFilter('size', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sizes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sizes</SelectItem>
                    {sizeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Condition */}
                <Select value={localFilters.condition} onValueChange={(value) => updateFilter('condition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Conditions</SelectItem>
                    {conditionOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Country */}
                <Select value={localFilters.country} onValueChange={(value) => updateFilter('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    {countryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Price Range (€)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      value={localFilters.priceRange.min}
                      onChange={(e) => updateFilter('priceRange', { ...localFilters.priceRange, min: e.target.value })}
                      type="number"
                    />
                    <Input
                      placeholder="Max"
                      value={localFilters.priceRange.max}
                      onChange={(e) => updateFilter('priceRange', { ...localFilters.priceRange, max: e.target.value })}
                      type="number"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Date Range (both types) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Date Range
              </label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={localFilters.dateRange.start}
                  onChange={(e) => updateFilter('dateRange', { ...localFilters.dateRange, start: e.target.value })}
                />
                <Input
                  type="date"
                  value={localFilters.dateRange.end}
                  onChange={(e) => updateFilter('dateRange', { ...localFilters.dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 