'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { SortConfig } from '@/hooks/useSortableData';

interface SortableTableHeadProps<T> {
  label: string;
  sortKey: keyof T;
  sortConfig: SortConfig<T> | null;
  onSort: (key: keyof T) => void;
  className?: string;
}

export function SortableTableHead<T>({
  label,
  sortKey,
  sortConfig,
  onSort,
  className,
}: SortableTableHeadProps<T>) {
  const isActive = sortConfig?.key === sortKey;
  const Icon = isActive
    ? sortConfig?.direction === 'asc'
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          'inline-flex items-center gap-1 font-medium hover:text-foreground',
          isActive ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        {label}
        <Icon className={cn('h-3.5 w-3.5', !isActive && 'opacity-50')} />
      </button>
    </TableHead>
  );
}
