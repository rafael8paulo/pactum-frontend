'use client';

import { useState } from 'react';
import { ResponsiveDialog } from '@/components/features/shared/ResponsiveDialog';
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
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="Nova Forma de Pagamento"
      trigger={
        <Button>Nova Forma de Pagamento</Button>
      }
    >
      <FormaPagamentoForm onSubmit={handleSubmit} isPending={cadastrar.isPending} />
    </ResponsiveDialog>
  );
}
