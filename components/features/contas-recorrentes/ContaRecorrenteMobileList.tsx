'use client';

import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import type { ContaRecorrente } from '@/types/conta-recorrente';
import {
  FREQUENCIA_LABELS,
  STATUS_CONTA_LABELS,
  STATUS_CONTA_TEXT_CLASS,
} from './constants';
import { ContaRecorrenteDetailSheet, type ContaRecorrenteActions } from './ContaRecorrenteDetailSheet';

interface ContaRecorrenteMobileListProps extends ContaRecorrenteActions {
  contas: ContaRecorrente[];
  nomeFormaPagamento: (id: string | null) => string | null;
}

export function ContaRecorrenteMobileList({
  contas,
  nomeFormaPagamento,
  ...actions
}: ContaRecorrenteMobileListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selecionada = contas.find((c) => c.id === selectedId) ?? null;

  function contexto(conta: ContaRecorrente): string {
    return [
      FREQUENCIA_LABELS[conta.frequencia],
      conta.diaVencimento ? `dia ${conta.diaVencimento}` : null,
      nomeFormaPagamento(conta.formaPagamentoId),
    ]
      .filter(Boolean)
      .join(' · ');
  }

  return (
    <>
      <ul className="divide-y">
        {contas.map((conta) => (
          <li key={conta.id}>
            <button
              type="button"
              onClick={() => setSelectedId(conta.id)}
              className="flex min-h-[62px] w-full items-center gap-3 px-4 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{conta.descricao}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {contexto(conta)}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-numeric text-sm font-semibold tabular-nums">
                  {formatCurrency(conta.valorPadrao)}
                </span>
                <span className={cn('block text-xs font-medium', STATUS_CONTA_TEXT_CLASS[conta.status])}>
                  {STATUS_CONTA_LABELS[conta.status]}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <ContaRecorrenteDetailSheet
        conta={selecionada}
        contexto={selecionada ? contexto(selecionada) : ''}
        open={selecionada !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
        {...actions}
      />
    </>
  );
}
