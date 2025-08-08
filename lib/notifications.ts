import { toast } from 'react-hot-toast';

// Tipos de notificaciones
export type NotificationType = 
  | 'product_published'
  | 'product_sold'
  | 'contribution_processed'
  | 'contribution_verified'
  | 'contribution_certified'
  | 'bulk_action_completed'
  | 'export_completed'
  | 'error_occurred';

// Interfaz para datos de notificación
export interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
  details?: {
    itemCount?: number;
    itemName?: string;
    trackingCode?: string;
    impact?: {
      co2: number;
      water: number;
      resources: number;
    };
    price?: number;
    destination?: string;
    classification?: string;
  };
  action?: {
    label: string;
    url: string;
  };
}

// Configuración de notificaciones por tipo
const notificationConfig = {
  product_published: {
    icon: '🛍️',
    duration: 5000,
    style: 'success'
  },
  product_sold: {
    icon: '💰',
    duration: 5000,
    style: 'success'
  },
  contribution_processed: {
    icon: '✅',
    duration: 4000,
    style: 'success'
  },
  contribution_verified: {
    icon: '🔍',
    duration: 4000,
    style: 'success'
  },
  contribution_certified: {
    icon: '🏆',
    duration: 6000,
    style: 'success'
  },
  bulk_action_completed: {
    icon: '⚡',
    duration: 4000,
    style: 'success'
  },
  export_completed: {
    icon: '📊',
    duration: 3000,
    style: 'success'
  },
  error_occurred: {
    icon: '❌',
    duration: 6000,
    style: 'error'
  }
};

// Función principal para mostrar notificaciones
export function showNotification(data: NotificationData) {
  const config = notificationConfig[data.type];
  
  const toastOptions = {
    duration: config.duration,
    position: 'top-right' as const,
    style: {
      background: config.style === 'error' ? '#FEE2E2' : '#F0FDF4',
      color: config.style === 'error' ? '#DC2626' : '#166534',
      border: config.style === 'error' ? '1px solid #FCA5A5' : '1px solid #86EFAC',
      borderRadius: '8px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px'
    }
  };

  const message = `${config.icon} ${data.title}\n${data.message}`;
  
  if (config.style === 'error') {
    toast.error(message, toastOptions);
  } else {
    toast.success(message, toastOptions);
  }

  // Log para debugging
  console.log(`[NOTIFICATION] ${data.type}:`, data);
}

// Funciones específicas para diferentes tipos de notificaciones

// Notificaciones de productos
export function notifyProductPublished(productName: string, price: number, trackingCode: string) {
  showNotification({
    type: 'product_published',
    title: 'Product Published Successfully',
    message: `${productName} has been published to the marketplace`,
    details: {
      itemName: productName,
      trackingCode,
      price
    },
    action: {
      label: 'View Product',
      url: `/admin/products?search=${trackingCode}`
    }
  });
}

export function notifyProductSold(productName: string, price: number, trackingCode: string) {
  showNotification({
    type: 'product_sold',
    title: 'Product Sold!',
    message: `${productName} has been sold for €${price}`,
    details: {
      itemName: productName,
      trackingCode,
      price
    },
    action: {
      label: 'View Details',
      url: `/admin/products?search=${trackingCode}`
    }
  });
}

// Notificaciones de contribuciones
export function notifyContributionProcessed(
  trackingCode: string, 
  classification: string, 
  destination: string,
  itemCount: number
) {
  showNotification({
    type: 'contribution_processed',
    title: 'Contribution Processed',
    message: `Contribution ${trackingCode} has been classified as ${classification} and assigned to ${destination}`,
    details: {
      trackingCode,
      classification,
      destination,
      itemCount
    },
    action: {
      label: 'View Contribution',
      url: `/admin/contributions?search=${trackingCode}`
    }
  });
}

export function notifyContributionVerified(
  trackingCode: string,
  impact: { co2: number; water: number; resources: number }
) {
  showNotification({
    type: 'contribution_verified',
    title: 'Contribution Verified',
    message: `Contribution ${trackingCode} has been verified with environmental impact calculated`,
    details: {
      trackingCode,
      impact
    },
    action: {
      label: 'View Details',
      url: `/admin/contributions?search=${trackingCode}`
    }
  });
}

