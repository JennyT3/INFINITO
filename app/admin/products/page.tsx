'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Edit, Trash2, Plus, RefreshCw, Download, AlertTriangle } from 'lucide-react';
import * as React from "react";
import AdvancedFilters from "@/components/admin/AdvancedFilters";
import { useAdminFilters } from "@/hooks/useAdminFilters";
import toast, { Toaster } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/admin/EmptyState";
import ConfirmationDialog from "@/components/admin/ConfirmationDialog";
import ValidationFeedback from "@/components/admin/ValidationFeedback";
import { useValidation } from "@/hooks/useValidation";
import { 
  notifyProductPublished, 
  notifyProductSold, 
  notifyBulkActionCompleted, 
  notifyExportCompleted, 
  notifyError 
} from "@/lib/notifications";
import NotificationCenter, { useNotificationCenter } from "@/components/admin/NotificationCenter";
import { 
  exportProductsToCSV, 
  exportProductsToPDF 
} from "@/lib/export-utils";
import ExportMenu from "@/components/admin/ExportMenu";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const router = useRouter();

  // Nuevos estados para mejor UX
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Estados para diálogos de confirmación
  const [confirmationDialog, setConfirmationDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
    variant?: 'default' | 'destructive' | 'warning';
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
    variant: 'default'
  });

  // Hook de validación
  const validation = useValidation();

  // Hook de notificaciones
  const notificationCenter = useNotificationCenter();

  // Usar el hook de filtros avanzados
  const { filters, filteredData: filtered, updateFilters, clearFilters, filterStats } = useAdminFilters(products, 'products');

  // Función para cargar productos con mejor UX
  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        const productsData = Array.isArray(data) ? data : data.products || data.data || [];
        setProducts(productsData);
        
        if (productsData.length === 0) {
          setSuccessMessage('No products found in the marketplace');
        } else {
          setSuccessMessage(`Successfully loaded ${productsData.length} products`);
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      } else {
        const errorText = await response.text();
        setError(`Failed to load products: ${response.status} - ${errorText}`);
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Error connecting to server. Please check your internet connection and try again.');
      toast.error('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para exportar productos
  async function handleExport(format: 'csv' | 'pdf', scope: 'filtered' | 'all') {
    setIsExporting(true);
    const loadingToast = toast.loading(`Exporting ${scope} products to ${format.toUpperCase()}...`);
    
    try {
      const dataToExport = scope === 'filtered' ? filtered : products;
      
      if (format === 'csv') {
        const result = exportProductsToCSV(dataToExport, {
          fileName: `products_${scope}_${new Date().toISOString().split('T')[0]}.csv`
        });
        
        notifyExportCompleted(
          'products',
          result.recordCount,
          result.fileName
        );
        
        toast.success(`CSV exported successfully! ${result.recordCount} records`, { id: loadingToast });
        setSuccessMessage(`Products exported to CSV successfully! ${result.recordCount} records`);
      } else if (format === 'pdf') {
        const result = exportProductsToPDF(dataToExport, {
          fileName: `products_${scope}_${new Date().toISOString().split('T')[0]}.pdf`
        });
        
        notifyExportCompleted(
          'products',
          result.recordCount,
          result.fileName
        );
        
        toast.success(`PDF exported successfully! ${result.recordCount} records`, { id: loadingToast });
        setSuccessMessage(`Products exported to PDF successfully! ${result.recordCount} records`);
      }
      
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error exporting:', error);
      notifyError('export', error instanceof Error ? error.message : 'Unknown error');
      toast.error(`Error exporting ${format.toUpperCase()}`, { id: loadingToast });
      setError(`Failed to export ${format.toUpperCase()}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Skip link para accesibilidad */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
        Skip to main content
      </a>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="max-w-6xl mx-auto">
        {/* Header con mejor semántica */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" id="page-title">
                Products Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track all products in the marketplace
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : products.length}
                </p>
              </div>
              
              {/* Notification Center */}
              <NotificationCenter
                notifications={notificationCenter.notifications}
                onMarkAsRead={notificationCenter.markAsRead}
                onMarkAllAsRead={notificationCenter.markAllAsRead}
                onClearAll={notificationCenter.clearAll}
                onActionClick={(notification) => {
                  if (notification.action?.url) {
                    window.location.href = notification.action.url;
                  }
                }}
              />
              
              <button
                onClick={loadProducts}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                aria-label="Refresh products list"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main id="main-content" role="main" aria-labelledby="page-title">
          {/* Error and Success Messages */}
          {error && (
            <ValidationFeedback
              type="error"
              message={error}
              dismissible={true}
              onDismiss={() => setError(null)}
              className="mb-4"
            />
          )}
          
          {successMessage && (
            <ValidationFeedback
              type="success"
              message={successMessage}
              dismissible={true}
              onDismiss={() => setSuccessMessage(null)}
              className="mb-4"
            />
          )}

          {/* Advanced Filters */}
          <AdvancedFilters
            onFiltersChange={updateFilters}
            filters={filters}
            type="products"
            loading={loading}
            onRefresh={loadProducts}
          />

          {/* Filter Stats */}
          {filterStats.hasFilters && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-800">
                    Showing {filterStats.filtered} of {filterStats.total} products
                  </span>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" text="Loading products..." showText={true} />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filtered.length === 0 && (
            <EmptyState
              type="products"
              hasFilters={filterStats.hasFilters}
              onClearFilters={clearFilters}
              onRefresh={loadProducts}
            />
          )}

          {/* Content when data is available */}
          {!isLoading && filtered.length > 0 && (
            <>
              {/* Export Menu */}
              <div className="mb-4 flex justify-end">
                <ExportMenu
                  onExport={handleExport}
                  isExporting={isExporting}
                  dataType="products"
                  filteredCount={filtered.length}
                  totalCount={products.length}
                  hasFilters={filterStats.hasFilters}
                />
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seller
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Published
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filtered.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.material} • {product.color} • {product.size}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.sellerName || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={product.status} type="status" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${product.price?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={product.garmentType} type="type" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.publishedAt ? new Date(product.publishedAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                aria-label={`Edit ${product.name}`}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                aria-label={`Delete ${product.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmationDialog.isOpen}
          onClose={() => setConfirmationDialog({ ...confirmationDialog, isOpen: false })}
          onConfirm={confirmationDialog.action}
          title={confirmationDialog.title}
          description={confirmationDialog.description}
          variant={confirmationDialog.variant}
          loading={isProcessing}
        />
      </div>
    </div>
  );
} 