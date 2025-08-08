"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Download, Upload, Edit, Filter, Calculator, CheckCircle, Package, Recycle, Palette, Heart, Shirt, Image as ArtIcon, RefreshCw, Gift, Eye, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { calculateStandardWeight, calculateEnvironmentalImpact, generateCertificateHash } from "@/lib/utils";
import jsPDF from "jspdf";
import * as React from "react";
import { saveAs } from 'file-saver';
import toast, { Toaster } from 'react-hot-toast';

// Componente Skeleton Loader
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-2 py-4"><div className="h-4 w-4 bg-gray-200 rounded"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
  </tr>
);

// Loading Spinner Component
const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verificado':
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'procesado':
      case 'processed':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

// Empty State Component
const EmptyState = ({ title, description, icon, action }: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  action?: React.ReactNode; 
}) => (
  <div className="text-center py-12">
    <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6">{description}</p>
    {action && <div>{action}</div>}
  </div>
);

export default function AdminContributionsPage() {
  const [contribs, setContribs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingModal, setProcessingModal] = useState<any>(null);
  const [selectedContribution, setSelectedContribution] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showClassifyDialog, setShowClassifyDialog] = useState(false);
  const [selectedClassification, setSelectedClassification] = useState('');
  const [error, setError] = useState<string|null>(null);
  const [successMessage, setSuccessMessage] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  // Simple filters state
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    classification: '',
    search: ''
  });

  const router = useRouter();

  // Filter contributions based on current filters
  const filteredContributions = contribs.filter(contrib => {
    if (filters.type && contrib.tipo !== filters.type) return false;
    if (filters.status && contrib.estado !== filters.status) return false;
    if (filters.classification && contrib.classification !== filters.classification) return false;
    if (filters.search && !contrib.tracking.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const toggleAll = () => {
    if (selectedItems.size === filteredContributions.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredContributions.map(c => c.id)));
    }
  };

  const toggleOne = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const clearErrors = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const confirmAction = (action: string, callback: () => void) => {
    if (window.confirm(`Are you sure you want to ${action}?`)) {
      callback();
    }
  };

  async function loadContributions() {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      
      const response = await fetch(`/api/contributions?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setContribs(data.contributions || []);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
      
      toast.success('Contributions loaded successfully');
      
    } catch (error) {
      console.error('Error loading contributions:', error);
      setError('Failed to load contributions');
      toast.error('Failed to load contributions');
    } finally {
      setIsLoading(false);
    }
  }

  const handleProcessContribution = (contrib: any) => {
    setProcessingModal(contrib);
    // Simulate processing
    setTimeout(() => {
      setProcessingModal(null);
      toast.success('Contribution processed successfully');
    }, 2000);
  };

  const handleCalculateImpact = () => {
    toast.success('Environmental impact calculated');
  };

  const handleClassifyContribution = async (classification: string) => {
    try {
      const response = await fetch(`/api/contributions/${selectedContribution.id}/classify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classification })
      });

      if (!response.ok) throw new Error('Failed to classify contribution');

      toast.success('Contribution classified successfully');
      setSelectedContribution(null);
      loadContributions();
      
    } catch (error) {
      console.error('Error classifying contribution:', error);
      toast.error('Failed to classify contribution');
    }
  };

  const getDestinationForClassification = (classification: string) => {
    switch (classification) {
      case 'reutilizable': return 'marketplace';
      case 'reparable': return 'artists';
      case 'reciclable': return 'recycling_center';
      default: return 'unknown';
    }
  };

  const handleGenerateCertificate = async (contrib: any) => {
    try {
      const certificateHash = generateCertificateHash(contrib);
      
      const response = await fetch(`/api/contributions/${contrib.id}/certificate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateHash })
      });

      if (!response.ok) throw new Error('Failed to generate certificate');

      toast.success('Certificate generated successfully');
      loadContributions();
      
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate');
    }
  };

  const loadProductsForContribution = async (tracking: string) => {
    try {
      const response = await fetch(`/api/products?tracking=${tracking}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleRowClick = async (contrib: any) => {
    setSelectedContribution(contrib);
    if (contrib.tipo === 'clothing' && contrib.decision === 'sell') {
      await loadProductsForContribution(contrib.tracking);
    }
  };

  const closeDetails = () => {
    setSelectedContribution(null);
    setProducts([]);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters(prev => ({ ...prev, search: value }));
  };

  async function handleExport(format: 'csv' | 'pdf', scope: 'filtered' | 'all') {
    try {
      setIsLoading(true);
      
      const dataToExport = scope === 'filtered' ? filteredContributions : contribs;
      
      if (format === 'csv') {
        // Simple CSV export
        const headers = ['Tracking', 'Type', 'Status', 'Date', 'Classification', 'Decision'];
        const csvContent = [
          headers.join(','),
          ...dataToExport.map(contrib => [
            contrib.tracking,
            contrib.tipo,
            contrib.estado,
            new Date(contrib.fecha).toLocaleDateString(),
            contrib.classification || '',
            contrib.decision || ''
          ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        saveAs(blob, `contributions_${scope}_${new Date().toISOString().split('T')[0]}.csv`);
      } else {
        // Simple PDF export
        const doc = new jsPDF();
        doc.text('Contributions Report', 20, 20);
        dataToExport.forEach((contrib, index) => {
          const y = 40 + (index * 10);
          doc.text(`${contrib.tracking} - ${contrib.tipo} - ${contrib.estado}`, 20, y);
        });
        doc.save(`contributions_${scope}_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      
      toast.success(`${format.toUpperCase()} export completed`);
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBulkApprove() {
    if (selectedItems.size === 0) {
      toast.error('No items selected');
      return;
    }

    confirmAction('approve selected contributions', async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/contributions/bulk-approve', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: Array.from(selectedItems) })
        });

        if (!response.ok) throw new Error('Failed to approve contributions');

        toast.success('Contributions approved successfully');
        setSelectedItems(new Set());
        loadContributions();
        
      } catch (error) {
        console.error('Error approving contributions:', error);
        toast.error('Failed to approve contributions');
      } finally {
        setIsLoading(false);
      }
    });
  }

  async function handleBulkClassify() {
    if (selectedItems.size === 0) {
      toast.error('No items selected');
      return;
    }

    if (!selectedClassification) {
      toast.error('Please select a classification');
      return;
    }

    try {
      setIsLoading(true);
      
      const destination = getDestinationForClassification(selectedClassification);
      
      const response = await fetch('/api/contributions/bulk-classify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ids: Array.from(selectedItems),
          classification: selectedClassification,
          destination
        })
      });

      if (!response.ok) throw new Error('Failed to classify contributions');

      toast.success('Contributions classified successfully');
      setSelectedItems(new Set());
      setSelectedClassification('');
      setShowClassifyDialog(false);
      loadContributions();
      
    } catch (error) {
      console.error('Error classifying contributions:', error);
      toast.error('Failed to classify contributions');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBulkCertify() {
    if (selectedItems.size === 0) {
      toast.error('No items selected');
      return;
    }

    confirmAction('generate certificates for selected contributions', async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/contributions/bulk-certify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: Array.from(selectedItems) })
        });

        if (!response.ok) throw new Error('Failed to generate certificates');

        toast.success('Certificates generated successfully');
        setSelectedItems(new Set());
        loadContributions();
        
      } catch (error) {
        console.error('Error generating certificates:', error);
        toast.error('Failed to generate certificates');
      } finally {
        setIsLoading(false);
      }
    });
  }

  useEffect(() => {
    loadContributions();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
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
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Contributions Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track all contributions in the system
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Contributions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : contribs.length}
                </p>
              </div>
              
              <button
                onClick={() => loadContributions()}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>
          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-red-800">{error}</p>
                <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                  ✕
                </button>
              </div>
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-green-800">{successMessage}</p>
                <button onClick={() => setSuccessMessage(null)} className="text-green-600 hover:text-green-800">
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Search and Filters Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search contributions..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="flex gap-2">
                {/* Simple filter dropdowns */}
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Types</option>
                  <option value="clothing">Clothing</option>
                  <option value="art">Art</option>
                  <option value="recycling">Recycling</option>
                </select>
                
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Status</option>
                  <option value="pendiente">Pending</option>
                  <option value="verificado">Verified</option>
                  <option value="procesado">Processed</option>
                </select>
                
                {/* Export buttons */}
                <button
                  onClick={() => handleExport('csv', 'filtered')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
                >
                  Export CSV
                </button>
                
                <button
                  onClick={() => handleExport('pdf', 'filtered')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-blue-800 font-medium">
                  {selectedItems.size} item(s) selected
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkApprove}
                    disabled={isLoading}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-300"
                  >
                    Approve Selected
                  </button>
                  <button
                    onClick={() => setShowClassifyDialog(true)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:bg-gray-300"
                  >
                    Classify Selected
                  </button>
                  <button
                    onClick={handleBulkCertify}
                    disabled={isLoading}
                    className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:bg-gray-300"
                  >
                    Generate Certificates
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contributions Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading contributions...</p>
              </div>
            ) : filteredContributions.length === 0 ? (
              <EmptyState
                title="No contributions found"
                description="Try adjusting your filters or search terms"
                icon={<Package className="w-12 h-12 text-gray-400" />}
                action={
                  <button
                    onClick={() => setFilters({ type: '', status: '', classification: '', search: '' })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-2 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.size === filteredContributions.length}
                          onChange={toggleAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tracking
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classification
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Decision
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Certificate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredContributions.map((contrib) => (
                      <tr 
                        key={contrib.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(contrib)}
                      >
                        <td className="px-2 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(contrib.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleOne(contrib.id);
                            }}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {contrib.tracking}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            {contrib.tipo === 'clothing' && <Shirt className="w-4 h-4" />}
                            {contrib.tipo === 'art' && <ArtIcon className="w-4 h-4" />}
                            {contrib.tipo === 'recycling' && <Recycle className="w-4 h-4" />}
                            {contrib.tipo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={contrib.estado} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(contrib.fecha).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contrib.classification ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {contrib.classification}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contrib.decision ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              contrib.decision === 'sell' ? 'bg-green-100 text-green-800' :
                              contrib.decision === 'donate' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {contrib.decision}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contrib.certificateHash ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProcessContribution(contrib);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Process
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateCertificate(contrib);
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              Certificate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Processing Modal */}
        {processingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center gap-4">
                <LoadingSpinner size="md" />
                <div>
                  <h3 className="text-lg font-bold">Processing Contribution</h3>
                  <p className="text-gray-600">Please wait while we process {processingModal.tracking}...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contribution Details Modal */}
        <Dialog open={!!selectedContribution} onOpenChange={() => setSelectedContribution(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contribution Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected contribution
              </DialogDescription>
              <button
                onClick={closeDetails}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </DialogHeader>
            {selectedContribution && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><b>Code:</b> {selectedContribution.tracking}</div>
                  <div><b>Date:</b> {new Date(selectedContribution.fecha).toLocaleString()}</div>
                  <div><b>Type:</b> {selectedContribution.tipo}</div>
                  <div><b>Method:</b> {selectedContribution.metodo}</div>
                  <div><b>Pickup Point:</b> {selectedContribution.pickupPoint || '-'}</div>
                  <div><b>Decision:</b> {selectedContribution.decision || '-'}</div>
                  <div><b>Status:</b> {selectedContribution.estado}</div>
                  <div><b>Tracking State:</b> {selectedContribution.trackingState}</div>
                  <div><b>Classification:</b> {selectedContribution.classification}</div>
                  <div><b>Destination:</b> {selectedContribution.destination}</div>
                  <div><b>Certificate:</b> {selectedContribution.certificateHash ? 'Available' : 'Not generated'}</div>
                </div>
                {/* Associated products if clothing and sell */}
                {selectedContribution.tipo === 'clothing' && selectedContribution.decision === 'sell' && (
                  <div>
                    <h3 className="font-bold mb-2">Associated Products</h3>
                    <table className="w-full text-sm border">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Price</th>
                          <th>Published</th>
                          <th>Sold</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length === 0 ? (
                          <tr><td colSpan={5} className="text-center">No products</td></tr>
                        ) : products.map(prod => (
                          <tr key={prod.id}>
                            <td>{prod.name}</td>
                            <td>{prod.status}</td>
                            <td>{prod.price}€</td>
                            <td>{prod.publishedAt ? new Date(prod.publishedAt).toLocaleDateString() : '-'}</td>
                            <td>{prod.soldAt ? new Date(prod.soldAt).toLocaleDateString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Edit and certificate actions */}
                <div className="flex gap-4 mt-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Edit</button>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg">Generate Certificate</button>
                  <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg" onClick={() => setSelectedContribution(null)}>Close</button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Classification Dialog */}
        {showClassifyDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Select Classification</h3>
              <select 
                value={selectedClassification} 
                onChange={(e) => setSelectedClassification(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                <option value="">Choose classification...</option>
                <option value="reutilizable">Reusable</option>
                <option value="reparable">Repairable</option>
                <option value="reciclable">Recyclable</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => {
                    setShowClassifyDialog(false);
                    setSelectedClassification('');
                    toast('Classification cancelled');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBulkClassify}
                  disabled={!selectedClassification}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}