export function notifyContributionCertified(
  trackingCode: string,
  certificateHash: string,
  impact: { co2: number; water: number; resources: number }
) {
  showNotification({
    type: 'contribution_certified',
    title: 'Certificate Generated!',
    message: `Contribution ${trackingCode} has been certified with blockchain verification`,
    details: {
      trackingCode,
      impact
    },
    action: {
      label: 'View Certificate',
      url: `/admin/contributions?search=${trackingCode}`
    }
  });
}

// Notificaciones de acciones masivas
export function notifyBulkActionCompleted(
  action: string,
  itemCount: number,
  itemType: 'contributions' | 'products'
) {
  showNotification({
    type: 'bulk_action_completed',
    title: 'Bulk Action Completed',
    message: `${action} completed for ${itemCount} ${itemType}`,
    details: {
      itemCount
    }
  });
}

// Notificaciones de exportación
export function notifyExportCompleted(
  itemType: 'contributions' | 'products',
  itemCount: number,
  fileName: string
) {
  showNotification({
    type: 'export_completed',
    title: 'Export Completed',
    message: `${itemCount} ${itemType} exported to ${fileName}`,
    details: {
      itemCount
    }
  });
}

// Notificaciones de errores
export function notifyError(
  action: string,
  error: string,
  itemName?: string
) {
  showNotification({
    type: 'error_occurred',
    title: `Error: ${action}`,
    message: itemName ? `Failed to ${action} ${itemName}: ${error}` : `Failed to ${action}: ${error}`,
    details: {
      itemName
    }
  });
}

// Hook para notificaciones automáticas
export function useNotifications() {
  return {
    showNotification,
    notifyProductPublished,
    notifyProductSold,
    notifyContributionProcessed,
    notifyContributionVerified,
    notifyContributionCertified,
    notifyBulkActionCompleted,
    notifyExportCompleted,
    notifyError
  };
}

// Función para notificaciones de impacto ambiental
export function notifyEnvironmentalImpact(
  trackingCode: string,
  impact: { co2: number; water: number; resources: number },
  itemCount: number
) {
  const totalImpact = impact.co2 + impact.water + impact.resources;
  
  showNotification({
    type: 'contribution_verified',
    title: 'Environmental Impact Calculated',
    message: `Contribution ${trackingCode} saved ${impact.co2.toFixed(1)}kg CO2, ${impact.water.toFixed(0)}L water, and ${impact.resources} resources`,
    details: {
      trackingCode,
      impact,
      itemCount
    },
    action: {
      label: 'View Impact',
      url: `/admin/contributions?search=${trackingCode}`
    }
  });
}

// Función para notificaciones de marketplace
export function notifyMarketplaceUpdate(
  action: 'product_added' | 'product_removed' | 'price_updated',
  productName: string,
  trackingCode: string,
  price?: number
) {
  const messages = {
    product_added: `${productName} added to marketplace`,
    product_removed: `${productName} removed from marketplace`,
    price_updated: `${productName} price updated to €${price}`
  };

  showNotification({
    type: 'product_published',
    title: 'Marketplace Updated',
    message: messages[action],
    details: {
      itemName: productName,
      trackingCode,
      price
    },
    action: {
      label: 'View Marketplace',
      url: `/admin/products?search=${trackingCode}`
    }
  });
}

// Función para notificaciones de certificados blockchain
export function notifyBlockchainCertificate(
  trackingCode: string,
  certificateHash: string,
  timestamp: Date
) {
  showNotification({
    type: 'contribution_certified',
    title: 'Blockchain Certificate Generated',
    message: `Certificate ${certificateHash.substring(0, 8)}... has been added to the blockchain`,
    details: {
      trackingCode
    },
    action: {
      label: 'Verify on Blockchain',
      url: `/admin/contributions?search=${trackingCode}`
    }
  });
} 