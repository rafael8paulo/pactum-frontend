'use client';

import { useMemo, useState } from 'react';
import { useDespesas, useAtualizarStatusDespesa, useRemoverDespesa } from '@/hooks/useDespesas';
import { useSortableData } from '@/hooks/useSortableData';
import type { Despesa, DespesaFilters, StatusDespesa } from '@/types/despesa';
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
import { fromDespesa } from '@/lib/lancamentos/item';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { EditarDespesaDialog } from './EditarDespesaDialog';
import { formatCompetencia, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<StatusDespesa, string> = {
  PAGA: 'text-green-700 dark:text-green-400',
  PENDENTE: 'text-yellow-700 dark:text-yellow-400',
  AGENDADA: 'text-blue-700 dark:text-blue-400',
};

const STATUS_LABELS: Record<StatusDespesa, string> = {
  PAGA: 'Paga',
  PENDENTE: 'Pendente',
  AGENDADA: 'Agendada',
};

const STATUS_VALUES: StatusDespesa[] = ['PENDENTE', 'PAGA', 'AGENDADA'];

interface DespesaTableProps {
  competencia: string;
  filters?: DespesaFilters;
}

export function DespesaTable({ competencia, filters }: DespesaTableProps) {
  // O status é filtrado no cliente: a mesma lista (sem status) alimenta os
  // contadores dos chips e as duas apresentações.
  const { status: statusFiltro, ...filtrosServidor } = filters ?? {};
  const { data, isLoading, isError, refetch, isRefetching, dataUpdatedAt } = useDespesas(
    competencia,
    Object.keys(filtrosServidor).length > 0 ? filtrosServidor : undefined
  );
  const atualizarStatus = useAtualizarStatusDespesa();
  const remover = useRemoverDespesa();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const despesas = useMemo(
    () =>
      (data?.despesas ?? []).filter((d) => !statusFiltro || d.status === statusFiltro),
    [data, statusFiltro]
  );
  const { sortedData, sortConfig, requestSort } = useSortableData<Despesa>(
    despesas,
    { key: 'valor', direction: 'desc' }
  );
  const itensMobile = useMemo(() => (data?.despesas ?? []).map(fromDespesa), [data]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await remover.mutateAsync(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleStatusChange = async (id: string, status: StatusDespesa) => {
    setStatusLoadingId(id);
    try {
      await atualizarStatus.mutateAsync({ id, status });
    } finally {
      setStatusLoadingId(null);
    }
  };

  if (isDesktop === undefined) return <ListagemSkeleton />;

  if (isDesktop === false) {
    return (
      <LancamentosMobileView
        tipo="despesa"
        competencia={competencia}
        items={itensMobile}
        statusAtivo={statusFiltro}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        isRetrying={isRefetching}
        dataUpdatedAt={dataUpdatedAt}
        onMarcarPaga={(item) => atualizarStatus.mutate({ id: item.id, status: 'PAGA' })}
      />
    );
  }

  if (isLoading) return <TableSkeleton />;

  if (isError && !data) return <ErrorState onRetry={() => refetch()} isRetrying={isRefetching} />;

  if (!despesas.length) {
    return (
      <EmptyState
        title={`Nenhuma despesa em ${formatCompetencia(competencia)}`}
        message={
          statusFiltro || filtrosServidor.categoria
            ? 'Nenhuma despesa corresponde aos filtros ativos.'
            : 'Registre a primeira despesa deste mês.'
        }
      >
        <AdicionarLancamentoAction tipo="despesa" competencia={competencia} />
      </EmptyState>
    );
  }

  return (
    <>
    <DadosSalvosLabel updatedAt={dataUpdatedAt} isError={isError} />
    <Table>
      <TableHeader>
        <TableRow>
          <SortableTableHead<Despesa>
            label="Descrição"
            sortKey="descricao"
            sortConfig={sortConfig}
            onSort={requestSort}
          />
          <SortableTableHead<Despesa>
            label="Categoria"
            sortKey="categoria"
            sortConfig={sortConfig}
            onSort={requestSort}
          />
          <SortableTableHead<Despesa>
            label="Valor"
            sortKey="valor"
            sortConfig={sortConfig}
            onSort={requestSort}
            className="text-right"
          />
          <TableHead>Status</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((despesa) => (
          <TableRow key={despesa.id}>
            <TableCell className="font-medium">{despesa.descricao}</TableCell>
            <TableCell className="capitalize text-muted-foreground">
              {despesa.categoria.replace('_', ' ').toLowerCase()}
            </TableCell>
            <TableCell className="text-right">{formatCurrency(despesa.valor)}</TableCell>
            <TableCell>
              <Select
                value={despesa.status}
                onValueChange={(value) =>
                  handleStatusChange(despesa.id, value as StatusDespesa)
                }
                disabled={statusLoadingId === despesa.id}
              >
                <SelectTrigger
                  className={cn('w-32 border-none shadow-none', STATUS_COLORS[despesa.status])}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_VALUES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
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
                        <strong>&ldquo;{despesa.descricao}&rdquo;</strong>? Esta ação não pode ser desfeita.
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
