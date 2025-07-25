'use client';
import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InfinitoCertificateGenerator from '../../../components/InfinitoCertificateGenerator';
import * as React from "react"

interface Certificate {
  id: string;
  donor: string;
  date: string;
  co2: string;
  water: string;
  status: string;
}

const initialCertificates: Certificate[] = [
  { id: 'VR-2025-1234', donor: 'Maria Silva', date: '2024-06-01', co2: '62.5 kg', water: '8,500 L', status: 'Emitido' },
  { id: 'VR-2025-ABCD', donor: 'João Costa', date: '2024-05-28', co2: '25.0 kg', water: '3,400 L', status: 'Emitido' },
];

function toCSV(rows: Array<Record<string, string>>): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')].concat(
    rows.map((row: Record<string, string>) => headers.map((h: string) => `"${(row[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
  );
  return csv.join('\n');
}

function fromCSV(csv: string): Array<Record<string, string>> {
  const [header, ...lines] = csv.trim().split(/\r?\n/);
  const headers = header.split(',').map((h: string) => h.replace(/"/g, ''));
  return lines.map((line: string) => {
    const values = line.match(/("[^"]*"|[^,]+)/g)?.map((v: string) => v.replace(/^"|"$/g, '').replace(/""/g, '"')) || [];
    const obj: Record<string, string> = {};
    headers.forEach((h: string, i: number) => { obj[h] = values[i] || ''; });
    return obj;
  });
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [editData, setEditData] = useState<Certificate|null>(null);

  const handleExport = () => {
    const csv = toCSV(certificates.map(cert => ({
      id: cert.id,
      donor: cert.donor,
      date: cert.date,
      co2: cert.co2,
      water: cert.water,
      status: cert.status
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificados.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const rows = fromCSV(text);
        if (!rows.length || !rows[0].id) throw new Error('Formato inválido.');
        setCertificates(
          rows.map(item => ({
            id: item.id || '',
            donor: item.donor || '',
            date: item.date || '',
            co2: item.co2 || '',
            water: item.water || '',
            status: item.status || ''
          }))
        );
      } catch (err: any) {
        setImportError('Erro ao importar CSV: ' + (err.message || err));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Certificados</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Exportar CSV</button>
        <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Importar CSV</button>
        <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
      </div>
      {importError && <div className="text-red-600 mb-2">{importError}</div>}
      <table className="w-full bg-white rounded-xl shadow text-left">
        <thead>
          <tr className="border-b">
            <th className="p-4">Código</th>
            <th className="p-4">Contribuinte</th>
            <th className="p-4">Data</th>
            <th className="p-4">CO2</th>
            <th className="p-4">Água</th>
            <th className="p-4">Estado</th>
            <th className="p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map(cert => (
            <tr key={cert.id} className="border-b hover:bg-gray-50">
              <td className="p-4 font-mono">{cert.id}</td>
              <td className="p-4">{cert.donor}</td>
              <td className="p-4">{cert.date}</td>
              <td className="p-4">{cert.co2}</td>
              <td className="p-4">{cert.water}</td>
              <td className="p-4">{cert.status}</td>
              <td className="p-4 flex gap-2">
                <button className="text-blue-600 hover:underline" onClick={() => { setEditingId(cert.id); setEditData({ ...cert }); }}>Editar</button>
                <button className="text-green-600 hover:underline">Baixar PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal de edición */}
      <Dialog open={!!editingId} onOpenChange={v => { if (!v) { setEditingId(null); setEditData(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Certificado</DialogTitle>
          </DialogHeader>
          {editData && (
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); if (!editData) return; setCertificates(certs => certs.map(c => c.id === editData.id ? { ...editData } : c)); setEditingId(null); setEditData(null); }}>
              <div>
                <label className="block text-xs font-medium mb-1">Código</label>
                <input className="w-full border rounded px-2 py-1" value={editData.id} disabled />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Contribuinte</label>
                <input className="w-full border rounded px-2 py-1" value={editData.donor} onChange={e => setEditData({ ...editData, donor: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Data</label>
                <input type="date" className="w-full border rounded px-2 py-1" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">CO2</label>
                <input className="w-full border rounded px-2 py-1" value={editData.co2} onChange={e => setEditData({ ...editData, co2: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Água</label>
                <input className="w-full border rounded px-2 py-1" value={editData.water} onChange={e => setEditData({ ...editData, water: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Estado</label>
                <input className="w-full border rounded px-2 py-1" value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Salvar</button>
                <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded" onClick={() => { setEditingId(null); setEditData(null); }}>Cancelar</button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 