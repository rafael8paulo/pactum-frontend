'use client';

import { useState } from 'react';
import { useReceitas, useRemoverReceita } from '@/hooks/useReceitas';
import { NovaReceitaDialog } from '@/components/features/receitas/NovaReceitaDialog';
import { EditarReceitaDialog } from '@/components/features/receitas/EditarReceitaDialog';
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
import { formatCurrency } from '@/lib/utils';

const CATEGORIA_LABELS: Record<string, string> = {
  SALARIO: 'Salário',
  FREELANCE: 'Freelance',
  INVESTIMENTO: 'Investimento',
  OUTROS: 'Outros',
};

interface ReceitasPainelProps {
  competencia: string;
}

export function ReceitasPainel({ competencia }: ReceitasPainelProps) {
  const { data, isLoading } = useReceitas(competencia);
  const remover = useRemoverReceita();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id);
    try {
      await remover.mutateAsync(id);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-green-600">Receitas</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {data ? `${data.receitas.length} lançamento${data.receitas.length === 1 ? '' : 's'}` : '—'}
          </p>
        </div>
        <NovaReceitaDialog competenciaAtual={competencia} />
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )}

        {!isLoading && !data?.receitas.length && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhuma receita encontrada para {competencia}.
          </p>
        )}

        {!isLoading &&
          data?.receitas.map((receita) => (
            <div
              key={receita.id}
              className="flex items-center justify-between gap-3 border-b py-3 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{receita.descricao}</p>
                <p className="text-xs text-muted-foreground">
                  {CATEGORIA_LABELS[receita.categoria] ?? receita.categoria}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-sm font-medium text-green-600">
                  {formatCurrency(receita.valor)}
                </span>
                <div className="flex gap-1">
                  <EditarReceitaDialog receita={receita} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={loadingId === receita.id}
                      >
                        {loadingId === receita.id ? <Spinner size="sm" /> : 'Remover'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover receita</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover a receita{' '}
                          <strong>&ldquo;{receita.descricao}&rdquo;</strong>? Esta ação não pode
                          ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(receita.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
