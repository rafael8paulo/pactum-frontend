import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

function compareValues(a: unknown, b: unknown, direction: SortDirection): number {
  let result: number;

  if (typeof a === 'number' && typeof b === 'number') {
    result = a - b;
  } else {
    result = String(a).localeCompare(String(b), 'pt-BR');
  }

  return direction === 'asc' ? result : -result;
}

export function useSortableData<T>(data: T[], initialSort?: SortConfig<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(initialSort ?? null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) =>
      compareValues(a[sortConfig.key], b[sortConfig.key], sortConfig.direction)
    );
  }, [data, sortConfig]);

  const requestSort = (key: keyof T) => {
    setSortConfig((current) => {
      if (current?.key !== key) return { key, direction: 'asc' };
      if (current.direction === 'asc') return { key, direction: 'desc' };
      return initialSort ?? null;
    });
  };

  return { sortedData, sortConfig, requestSort };
}
