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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova Conta Recorrente</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conta Recorrente</DialogTitle>
        </DialogHeader>
        <ContaRecorrenteForm
          onSubmit={handleSubmit}
          isPending={cadastrar.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
