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
import { useAtualizarReceita } from '@/hooks/useReceitas';
import type { Receita } from '@/types/receita';

interface EditarReceitaDialogProps {
  receita: Receita;
}

export function EditarReceitaDialog({ receita }: EditarReceitaDialogProps) {
  const [open, setOpen] = useState(false);
  const atualizar = useAtualizarReceita();

  function handleSubmit(values: ReceitaFormValues) {
    atualizar.mutate(
      { id: receita.id, data: values },
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
          <DialogTitle>Editar Receita</DialogTitle>
        </DialogHeader>
        <ReceitaForm
          defaultValues={{
            descricao: receita.descricao,
            valor: receita.valor,
            categoria: receita.categoria,
            competencia: receita.competencia,
          }}
          onSubmit={handleSubmit}
          isPending={atualizar.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
