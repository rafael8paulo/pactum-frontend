'use client';

import { useState } from 'react';
import { usePatrimonio } from '@/hooks/usePatrimonio';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/features/layout/EmptyState';
import { ErrorState } from '@/components/features/layout/ErrorState';
import { formatCompetencia, formatCurrency } from '@/lib/utils';
import { NovoPatrimonioDialog } from './NovoPatrimonioDialog';
import { PatrimonioCard } from './PatrimonioCard';
import { PatrimonioDetailSheet } from './PatrimonioDetailSheet';
import { percentual } from './PatrimonioComposicao';

interface PatrimonioGridProps {
  competencia: string;
}

export function PatrimonioGrid({ competencia }: PatrimonioGridProps) {
  const { data, isLoading, isError, refetch, isRefetching } = usePatrimonio(competencia);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <>
        <div className="space-y-px md:hidden" aria-busy>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-none" />
          ))}
        </div>
        <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 md:grid lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </>
    );
  }

  if (isError && !data) return <ErrorState onRetry={() => refetch()} isRetrying={isRefetching} />;

  const itens = data?.patrimonios ?? [];

  if (itens.length === 0) {
    return (
      <EmptyState
        title={`Nenhum item em ${formatCompetencia(competencia)}`}
        message="Cadastre o primeiro item para acompanhar seu patrimônio."
      >
        <NovoPatrimonioDialog competenciaAtual={competencia} />
      </EmptyState>
    );
  }

  const total = itens.reduce((acc, i) => acc + i.valor, 0);
  const selecionado = itens.find((i) => i.id === selectedId) ?? null;

  return (
    <>
      {/* Mobile: lista de linha única com percentual */}
      <ul className="divide-y md:hidden">
        {itens.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setSelectedId(item.id)}
              className="flex min-h-[56px] w-full items-center gap-3 px-4 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.descricao}</span>
              <span className="font-numeric text-sm font-semibold tabular-nums">
                {formatCurrency(item.valor)}
              </span>
              <span className="w-10 text-right font-numeric text-xs tabular-nums text-muted-foreground">
                {percentual(item.valor, total)}%
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Desktop: grid de cards */}
      <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 md:grid lg:grid-cols-3">
        {itens.map((item) => (
          <PatrimonioCard key={item.id} patrimonio={item} />
        ))}
      </div>

      <PatrimonioDetailSheet
        item={selecionado}
        total={total}
        open={selecionado !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </>
  );
}
