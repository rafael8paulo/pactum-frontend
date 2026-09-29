'use client';

import { useState } from 'react';
import { ResponsiveDialog } from '@/components/features/shared/ResponsiveDialog';
import { Button } from '@/components/ui/button';
import { ContaRecorrenteForm } from './ContaRecorrenteForm';
import type { ContaRecorrenteFormValues } from './ContaRecorrenteForm';
import { useAtualizarContaRecorrente } from '@/hooks/useContasRecorrentes';
import type { ContaRecorrente } from '@/types/conta-recorrente';

interface EditarContaRecorrenteDialogProps {
  contaRecorrente: ContaRecorrente;
}

export function EditarContaRecorrenteDialog({
  contaRecorrente,
}: EditarContaRecorrenteDialogProps) {
  const [open, setOpen] = useState(false);
  const atualizar = useAtualizarContaRecorrente();

  function handleSubmit(values: ContaRecorrenteFormValues) {
    const valorMudou = values.valorPadrao !== contaRecorrente.valorPadrao;
    atualizar.mutate(
      { id: contaRecorrente.id, data: values, valorMudou },
      { onSuccess: () => setOpen(false) }
    );
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="Editar Conta Recorrente"
      trigger={
        <Button variant="ghost" size="sm">
          Editar
        </Button>
      }
    >
      <ContaRecorrenteForm
        defaultValues={{
          descricao: contaRecorrente.descricao,
          valorPadrao: contaRecorrente.valorPadrao,
          categoria: contaRecorrente.categoria,
          diaVencimento: contaRecorrente.diaVencimento ?? undefined,
          competenciaInicio: contaRecorrente.competenciaInicio,
          competenciaFim: contaRecorrente.competenciaFim ?? undefined,
          frequencia: contaRecorrente.frequencia,
          dataBaseCobranca: contaRecorrente.dataBaseCobranca,
          formaPagamentoId: contaRecorrente.formaPagamentoId ?? undefined,
        }}
        onSubmit={handleSubmit}
        isPending={atualizar.isPending}
      />
    </ResponsiveDialog>
  );
}
