'use client';

import { useState } from 'react';
import { ResponsiveDialog } from '@/components/features/shared/ResponsiveDialog';
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
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="Novo Item de Patrimônio"
      trigger={
        <Button>Novo Item</Button>
      }
    >
      <PatrimonioForm
        defaultValues={{ competencia: competenciaAtual }}
        onSubmit={handleSubmit}
        isPending={cadastrar.isPending}
      />
    </ResponsiveDialog>
  );
}
