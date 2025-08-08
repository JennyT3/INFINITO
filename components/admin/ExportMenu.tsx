"use client";
import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportMenuProps {
  onExport: (format: 'csv' | 'pdf', type: 'filtered' | 'all') => void;
  isExporting: boolean;
  dataType: 'contributions' | 'products';
  filteredCount: number;
  totalCount: number;
  hasFilters: boolean;
}

export default function ExportMenu({
  onExport,
  isExporting,
  dataType,
  filteredCount,
  totalCount,
  hasFilters
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf'>('csv');
  const [selectedScope, setSelectedScope] = useState<'filtered' | 'all'>('filtered');

  const handleExport = () => {
    onExport(selectedFormat, selectedScope);
    setIsOpen(false);
  };

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Spreadsheet format' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Document format' }
  ];

  const scopeOptions = [
    { 
      value: 'filtered', 
      label: `Filtered (${filteredCount})`, 
      description: 'Current filtered results',
      disabled: !hasFilters
    },
    { 
      value: 'all', 
      label: `All (${totalCount})`, 
      description: 'All records',
      disabled: false
    }
  ];

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        aria-label="Export data"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Exporting...' : 'Export'}
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Export {dataType}</h3>
            <p className="text-sm text-gray-600">Choose format and scope for export</p>
          </div>

          {/* Format Selection */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Format</h4>
            <div className="space-y-2">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFormat(option.value as 'csv' | 'pdf')}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedFormat === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </div>
                    {selectedFormat === option.value && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scope Selection */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Scope</h4>
            <div className="space-y-2">
              {scopeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedScope(option.value as 'filtered' | 'all')}
                  disabled={option.disabled}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedScope === option.value
                      ? 'border-green-500 bg-green-50'
                      : option.disabled
                      ? 'border-gray-100 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <div className={`font-medium ${option.disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                      {option.label}
                    </div>
                    <div className={`text-sm ${option.disabled ? 'text-gray-400' : 'text-gray-600'}`}>
                      {option.description}
                    </div>
                  </div>
                  {selectedScope === option.value && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 flex gap-2">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 