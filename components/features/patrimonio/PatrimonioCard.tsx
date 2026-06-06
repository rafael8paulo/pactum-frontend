'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Spinner } from '@/components/ui/spinner';
import { useRemoverPatrimonio } from '@/hooks/usePatrimonio';
import { formatCurrency } from '@/lib/utils';
import type { Patrimonio } from '@/types/patrimonio';

interface PatrimonioCardProps {
  patrimonio: Patrimonio;
}

export function PatrimonioCard({ patrimonio }: PatrimonioCardProps) {
  const remover = useRemoverPatrimonio();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await remover.mutateAsync(id);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{patrimonio.descricao}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{formatCurrency(patrimonio.valor)}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive px-0"
              disabled={loadingId === patrimonio.id}
            >
              {loadingId === patrimonio.id ? <Spinner size="sm" /> : 'Remover'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover item</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover{' '}
                <strong>&ldquo;{patrimonio.descricao}&rdquo;</strong>? Esta ação não pode ser
                desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(patrimonio.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
