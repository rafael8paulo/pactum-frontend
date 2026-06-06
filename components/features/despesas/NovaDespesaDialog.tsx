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
import { useCadastrarDespesa } from '@/hooks/useDespesas';

interface NovaDespesaDialogProps {
  competenciaAtual: string;
}

export function NovaDespesaDialog({ competenciaAtual }: NovaDespesaDialogProps) {
  const [open, setOpen] = useState(false);
  const cadastrar = useCadastrarDespesa();

  function handleSubmit(values: DespesaFormValues) {
    cadastrar.mutate(values, {
      onSuccess: () => setOpen(false),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova Despesa</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Despesa</DialogTitle>
        </DialogHeader>
        <DespesaForm
          defaultValues={{ competencia: competenciaAtual, status: 'PENDENTE' }}
          onSubmit={handleSubmit}
          isPending={cadastrar.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
