'use client';

import { useResumoAssinaturas } from '@/hooks/useContasRecorrentes';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

/** Card único mobile: total mensal comprometido + distribuição por forma de pagamento. */
export function RecorrentesResumoMobile() {
  const { data, isLoading } = useResumoAssinaturas();

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-5" aria-busy>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-9 w-44" />
        <Skeleton className="mt-4 h-2 w-full" />
        <Skeleton className="mt-4 h-5 w-full" />
        <Skeleton className="mt-2 h-5 w-full" />
      </div>
    );
  }

  const total = data?.totalMensalRecorrente ?? 0;
  const partes = data?.porFormaPagamento ?? [];

  return (
    <section aria-label="Compromisso mensal recorrente" className="rounded-2xl border bg-card p-5">
      <h2 className="text-sm font-medium text-muted-foreground">Compromisso mensal</h2>
      <p className="mt-1 font-numeric text-3xl font-bold tabular-nums">{formatCurrency(total)}</p>

      {partes.length > 0 && (
        <>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
            {partes.map((p, i) => (
              <div
                key={p.formaPagamentoId ?? 'sem-forma'}
                className="h-full border-r border-card last:border-r-0"
                style={{
                  width: `${total > 0 ? (p.totalMensal / total) * 100 : 0}%`,
                  opacity: 1 - Math.min(i, 4) * 0.2,
                  backgroundColor: 'hsl(var(--brand))',
                }}
              />
            ))}
          </div>
          <ul className="mt-3 space-y-1.5">
            {partes.map((p) => (
              <li
                key={p.formaPagamentoId ?? 'sem-forma'}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {p.nomeFormaPagamento ?? 'Sem forma de pagamento'}
                </span>
                <span className="font-numeric font-medium tabular-nums">
                  {formatCurrency(p.totalMensal)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
