'use client';

import { useState } from 'react';
import { useReceitas, useRemoverReceita } from '@/hooks/useReceitas';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageLoader } from '@/components/ui/page-loader';
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
import { formatCurrency } from '@/lib/utils';

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
  const { data, isLoading } = useReceitas(competencia);
  const remover = useRemoverReceita();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await remover.mutateAsync(id);
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return <PageLoader />;

  if (!data?.receitas.length) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Nenhuma receita encontrada para {competencia}.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.receitas.map((receita) => (
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
  );
}
