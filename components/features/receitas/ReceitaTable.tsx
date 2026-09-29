'use client';

import { useMemo, useState } from 'react';
import { useReceitas, useRemoverReceita } from '@/hooks/useReceitas';
import { useSortableData } from '@/hooks/useSortableData';
import type { Receita } from '@/types/receita';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SortableTableHead } from '@/components/features/shared/SortableTableHead';
import { DadosSalvosLabel } from '@/components/features/layout/DadosSalvosLabel';
import { EmptyState } from '@/components/features/layout/EmptyState';
import { ErrorState } from '@/components/features/layout/ErrorState';
import { TableSkeleton } from '@/components/features/layout/TableSkeleton';
import { AdicionarLancamentoAction } from '@/components/features/lancamentos/AdicionarLancamentoAction';
import { LancamentosMobileView } from '@/components/features/lancamentos/LancamentosMobileView';
import { ListagemSkeleton } from '@/components/features/lancamentos/TxListSkeleton';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { fromReceita } from '@/lib/lancamentos/item';
import { Spinner } from '@/components/ui/spinner';
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
import { Button } from '@/components/ui/button';
import { EditarReceitaDialog } from './EditarReceitaDialog';
import { formatCompetencia, formatCurrency } from '@/lib/utils';

const CATEGORIA_LABELS: Record<string, string> = {
  SALARIO: 'Salário',
  FREELANCE: 'Freelance',
  INVESTIMENTO: 'Investimento',
  OUTROS: 'Outros',
};

interface ReceitaTableProps {
  competencia: string;
}

export function ReceitaTable({ competencia }: ReceitaTableProps) {
  const { data, isLoading, isError, refetch, isRefetching, dataUpdatedAt } = useReceitas(competencia);
  const remover = useRemoverReceita();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const itensMobile = useMemo(() => (data?.receitas ?? []).map(fromReceita), [data]);
  const { sortedData, sortConfig, requestSort } = useSortableData<Receita>(data?.receitas ?? []);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await remover.mutateAsync(id);
    } finally {
      setLoadingId(null);
    }
  };

  if (isDesktop === undefined) return <ListagemSkeleton />;

  if (isDesktop === false) {
    return (
      <LancamentosMobileView
        tipo="receita"
        competencia={competencia}
        items={itensMobile}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        isRetrying={isRefetching}
        dataUpdatedAt={dataUpdatedAt}
      />
    );
  }

  if (isLoading) return <TableSkeleton />;

  if (isError && !data) return <ErrorState onRetry={() => refetch()} isRetrying={isRefetching} />;

  if (!data?.receitas.length) {
    return (
      <EmptyState
        title={`Nenhuma receita em ${formatCompetencia(competencia)}`}
        message="Registre a primeira receita deste mês."
      >
        <AdicionarLancamentoAction tipo="receita" competencia={competencia} />
      </EmptyState>
    );
  }

  return (
    <>
    <DadosSalvosLabel updatedAt={dataUpdatedAt} isError={isError} />
    <Table>
      <TableHeader>
        <TableRow>
          <SortableTableHead<Receita>
            label="Descrição"
            sortKey="descricao"
            sortConfig={sortConfig}
            onSort={requestSort}
          />
          <SortableTableHead<Receita>
            label="Categoria"
            sortKey="categoria"
            sortConfig={sortConfig}
            onSort={requestSort}
          />
          <SortableTableHead<Receita>
            label="Valor"
            sortKey="valor"
            sortConfig={sortConfig}
            onSort={requestSort}
            className="text-right"
          />
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((receita) => (
          <TableRow key={receita.id}>
            <TableCell className="font-medium">{receita.descricao}</TableCell>
            <TableCell className="text-muted-foreground">
              {CATEGORIA_LABELS[receita.categoria] ?? receita.categoria}
            </TableCell>
            <TableCell className="text-right">{formatCurrency(receita.valor)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
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
                        <strong>&ldquo;{receita.descricao}&rdquo;</strong>? Esta ação não pode ser
                        desfeita.
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
