'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/features/layout/EmptyState';
import { ErrorState } from '@/components/features/layout/ErrorState';
import { useHistoricoMetas } from '@/hooks/useMetasEconomia';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { variacaoVsMesAnterior } from '@/lib/metas-economia/historico';
import { cn, formatCompetencia, formatCurrency } from '@/lib/utils';
import { MetaProgressoBar } from './MetaProgressoBar';

const HistoricoMetasChart = dynamic(
  () => import('./HistoricoMetasChart').then((m) => m.HistoricoMetasChart),
  { ssr: false, loading: () => <Skeleton className="h-[260px] w-full" /> }
);

interface HistoricoMetasProps {
  anoInicial: number;
  competenciaAtual: string;
}

export function HistoricoMetas({ anoInicial, competenciaAtual }: HistoricoMetasProps) {
  const [ano, setAno] = useState(anoInicial);
  const { data, isLoading, isError, refetch, isRefetching } = useHistoricoMetas(ano);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const meses = data?.meses ?? [];
  const variacoes = variacaoVsMesAnterior(meses);

  return (
    <section aria-label="Histórico de metas" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Histórico de desempenho</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            aria-label="Ano anterior"
            onClick={() => setAno((a) => a - 1)}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Button>
          <span className="min-w-[3rem] text-center text-sm font-medium tabular-nums">{ano}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            aria-label="Próximo ano"
            onClick={() => setAno((a) => a + 1)}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-2xl" />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} isRetrying={isRefetching} />
      ) : meses.length === 0 ? (
        <EmptyState
          title={`Nenhuma meta em ${ano}`}
          message="Defina a meta do mês para começar a acompanhar sua evolução."
        >
          <Button asChild className="h-11">
            <Link href={`/mais/metas-economia?competencia=${competenciaAtual}`}>Definir meta do mês</Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          {isDesktop && <HistoricoMetasChart meses={meses} />}
          <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
            {meses.map((m, i) => {
              const variacao = variacoes[i];
              return (
                <li key={m.competencia} className="space-y-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium capitalize">{formatCompetencia(m.competencia)}</span>
                    <span
                      className={cn(
                        'flex items-center gap-1 text-sm font-semibold',
                        m.atingida ? 'text-pos' : 'text-neg'
                      )}
                    >
                      {m.atingida ? (
                        <Check className="h-4 w-4" aria-hidden />
                      ) : (
                        <X className="h-4 w-4" aria-hidden />
                      )}
                      {m.atingida ? 'Meta atingida' : 'Não atingida'}
                    </span>
                  </div>
                  <MetaProgressoBar percentual={m.percentual} />
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span>
                      {formatCurrency(m.valorEconomizado)} de {formatCurrency(m.valorMeta)} ·{' '}
                      {Math.round(m.percentual)}%
                    </span>
                    {variacao !== null && variacao !== 0 && (
                      <span
                        className={cn(
                          'flex items-center gap-1 text-xs',
                          variacao > 0 ? 'text-pos' : 'text-neg'
                        )}
                      >
                        {variacao > 0 ? (
                          <ArrowUp className="h-3 w-3" aria-hidden />
                        ) : (
                          <ArrowDown className="h-3 w-3" aria-hidden />
                        )}
                        {Math.abs(Math.round(variacao))} p.p. vs. mês anterior
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
