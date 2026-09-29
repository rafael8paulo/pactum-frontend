'use client';

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Check } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import {
  STATUS_LABELS,
  STATUS_TEXT_CLASS,
  getCategoriaMeta,
} from '@/lib/lancamentos/constants';
import type { LancamentoItem } from '@/lib/lancamentos/item';

/** Deslocamento horizontal (px) a partir do qual o gesto é confirmado. */
export const SWIPE_THRESHOLD = 96;
const SWIPE_MAX = 140;

interface TxRowProps {
  item: LancamentoItem;
  /** Segmento de contexto (ex.: forma de pagamento). Omitido quando não há. */
  contexto?: string | null;
  onOpen: (item: LancamentoItem) => void;
  /** Só é definido quando o gesto deve estar ativo (despesa não paga em mobile). */
  onMarcarPaga?: (item: LancamentoItem) => void;
}

export function TxRow({ item, contexto, onOpen, onMarcarPaga }: TxRowProps) {
  const [offset, setOffset] = useState(0);
  const categoria = getCategoriaMeta(item.tipo, item.categoria);
  const Icon = categoria.icon;
  const swipeEnabled = !!onMarcarPaga && item.tipo === 'despesa' && item.status !== 'PAGA';

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (!swipeEnabled) return;
      // só acompanha o dedo quando o movimento é predominantemente horizontal
      if (e.dir === 'Left') setOffset(-Math.min(e.absX, SWIPE_MAX));
      else setOffset(0);
    },
    onSwiped: (e) => {
      const confirmou = swipeEnabled && e.dir === 'Left' && e.absX >= SWIPE_THRESHOLD;
      setOffset(0);
      if (confirmou) onMarcarPaga?.(item);
    },
    delta: 30,
    preventScrollOnSwipe: false,
    trackMouse: false,
    trackTouch: swipeEnabled,
  });

  const meta = [categoria.label, contexto].filter(Boolean).join(' · ');

  return (
    <div className="relative overflow-hidden">
      {swipeEnabled && (
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 flex w-36 items-center justify-center gap-1.5 bg-pos text-sm font-medium text-background"
        >
          <Check className="h-4 w-4" />
          Marcar paga
        </div>
      )}
      <div
        {...handlers}
        style={{ transform: `translateX(${offset}px)` }}
        className={cn(
          'relative bg-background',
          offset === 0 && 'transition-transform motion-reduce:transition-none'
        )}
      >
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="flex min-h-[62px] w-full items-center gap-3 px-4 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand"
            aria-hidden
          >
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{item.descricao}</span>
            <span className="block truncate text-xs text-muted-foreground">{meta}</span>
          </span>
          <span className="shrink-0 text-right">
            <span
              className={cn(
                'block font-numeric text-sm font-semibold tabular-nums',
                item.tipo === 'receita' && 'text-pos'
              )}
            >
              {item.tipo === 'receita' ? '+ ' : ''}
              {formatCurrency(item.valor)}
            </span>
            {item.status && (
              <span className={cn('block text-xs font-medium', STATUS_TEXT_CLASS[item.status])}>
                {STATUS_LABELS[item.status]}
              </span>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
