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
import { useCadastrarFormaPagamento } from '@/hooks/useFormasPagamento';

export function NovaFormaPagamentoDialog() {
  const [open, setOpen] = useState(false);
  const cadastrar = useCadastrarFormaPagamento();

  function handleSubmit(values: FormaPagamentoFormValues) {
    cadastrar.mutate(values, {
      onSuccess: () => setOpen(false),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova Forma de Pagamento</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Forma de Pagamento</DialogTitle>
        </DialogHeader>
        <FormaPagamentoForm onSubmit={handleSubmit} isPending={cadastrar.isPending} />
      </DialogContent>
    </Dialog>
  );
}
