'use client';

import Link from 'next/link';
import { ChevronRight, Target } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/features/layout/ErrorState';
import { useProgressoMeta } from '@/hooks/useMetasEconomia';
import { ehCompetenciaPassada } from '@/lib/metas-economia/historico';
import { formatCompetencia, formatCurrency, getCurrentCompetencia } from '@/lib/utils';
import { MarcoCelebracao } from './MarcoCelebracao';
import { MetaFeedbackMessage } from './MetaFeedbackMessage';
import { MetaProgressoBar } from './MetaProgressoBar';

interface MetaEconomiaCardProps {
  competencia: string;
  /** Na própria página de gestão o link "Gerenciar" é redundante. */
  linkGerenciar?: boolean;
}

function Detalhe({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{rotulo}</dt>
      <dd className="font-numeric text-sm font-semibold tabular-nums">{valor}</dd>
    </div>
  );
}

export function MetaEconomiaCard({ competencia, linkGerenciar = true }: MetaEconomiaCardProps) {
  const { data, isLoading, isError, refetch, isRefetching } = useProgressoMeta(competencia);
  const href = `/mais/metas-economia?competencia=${competencia}`;
  const passada = ehCompetenciaPassada(competencia, getCurrentCompetencia());

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-5" aria-busy>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-8 w-24" />
        <Skeleton className="mt-4 h-3 w-full" />
        <Skeleton className="mt-4 h-12 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border bg-card">
        <ErrorState
          title="Não foi possível carregar a meta"
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <section aria-label="Meta de economia" className="rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Target className="h-4 w-4" aria-hidden />
          Meta de economia
        </div>
        <p className="mt-2 font-semibold">
          {passada
            ? `Nenhuma meta definida para ${formatCompetencia(competencia)}.`
            : 'Quanto você quer guardar neste mês?'}
        </p>
        {!passada && (
          <>
            <p className="mt-1 text-sm text-muted-foreground">
              Defina uma meta e acompanhe seu ritmo de economia dia a dia.
            </p>
            {linkGerenciar && (
              <Button asChild className="mt-3 h-11">
                <Link href={href}>Definir meta</Link>
              </Button>
            )}
          </>
        )}
      </section>
    );
  }

  return (
    <section aria-label="Meta de economia" className="space-y-4 rounded-2xl border bg-card p-5">
      {!passada && (
        <MarcoCelebracao competencia={competencia} marcosAtingidos={data.marcosAtingidos} />
      )}

      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Target className="h-4 w-4" aria-hidden />
            Meta de economia
          </h2>
          <p className="mt-1 font-numeric text-3xl font-bold tabular-nums">
            {Math.round(data.percentual)}%
          </p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.valorEconomizado)} de {formatCurrency(data.valorMeta)}
          </p>
        </div>
        {linkGerenciar && (
          <Link
            href={href}
            className="flex min-h-[44px] items-center gap-1 text-sm font-medium text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Gerenciar
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>

      <MetaProgressoBar percentual={data.percentual} />

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Detalhe rotulo="Falta" valor={formatCurrency(data.valorRestante)} />
        {data.diasRestantes > 0 && (
          <>
            <Detalhe rotulo="Dias restantes" valor={String(data.diasRestantes)} />
            <Detalhe rotulo="Por dia" valor={formatCurrency(data.valorDiarioNecessario)} />
          </>
        )}
        <Detalhe
          rotulo={passada ? 'Resultado final' : 'Projeção do mês'}
          valor={formatCurrency(data.projecaoFechamento)}
        />
      </dl>

      <MetaFeedbackMessage progresso={data} />
    </section>
  );
}
