'use client';

import { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { formatCurrency } from '@/lib/utils';
import type { ContaRecorrente, StatusContaRecorrente } from '@/types/conta-recorrente';
import { EditarContaRecorrenteDialog } from './EditarContaRecorrenteDialog';
import { HistoricoValorDialog } from './HistoricoValorDialog';
import { STATUS_CONTA_LABELS } from './constants';

export interface ContaRecorrenteActions {
  onStatusChange: (id: string, status: StatusContaRecorrente) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  statusLoadingId: string | null;
  removingId: string | null;
}

interface ContaRecorrenteDetailSheetProps extends ContaRecorrenteActions {
  conta: ContaRecorrente | null;
  contexto: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContaRecorrenteDetailSheet({
  conta,
  contexto,
  open,
  onOpenChange,
  onStatusChange,
  onRemove,
  statusLoadingId,
  removingId,
}: ContaRecorrenteDetailSheetProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!conta) return null;

  const statusLoading = statusLoadingId === conta.id;
  const removing = removingId === conta.id;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
        <DrawerHeader className="relative text-left">
          <DrawerTitle>{conta.descricao}</DrawerTitle>
          <DrawerDescription>{contexto}</DrawerDescription>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-11 w-11"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="space-y-5 overflow-y-auto px-4 pb-4">
          <p className="font-numeric text-3xl font-semibold tabular-nums">
            {formatCurrency(conta.valorPadrao)}
          </p>
          <p className="text-sm text-muted-foreground">
            Status: <span className="font-medium text-foreground">{STATUS_CONTA_LABELS[conta.status]}</span>
          </p>

          <div className="flex flex-wrap gap-2">
            {statusLoading ? (
              <Spinner size="sm" />
            ) : (
              <>
                {conta.status === 'ATIVA' && (
                  <Button variant="outline" className="h-11" onClick={() => onStatusChange(conta.id, 'PAUSADA')}>
                    Pausar
                  </Button>
                )}
                {conta.status === 'PAUSADA' && (
                  <Button variant="outline" className="h-11" onClick={() => onStatusChange(conta.id, 'ATIVA')}>
                    Reativar
                  </Button>
                )}
                {conta.status !== 'ENCERRADA' && (
                  <Button variant="outline" className="h-11" onClick={() => onStatusChange(conta.id, 'ENCERRADA')}>
                    Encerrar
                  </Button>
                )}
              </>
            )}
            <HistoricoValorDialog contaRecorrenteId={conta.id} descricao={conta.descricao} />
            <EditarContaRecorrenteDialog contaRecorrente={conta} />
          </div>

          <div className="border-t pt-4">
            <Button
              variant="ghost"
              className="h-11 w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmDelete(true)}
              disabled={removing}
            >
              {removing ? <Spinner size="sm" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Remover conta recorrente
            </Button>
          </div>
        </div>

        <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover conta recorrente</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover a conta recorrente{' '}
                <strong>&ldquo;{conta.descricao}&rdquo;</strong>? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await onRemove(conta.id);
                  setConfirmDelete(false);
                  onOpenChange(false);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DrawerContent>
    </Drawer>
  );
}
