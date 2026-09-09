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
import { Skeleton } from '@/components/ui/skeleton';
import { useHistoricoValores } from '@/hooks/useContasRecorrentes';
import { formatCurrency } from '@/lib/utils';

function formatData(data: string): string {
  const [year, month, day] = data.split('-');
  return `${day}/${month}/${year}`;
}

interface HistoricoValorDialogProps {
  contaRecorrenteId: string;
  descricao: string;
}

export function HistoricoValorDialog({
  contaRecorrenteId,
  descricao,
}: HistoricoValorDialogProps) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useHistoricoValores(contaRecorrenteId, open);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Ver histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Histórico de valores — {descricao}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {data?.historico.map((registro, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span className="font-medium">{formatCurrency(registro.valor)}</span>
                <span className="text-muted-foreground">
                  {registro.vigenteAte
                    ? `${formatData(registro.vigenteDesde)} – ${formatData(registro.vigenteAte)}`
                    : `desde ${formatData(registro.vigenteDesde)}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
