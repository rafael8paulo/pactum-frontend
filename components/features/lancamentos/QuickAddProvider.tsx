'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { TipoLancamento } from '@/lib/lancamentos/constants';

interface QuickAddContextType {
  isOpen: boolean;
  tipoInicial: TipoLancamento;
  /** `tipo` explícito sobrescreve o tipo herdado do contexto da rota. */
  openQuickAdd: (tipo?: TipoLancamento) => void;
  setOpen: (open: boolean) => void;
}

const QuickAddContext = createContext<QuickAddContextType | null>(null);

export function QuickAddProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [tipoForcado, setTipoForcado] = useState<TipoLancamento | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // O tipo é herdado do contexto: em /lancamentos?tipo=receita abre como receita.
  const tipoDoContexto: TipoLancamento =
    pathname.startsWith('/lancamentos') && searchParams.get('tipo') === 'receita'
      ? 'receita'
      : 'despesa';

  const tipoInicial = tipoForcado ?? tipoDoContexto;

  const openQuickAdd = useCallback((tipo?: TipoLancamento) => {
    setTipoForcado(tipo ?? null);
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({ isOpen, tipoInicial, openQuickAdd, setOpen }),
    [isOpen, tipoInicial, openQuickAdd]
  );

  return <QuickAddContext.Provider value={value}>{children}</QuickAddContext.Provider>;
}

export function useQuickAdd() {
  const ctx = useContext(QuickAddContext);
  if (!ctx) throw new Error('useQuickAdd must be used within QuickAddProvider');
  return ctx;
}
