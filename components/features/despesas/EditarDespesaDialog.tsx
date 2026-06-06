'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DespesaForm } from './DespesaForm';
import type { DespesaFormValues } from './DespesaForm';
import { useAtualizarDespesa } from '@/hooks/useDespesas';
import type { Despesa } from '@/types/despesa';

interface EditarDespesaDialogProps {
  despesa: Despesa;
}

export function EditarDespesaDialog({ despesa }: EditarDespesaDialogProps) {
  const [open, setOpen] = useState(false);
  const atualizar = useAtualizarDespesa();

  function handleSubmit(values: DespesaFormValues) {
    atualizar.mutate(
      { id: despesa.id, data: values },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Despesa</DialogTitle>
        </DialogHeader>
        <DespesaForm
          defaultValues={{
            descricao: despesa.descricao,
            valor: despesa.valor,
            categoria: despesa.categoria,
            status: despesa.status,
            competencia: despesa.competencia,
          }}
          onSubmit={handleSubmit}
          isPending={atualizar.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
