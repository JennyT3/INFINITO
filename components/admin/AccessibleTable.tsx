"use client";
import { ReactNode, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AccessibleTableProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
}

interface AccessibleTableHeaderProps {
  children: ReactNode;
  className?: string;
  scope?: 'col' | 'row';
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
}

interface AccessibleTableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  'aria-selected'?: boolean;
  tabIndex?: number;
}

interface AccessibleTableCellProps {
  children: ReactNode;
  className?: string;
  scope?: 'col' | 'row';
  headers?: string;
}

export function AccessibleTable({ 
  children, 
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  role = 'table'
}: AccessibleTableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn("min-w-full divide-y divide-gray-200", className)}
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
      >
        {children}
      </table>
    </div>
  );
}

export function AccessibleTableHeader({ 
  children, 
  className = '',
  scope = 'col',
  sortable = false,
  onSort,
  sortDirection
}: AccessibleTableHeaderProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (sortable && onSort && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onSort();
    }
  };

  return (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
        sortable && "cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      scope={scope}
      onClick={sortable ? onSort : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={sortable ? 0 : undefined}
      role={sortable ? 'button' : undefined}
      aria-sort={sortable ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : undefined}
      aria-label={sortable ? `Sort by ${children}` : undefined}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <span className="ml-1">
            {sortDirection === 'asc' && '↑'}
            {sortDirection === 'desc' && '↓'}
            {!sortDirection && '↕'}
          </span>
        )}
      </div>
    </th>
  );
}

export function AccessibleTableRow({ 
  children, 
  className = '',
  onClick,
  selected = false,
  'aria-selected': ariaSelected,
  tabIndex
}: AccessibleTableRowProps) {
  const rowRef = useRef<HTMLTableRowElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <tr
      ref={rowRef}
      className={cn(
        "hover:bg-gray-50 transition-colors",
        selected && "bg-blue-50",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role={onClick ? 'button' : undefined}
      aria-selected={ariaSelected}
    >
      {children}
    </tr>
  );
}

export function AccessibleTableCell({ 
  children, 
  className = '',
  scope,
  headers
}: AccessibleTableCellProps) {
  return (
    <td
      className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-900", className)}
      scope={scope}
      headers={headers}
    >
      {children}
    </td>
  );
}

// Hook para manejar selección de filas con teclado
export function useTableSelection() {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [focusedRow, setFocusedRow] = useState<number | null>(null);

  const handleRowSelect = (rowId: number, isMultiSelect: boolean = false) => {
    if (isMultiSelect) {
      setSelectedRows(prev => {
        const newSet = new Set(prev);
        if (newSet.has(rowId)) {
          newSet.delete(rowId);
        } else {
          newSet.add(rowId);
        }
        return newSet;
      });
    } else {
      setSelectedRows(new Set([rowId]));
    }
  };

  const handleRowFocus = (rowId: number) => {
    setFocusedRow(rowId);
  };

  const handleKeyboardNavigation = (event: React.KeyboardEvent, rowIds: number[]) => {
    if (!focusedRow) return;

    const currentIndex = rowIds.indexOf(focusedRow);
    if (currentIndex === -1) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, rowIds.length - 1);
        setFocusedRow(rowIds[nextIndex]);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        setFocusedRow(rowIds[prevIndex]);
        break;
      case ' ':
        event.preventDefault();
        handleRowSelect(focusedRow, event.shiftKey);
        break;
    }
  };

  return {
    selectedRows,
    focusedRow,
    handleRowSelect,
    handleRowFocus,
    handleKeyboardNavigation,
    clearSelection: () => setSelectedRows(new Set())
  };
} 