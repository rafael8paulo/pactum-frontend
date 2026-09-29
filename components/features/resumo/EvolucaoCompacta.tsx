'use client';

import { useHistoricoAnual } from '@/hooks/useResumo';
import { Skeleton } from '@/components/ui/skeleton';
import { addMonths, cn, formatCurrency } from '@/lib/utils';

const MES_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const ALTURA_MAX = 72;

interface EvolucaoCompactaProps {
  competencia: string;
}

/** Faixa de 6 meses em CSS puro (sem Recharts), ancorada na competência ativa. */
export function EvolucaoCompacta({ competencia }: EvolucaoCompactaProps) {
  const ano = Number(competencia.split('-')[0]);
  const meses = Array.from({ length: 6 }, (_, i) => addMonths(competencia, i - 5));
  const precisaAnoAnterior = meses.some((m) => Number(m.split('-')[0]) !== ano);

  const atual = useHistoricoAnual(ano);
  const anterior = useHistoricoAnual(ano - 1, { enabled: precisaAnoAnterior });

  if (atual.isLoading || (precisaAnoAnterior && anterior.isLoading)) {
    return (
      <div className="rounded-2xl border bg-card p-4" aria-busy>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-[112px] w-full" />
      </div>
    );
  }

  const todos = [...(anterior.data?.meses ?? []), ...(atual.data?.meses ?? [])];
  const serie = meses.map((m) => {
    const dado = todos.find((d) => d.competencia === m);
    return {
      competencia: m,
      label: MES_LABELS[Number(m.split('-')[1]) - 1],
      receitas: dado?.totalReceitas ?? 0,
      despesas: dado?.totalDespesas ?? 0,
    };
  });
  const maximo = Math.max(1, ...serie.flatMap((s) => [s.receitas, s.despesas]));
  const ativo = serie[serie.length - 1];

  return (
    <section aria-label="Evolução dos últimos seis meses" className="rounded-2xl border bg-card p-4">
      <h2 className="text-sm font-medium text-muted-foreground">Últimos 6 meses</h2>

      <div className="mt-3 flex items-end justify-between gap-2" style={{ height: ALTURA_MAX + 24 }}>
        {serie.map((s) => {
          const destaque = s.competencia === competencia;
          return (
            <div key={s.competencia} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  'flex w-full items-end justify-center gap-1 rounded-md px-1',
                  destaque && 'bg-brand-tint'
                )}
                style={{ height: ALTURA_MAX }}
                role="img"
                aria-label={`${s.label}: receitas ${formatCurrency(s.receitas)}, despesas ${formatCurrency(s.despesas)}`}
              >
                <div
                  className="w-2.5 rounded-t-sm bg-pos"
                  style={{ height: Math.max(2, (s.receitas / maximo) * ALTURA_MAX) }}
                />
                <div
                  className="w-2.5 rounded-t-sm bg-neg"
                  style={{ height: Math.max(2, (s.despesas / maximo) * ALTURA_MAX) }}
                />
              </div>
              <span
                className={cn(
                  'text-xs',
                  destaque ? 'font-semibold text-brand' : 'text-muted-foreground'
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <dl className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t pt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-pos" aria-hidden />
          <dt className="text-muted-foreground">Receitas</dt>
          <dd className="font-numeric font-semibold tabular-nums">{formatCurrency(ativo.receitas)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-neg" aria-hidden />
          <dt className="text-muted-foreground">Despesas</dt>
          <dd className="font-numeric font-semibold tabular-nums">{formatCurrency(ativo.despesas)}</dd>
        </div>
      </dl>
    </section>
  );
}
