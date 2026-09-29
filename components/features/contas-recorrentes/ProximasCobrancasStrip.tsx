'use client';

import { useProximasCobrancas } from '@/hooks/useContasRecorrentes';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

function diaMes(data: string): string {
  const [, month, day] = data.split('-');
  return `${day}/${month}`;
}

/** Faixa horizontal das próximas cobranças (7 dias). Oculta quando não há nenhuma. */
export function ProximasCobrancasStrip() {
  const { data, isLoading } = useProximasCobrancas();

  if (isLoading) {
    return (
      <div className="flex gap-2" aria-busy>
        <Skeleton className="h-16 w-36 shrink-0 rounded-xl" />
        <Skeleton className="h-16 w-36 shrink-0 rounded-xl" />
      </div>
    );
  }

  const itens = data?.proximasCobrancas ?? [];
  if (itens.length === 0) return null;

  return (
    <section aria-label="Próximas cobranças">
      <h2 className="mb-2 text-sm font-medium text-muted-foreground">Próximas cobranças</h2>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {itens.map((item) => (
          <li
            key={item.contaRecorrenteId}
            className="w-36 shrink-0 rounded-xl border bg-card p-3"
          >
            <p className="truncate text-sm font-medium">{item.descricao}</p>
            <p className="font-numeric text-sm tabular-nums">{formatCurrency(item.valorPadrao)}</p>
            <p className="text-xs text-muted-foreground">{diaMes(item.proximaCobranca)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
