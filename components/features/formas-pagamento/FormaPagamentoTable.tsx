'use client';

import { useState } from 'react';
import { useFormasPagamento, useRemoverFormaPagamento } from '@/hooks/useFormasPagamento';
import type { TipoFormaPagamento } from '@/types/forma-pagamento';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { EditarFormaPagamentoDialog } from './EditarFormaPagamentoDialog';
import { TableSkeleton } from '@/components/features/layout/TableSkeleton';
import { EmptyState } from '@/components/features/layout/EmptyState';

const TIPO_LABELS: Record<TipoFormaPagamento, string> = {
  CARTAO_CREDITO: 'Cartão de Crédito',
  CARTAO_DEBITO: 'Cartão de Débito',
  CONTA_CORRENTE: 'Conta Corrente',
  PIX: 'Pix',
  OUTRO: 'Outro',
};

export function FormaPagamentoTable() {
  const { data, isLoading } = useFormasPagamento();
  const remover = useRemoverFormaPagamento();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await remover.mutateAsync(id);
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <TableSkeleton />;

  if (!data?.formasPagamento.length) {
    return (
      <EmptyState message="Nenhuma forma de pagamento cadastrada. Cadastre a primeira para vincular às suas assinaturas." />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Dia de fechamento da fatura</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.formasPagamento.map((forma) => (
          <TableRow key={forma.id}>
            <TableCell className="font-medium">{forma.nome}</TableCell>
            <TableCell className="text-muted-foreground">{TIPO_LABELS[forma.tipo]}</TableCell>
            <TableCell>{forma.diaFechamentoFatura ?? '—'}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <EditarFormaPagamentoDialog formaPagamento={forma} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={loadingId === forma.id}
                    >
                      {loadingId === forma.id ? <Spinner size="sm" /> : 'Remover'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover forma de pagamento</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover <strong>&ldquo;{forma.nome}&rdquo;</strong>?
                        Contas recorrentes vinculadas a ela ficarão sem forma de pagamento
                        definida. Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(forma.id)}
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
  );
}
