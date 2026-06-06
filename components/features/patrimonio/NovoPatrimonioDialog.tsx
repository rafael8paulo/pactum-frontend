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
import { PatrimonioForm } from './PatrimonioForm';
import type { PatrimonioFormValues } from './PatrimonioForm';
import { useCadastrarPatrimonio } from '@/hooks/usePatrimonio';

interface NovoPatrimonioDialogProps {
  competenciaAtual: string;
}

export function NovoPatrimonioDialog({ competenciaAtual }: NovoPatrimonioDialogProps) {
  const [open, setOpen] = useState(false);
  const cadastrar = useCadastrarPatrimonio();

  function handleSubmit(values: PatrimonioFormValues) {
    cadastrar.mutate(values, {
      onSuccess: () => setOpen(false),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Item</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Item de Patrimônio</DialogTitle>
        </DialogHeader>
        <PatrimonioForm
          defaultValues={{ competencia: competenciaAtual }}
          onSubmit={handleSubmit}
          isPending={cadastrar.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
