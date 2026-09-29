'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { STATUS_LABELS_PLURAL, STATUS_ORDER } from '@/lib/lancamentos/constants';
import type { StatusDespesa } from '@/types/despesa';

interface FilterChipsProps {
  /** Contagem por status derivada da lista já carregada (sem filtro de status). */
  contagem: Record<StatusDespesa, number>;
  total: number;
  ativo?: StatusDespesa;
}

export function FilterChips({ contagem, total, ativo }: FilterChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function aplicar(status?: StatusDespesa) {
    const params = new URLSearchParams(searchParams.toString());
    if (status) params.set('status', status);
    else params.delete('status');
    router.replace(`${pathname}?${params.toString()}`);
  }

  const chips: { key: string; label: string; count: number; status?: StatusDespesa }[] = [
    { key: 'todas', label: 'Todas', count: total },
    ...STATUS_ORDER.map((status) => ({
      key: status,
      label: STATUS_LABELS_PLURAL[status],
      count: contagem[status],
      status,
    })),
  ];

  return (
    <div
      role="group"
      aria-label="Filtrar por status"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {chips.map((chip) => {
        const selected = chip.status === ativo;
        return (
          <button
            key={chip.key}
            type="button"
            aria-pressed={selected}
            onClick={() => aplicar(chip.status)}
            className={cn(
              'flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected
                ? 'border-brand bg-brand text-brand-foreground'
                : 'bg-card text-foreground hover:bg-accent'
            )}
          >
            {chip.label}
            <span
              className={cn(
                'font-numeric text-xs tabular-nums',
                selected ? 'text-brand-foreground/80' : 'text-muted-foreground'
              )}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
