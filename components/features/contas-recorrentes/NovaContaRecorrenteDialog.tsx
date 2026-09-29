'use client';

import { useState } from 'react';
import { ResponsiveDialog } from '@/components/features/shared/ResponsiveDialog';
import { Button } from '@/components/ui/button';
import { ContaRecorrenteForm } from './ContaRecorrenteForm';
import type { ContaRecorrenteFormValues } from './ContaRecorrenteForm';
import { useCadastrarContaRecorrente } from '@/hooks/useContasRecorrentes';

export function NovaContaRecorrenteDialog() {
  const [open, setOpen] = useState(false);
  const cadastrar = useCadastrarContaRecorrente();

  function handleSubmit(values: ContaRecorrenteFormValues) {
    cadastrar.mutate(values, {
      onSuccess: () => setOpen(false),
    });
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="Nova Conta Recorrente"
      trigger={
        <Button>Nova Conta Recorrente</Button>
      }
    >
      <ContaRecorrenteForm
      onSubmit={handleSubmit}
      isPending={cadastrar.isPending}
      />
    </ResponsiveDialog>
  );
}
