import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

// Tipos para las exportaciones
export interface ExportOptions {
  includeHeaders?: boolean;
  dateFormat?: string;
  fileName?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'letter' | 'legal';
}

// Función para exportar contribuciones a CSV
export function exportContributionsToCSV(contributions: any[], options: ExportOptions = {}) {
  const {
    includeHeaders = true,
    dateFormat = 'DD/MM/YYYY',
    fileName = `contributions_${new Date().toISOString().split('T')[0]}.csv`
  } = options;

  const headers = [
    'ID', 'Tracking Code', 'Name', 'Type', 'Method', 'Status', 
    'Classification', 'Destination', 'Date', 'CO2 Saved (kg)', 
    'Water Saved (L)', 'Points', 'Certificate Hash'
  ];

  const csvData = contributions.map(c => [
    c.id,
    c.tracking,
    c.nome || 'N/A',
    c.tipo || 'N/A',
    c.metodo || 'N/A',
    c.trackingState || 'N/A',
    c.classification || 'N/A',
    c.destination || 'N/A',
    c.fecha ? new Date(c.fecha).toLocaleDateString() : 'N/A',
    c.co2Saved?.toFixed(2) || '0.00',
    c.waterSaved?.toFixed(0) || '0',
    c.points || '0',
    c.certificateHash || 'N/A'
  ]);

  const csvContent = includeHeaders 
    ? [headers, ...csvData]
    : csvData;

  const csvString = csvContent
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);

  return {
    fileName,
    recordCount: contributions.length,
    fileSize: blob.size
  };
}

// Función para exportar productos a CSV
export function exportProductsToCSV(products: any[], options: ExportOptions = {}) {
  const {
    includeHeaders = true,
    dateFormat = 'DD/MM/YYYY',
    fileName = `products_${new Date().toISOString().split('T')[0]}.csv`
  } = options;

  const headers = [
    'ID', 'Name', 'Seller', 'Status', 'Price', 'Type', 'Material', 
    'Color', 'Size', 'Condition', 'Published Date', 'Sold Date', 
    'Description', 'Images Count'
  ];

  const csvData = products.map(p => [
    p.id,
    p.name || 'N/A',
    p.sellerName || 'N/A',
    p.status || 'N/A',
    p.price?.toFixed(2) || '0.00',
    p.garmentType || 'N/A',
    p.material || 'N/A',
    p.color || 'N/A',
    p.size || 'N/A',
    p.condition || 'N/A',
    p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'N/A',
    p.soldAt ? new Date(p.soldAt).toLocaleDateString() : 'N/A',
    p.description || 'N/A',
    p.images?.length || '0'
  ]);

  const csvContent = includeHeaders 
    ? [headers, ...csvData]
    : csvData;

  const csvString = csvContent
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);

  return {
    fileName,
    recordCount: products.length,
    fileSize: blob.size
  };
}

