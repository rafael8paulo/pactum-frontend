'use client';

import { useProgressoMeta } from '@/hooks/useMetasEconomia';
import { saldoDisponivelAposMeta } from '@/lib/metas-economia/disponivel';
import { cn, formatCurrency } from '@/lib/utils';

interface SaldoAposMetaProps {
  competencia: string;
  className?: string;
}

/** Saldo do mês menos a meta de economia. Omitido sem meta, carregando ou em erro. */
export function SaldoAposMeta({ competencia, className }: SaldoAposMetaProps) {
  const { data } = useProgressoMeta(competencia);
  if (!data) return null;

  const { valor, situacao } = saldoDisponivelAposMeta(data);

  return (
    <div className={cn('flex flex-wrap items-baseline justify-between gap-x-2', className)}>
      <span className="text-xs text-muted-foreground">Disponível após a meta</span>
      <span className="flex flex-col items-end">
        <span
          className={cn(
            'font-numeric text-sm font-semibold tabular-nums',
            situacao === 'positivo' && 'text-pos',
            situacao === 'negativo' && 'text-neg',
            situacao === 'zero' && 'text-muted-foreground'
          )}
        >
          {formatCurrency(valor)}
        </span>
        {situacao === 'negativo' && <span className="text-xs text-neg">Saldo abaixo da meta</span>}
      </span>
    </div>
  );
}
