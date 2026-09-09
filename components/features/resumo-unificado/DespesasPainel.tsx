'use client';

import { useState } from 'react';
import { useDespesas, useAtualizarStatusDespesa, useRemoverDespesa } from '@/hooks/useDespesas';
import { NovaDespesaDialog } from '@/components/features/despesas/NovaDespesaDialog';
import { EditarDespesaDialog } from '@/components/features/despesas/EditarDespesaDialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatCurrency, cn } from '@/lib/utils';
import type { Despesa } from '@/types/despesa';

type StatusFiltro = 'todos' | 'pendentes' | 'pagos';

const FILTROS: { value: StatusFiltro; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendentes', label: 'Pendentes' },
  { value: 'pagos', label: 'Pagos' },
];

function isPago(despesa: Despesa) {
  return despesa.status === 'PAGA';
}

interface DespesasPainelProps {
  competencia: string;
}

export function DespesasPainel({ competencia }: DespesasPainelProps) {
  const { data, isLoading } = useDespesas(competencia);
  const atualizarStatus = useAtualizarStatusDespesa();
  const remover = useRemoverDespesa();
  const [filtro, setFiltro] = useState<StatusFiltro>('todos');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

  const despesas = data?.despesas ?? [];
  const filtradas = despesas.filter((d) => {
    if (filtro === 'pendentes') return !isPago(d);
    if (filtro === 'pagos') return isPago(d);
    return true;
  });
  const pendentesCount = despesas.filter((d) => !isPago(d)).length;

  async function handleDelete(id: string) {
    setLoadingId(id);
    try {
      await remover.mutateAsync(id);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleToggleStatus(despesa: Despesa) {
    setStatusLoadingId(despesa.id);
    try {
      await atualizarStatus.mutateAsync({
        id: despesa.id,
        status: isPago(despesa) ? 'PENDENTE' : 'PAGA',
      });
    } finally {
      setStatusLoadingId(null);
    }
  }

  const emptyMessage =
    filtro === 'pagos'
      ? `Nenhuma despesa paga em ${competencia}.`
      : filtro === 'pendentes'
        ? `Nenhuma despesa pendente em ${competencia}.`
        : `Nenhuma despesa encontrada para ${competencia}.`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-red-600">Despesas</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {data
              ? `${despesas.length} lançamento${despesas.length === 1 ? '' : 's'} · ${pendentesCount} pendente${pendentesCount === 1 ? '' : 's'}`
              : '—'}
          </p>
        </div>
        <NovaDespesaDialog competenciaAtual={competencia} />
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex gap-1.5">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFiltro(f.value)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                filtro === f.value
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-input text-muted-foreground hover:bg-accent'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )}

        {!isLoading && filtradas.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</p>
        )}

        <div className="space-y-1">
          {!isLoading &&
            filtradas.map((despesa) => {
              const pago = isPago(despesa);
              return (
                <div
                  key={despesa.id}
                  className="flex items-center justify-between gap-3 border-b py-3 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{despesa.descricao}</p>
                    <p className="text-xs text-muted-foreground">
                      {despesa.categoria.replace('_', ' ').toLowerCase()}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-medium">
                    {formatCurrency(despesa.valor)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(despesa)}
                    disabled={statusLoadingId === despesa.id}
                    className={cn(
                      'shrink-0 rounded-md px-2 py-1 text-xs font-semibold transition-colors',
                      pago
                        ? 'bg-green-600/10 text-green-700 dark:text-green-400'
                        : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                    )}
                  >
                    {statusLoadingId === despesa.id ? <Spinner size="sm" /> : pago ? 'Pago' : 'Pendente'}
                  </button>
                  <div className="flex shrink-0 gap-1">
                    <EditarDespesaDialog despesa={despesa} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={loadingId === despesa.id}
                        >
                          {loadingId === despesa.id ? <Spinner size="sm" /> : 'Remover'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover despesa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover a despesa{' '}
                            <strong>&ldquo;{despesa.descricao}&rdquo;</strong>? Esta ação não pode
                            ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(despesa.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
