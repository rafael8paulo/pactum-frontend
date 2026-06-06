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
import { ReceitaForm } from './ReceitaForm';
import type { ReceitaFormValues } from './ReceitaForm';
import { useCadastrarReceita } from '@/hooks/useReceitas';

interface NovaReceitaDialogProps {
  competenciaAtual: string;
}

export function NovaReceitaDialog({ competenciaAtual }: NovaReceitaDialogProps) {
  const [open, setOpen] = useState(false);
  const cadastrar = useCadastrarReceita();

  function handleSubmit(values: ReceitaFormValues) {
    cadastrar.mutate(values, {
      onSuccess: () => setOpen(false),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova Receita</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Receita</DialogTitle>
        </DialogHeader>
        <ReceitaForm
          defaultValues={{ competencia: competenciaAtual }}
          onSubmit={handleSubmit}
          isPending={cadastrar.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
