'use client';

import { useResumoMensal } from '@/hooks/useResumo';
import { DadosSalvosLabel } from '@/components/features/layout/DadosSalvosLabel';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatCurrency, percentualComprometido } from '@/lib/utils';

interface SaldoHeroProps {
  competencia: string;
}

/** Bloco único mobile: saldo em destaque, receitas e despesas subordinadas. */
export function SaldoHero({ competencia }: SaldoHeroProps) {
  const { data, isLoading, isError, dataUpdatedAt } = useResumoMensal(competencia);

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-5" aria-busy>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-2 h-10 w-48" />
        <Skeleton className="mt-4 h-2 w-full" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
        Resumo indisponível no momento.
      </div>
    );
  }

  const pct = percentualComprometido(data.totalReceitas, data.totalDespesas);

  return (
    <section aria-label="Resumo do mês" className="rounded-2xl border bg-card p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Saldo do mês</h2>
        <span className="text-xs font-medium text-muted-foreground">{pct}% comprometido</span>
      </div>
      <p
        className={cn(
          'mt-1 font-numeric text-4xl font-bold tabular-nums',
          data.saldo > 0 && 'text-pos',
          data.saldo < 0 && 'text-neg'
        )}
      >
        {formatCurrency(data.saldo)}
      </p>

      <div
        className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${pct}% da receita comprometida com despesas`}
      >
        <div className="h-full bg-neg" style={{ width: `${pct}%` }} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-pos-tint px-3 py-2">
          <dt className="text-xs text-pos">Receitas</dt>
          <dd className="font-numeric text-base font-semibold tabular-nums text-pos">
            {formatCurrency(data.totalReceitas)}
          </dd>
        </div>
        <div className="rounded-xl bg-neg-tint px-3 py-2">
          <dt className="text-xs text-neg">Despesas</dt>
          <dd className="font-numeric text-base font-semibold tabular-nums text-neg">
            {formatCurrency(data.totalDespesas)}
          </dd>
        </div>
      </dl>
      <div className="-mx-4 mt-3 empty:hidden">
        <DadosSalvosLabel updatedAt={dataUpdatedAt} isError={isError} />
      </div>
    </section>
  );
}
