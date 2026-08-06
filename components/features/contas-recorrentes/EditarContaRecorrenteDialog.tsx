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
import { ContaRecorrenteForm } from './ContaRecorrenteForm';
import type { ContaRecorrenteFormValues } from './ContaRecorrenteForm';
import { useAtualizarContaRecorrente } from '@/hooks/useContasRecorrentes';
import type { ContaRecorrente } from '@/types/conta-recorrente';

interface EditarContaRecorrenteDialogProps {
  contaRecorrente: ContaRecorrente;
}

export function EditarContaRecorrenteDialog({
  contaRecorrente,
}: EditarContaRecorrenteDialogProps) {
  const [open, setOpen] = useState(false);
  const atualizar = useAtualizarContaRecorrente();

  function handleSubmit(values: ContaRecorrenteFormValues) {
    atualizar.mutate(
      { id: contaRecorrente.id, data: values },
      { onSuccess: () => setOpen(false) }
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
          <DialogTitle>Editar Conta Recorrente</DialogTitle>
        </DialogHeader>
        <ContaRecorrenteForm
          defaultValues={{
            descricao: contaRecorrente.descricao,
            valorPadrao: contaRecorrente.valorPadrao,
            categoria: contaRecorrente.categoria,
            diaVencimento: contaRecorrente.diaVencimento ?? undefined,
            competenciaInicio: contaRecorrente.competenciaInicio,
            competenciaFim: contaRecorrente.competenciaFim ?? undefined,
          }}
          onSubmit={handleSubmit}
          isPending={atualizar.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
