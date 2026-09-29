'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ClockAlert } from '@/lib/icons';
import { useDespesas } from '@/hooks/useDespesas';
import { formatCurrency } from '@/lib/utils';

interface PendentesAvisoProps {
  competencia: string;
}

/** Aviso acionável de despesas pendentes da competência. Oculto sem pendências. */
export function PendentesAviso({ competencia }: PendentesAvisoProps) {
  // mesma queryKey da listagem sem filtros: compartilha cache com /lancamentos
  const { data } = useDespesas(competencia);
  const pendentes = (data?.despesas ?? []).filter((d) => d.status === 'PENDENTE');

  if (pendentes.length === 0) return null;

  const total = pendentes.reduce((acc, d) => acc + d.valor, 0);

  return (
    <Link
      href={`/lancamentos?tipo=despesa&status=PENDENTE&competencia=${competencia}`}
      className="flex min-h-[56px] items-center gap-3 rounded-2xl bg-warn-tint px-4 py-3 text-warn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ClockAlert className="h-5 w-5 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1 text-sm">
        <span className="block font-semibold">
          {pendentes.length} {pendentes.length === 1 ? 'despesa pendente' : 'despesas pendentes'}
        </span>
        <span className="block font-numeric tabular-nums">{formatCurrency(total)} a pagar</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
    </Link>
  );
}
