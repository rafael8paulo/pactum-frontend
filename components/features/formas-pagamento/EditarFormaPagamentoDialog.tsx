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
import { FormaPagamentoForm } from './FormaPagamentoForm';
import type { FormaPagamentoFormValues } from './FormaPagamentoForm';
import { useEditarFormaPagamento } from '@/hooks/useFormasPagamento';
import type { FormaPagamento } from '@/types/forma-pagamento';

interface EditarFormaPagamentoDialogProps {
  formaPagamento: FormaPagamento;
}

export function EditarFormaPagamentoDialog({
  formaPagamento,
}: EditarFormaPagamentoDialogProps) {
  const [open, setOpen] = useState(false);
  const atualizar = useEditarFormaPagamento();

  function handleSubmit(values: FormaPagamentoFormValues) {
    atualizar.mutate(
      { id: formaPagamento.id, data: values },
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
          <DialogTitle>Editar Forma de Pagamento</DialogTitle>
        </DialogHeader>
        <FormaPagamentoForm
          defaultValues={{
            nome: formaPagamento.nome,
            tipo: formaPagamento.tipo,
            diaFechamentoFatura: formaPagamento.diaFechamentoFatura ?? undefined,
          }}
          onSubmit={handleSubmit}
          isPending={atualizar.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