// Función para exportar contribuciones a PDF
export function exportContributionsToPDF(contributions: any[], options: ExportOptions = {}) {
  const {
    fileName = `contributions_${new Date().toISOString().split('T')[0]}.pdf`,
    orientation = 'landscape',
    pageSize = 'a4'
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize
  });

  // Configurar el documento
  doc.setFont('helvetica');
  doc.setFontSize(16);
  doc.text('INFINITO - Contributions Report', 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Total Contributions: ${contributions.length}`, 14, 35);

  // Preparar datos para la tabla
  const tableData = contributions.map(c => [
    c.tracking,
    c.nome || 'N/A',
    c.tipo || 'N/A',
    c.trackingState || 'N/A',
    c.classification || 'N/A',
    c.fecha ? new Date(c.fecha).toLocaleDateString() : 'N/A',
    c.co2Saved?.toFixed(2) || '0.00',
    c.waterSaved?.toFixed(0) || '0'
  ]);

  const tableHeaders = [
    'Tracking', 'Name', 'Type', 'Status', 'Classification', 
    'Date', 'CO2 (kg)', 'Water (L)'
  ];

  // Agregar tabla
  (doc as any).autoTable({
    head: [tableHeaders],
    body: tableData,
    startY: 45,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [104, 150, 16], // Verde INFINITO
      textColor: 255
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // Agregar estadísticas al final
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  const totalCO2 = contributions.reduce((sum, c) => sum + (c.co2Saved || 0), 0);
  const totalWater = contributions.reduce((sum, c) => sum + (c.waterSaved || 0), 0);
  const totalPoints = contributions.reduce((sum, c) => sum + (c.points || 0), 0);

  doc.setFontSize(12);
  doc.text('Summary Statistics:', 14, finalY);
  doc.setFontSize(10);
  doc.text(`Total CO2 Saved: ${totalCO2.toFixed(2)} kg`, 14, finalY + 8);
  doc.text(`Total Water Saved: ${totalWater.toFixed(0)} L`, 14, finalY + 13);
  doc.text(`Total Points: ${totalPoints}`, 14, finalY + 18);

  // Guardar el PDF
  doc.save(fileName);

  return {
    fileName,
    recordCount: contributions.length,
    totalCO2,
    totalWater,
    totalPoints
  };
}

// Función para exportar productos a PDF
export function exportProductsToPDF(products: any[], options: ExportOptions = {}) {
  const {
    fileName = `products_${new Date().toISOString().split('T')[0]}.pdf`,
    orientation = 'landscape',
    pageSize = 'a4'
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize
  });

  // Configurar el documento
  doc.setFont('helvetica');
  doc.setFontSize(16);
  doc.text('INFINITO - Products Report', 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Total Products: ${products.length}`, 14, 35);

  // Preparar datos para la tabla
  const tableData = products.map(p => [
    p.name || 'N/A',
    p.sellerName || 'N/A',
    p.status || 'N/A',
    p.price?.toFixed(2) || '0.00',
    p.garmentType || 'N/A',
    p.material || 'N/A',
    p.color || 'N/A',
    p.size || 'N/A',
    p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : 'N/A'
  ]);

  const tableHeaders = [
    'Name', 'Seller', 'Status', 'Price', 'Type', 
    'Material', 'Color', 'Size', 'Published'
  ];

  // Agregar tabla
  (doc as any).autoTable({
    head: [tableHeaders],
    body: tableData,
    startY: 45,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [104, 150, 16], // Verde INFINITO
      textColor: 255
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  // Agregar estadísticas al final
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const publishedCount = products.filter(p => p.status === 'published').length;
  const soldCount = products.filter(p => p.status === 'sold').length;

  doc.setFontSize(12);
  doc.text('Summary Statistics:', 14, finalY);
  doc.setFontSize(10);
  doc.text(`Total Value: €${totalValue.toFixed(2)}`, 14, finalY + 8);
  doc.text(`Published Products: ${publishedCount}`, 14, finalY + 13);
  doc.text(`Sold Products: ${soldCount}`, 14, finalY + 18);

  // Guardar el PDF
  doc.save(fileName);

  return {
    fileName,
    recordCount: products.length,
    totalValue,
    publishedCount,
    soldCount
  };
}

// Función para exportar resumen ejecutivo a PDF
export function exportExecutiveSummaryToPDF(contributions: any[], products: any[], options: ExportOptions = {}) {
  const {
    fileName = `infinito_executive_summary_${new Date().toISOString().split('T')[0]}.pdf`,
    orientation = 'portrait',
    pageSize = 'a4'
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize
  });

  // Configurar el documento
  doc.setFont('helvetica');
  doc.setFontSize(20);
  doc.text('INFINITO - Executive Summary', 14, 25);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 35);

  // Estadísticas de contribuciones
  const totalCO2 = contributions.reduce((sum, c) => sum + (c.co2Saved || 0), 0);
  const totalWater = contributions.reduce((sum, c) => sum + (c.waterSaved || 0), 0);
  const totalPoints = contributions.reduce((sum, c) => sum + (c.points || 0), 0);
  const verifiedContributions = contributions.filter(c => c.trackingState === 'verificado').length;
  const certifiedContributions = contributions.filter(c => c.certificateHash).length;

  // Estadísticas de productos
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const publishedProducts = products.filter(p => p.status === 'published').length;
  const soldProducts = products.filter(p => p.status === 'sold').length;

  let yPosition = 50;

  // Sección de Contribuciones
  doc.setFontSize(16);
  doc.text('Contributions Overview', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.text(`Total Contributions: ${contributions.length}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Verified Contributions: ${verifiedContributions}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Certified Contributions: ${certifiedContributions}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Total CO2 Saved: ${totalCO2.toFixed(2)} kg`, 14, yPosition);
  yPosition += 6;
  doc.text(`Total Water Saved: ${totalWater.toFixed(0)} L`, 14, yPosition);
  yPosition += 6;
  doc.text(`Total Points Earned: ${totalPoints}`, 14, yPosition);
  yPosition += 15;

  // Sección de Productos
  doc.setFontSize(16);
  doc.text('Products Overview', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.text(`Total Products: ${products.length}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Published Products: ${publishedProducts}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Sold Products: ${soldProducts}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Total Market Value: €${totalValue.toFixed(2)}`, 14, yPosition);
  yPosition += 15;

  // Impacto ambiental
  doc.setFontSize(16);
  doc.text('Environmental Impact', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.text(`CO2 Emissions Prevented: ${totalCO2.toFixed(2)} kg`, 14, yPosition);
  yPosition += 6;
  doc.text(`Water Consumption Saved: ${totalWater.toFixed(0)} L`, 14, yPosition);
  yPosition += 6;
  doc.text(`Circular Economy Items: ${contributions.length + products.length}`, 14, yPosition);

  // Guardar el PDF
  doc.save(fileName);

  return {
    fileName,
    contributionsCount: contributions.length,
    productsCount: products.length,
    totalCO2,
    totalWater,
    totalValue
  };
} 