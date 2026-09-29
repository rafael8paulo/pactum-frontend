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
import { useRemoverPatrimonio } from '@/hooks/usePatrimonio';
import { formatCurrency } from '@/lib/utils';
import type { Patrimonio } from '@/types/patrimonio';
import { percentual } from './PatrimonioComposicao';

interface PatrimonioDetailSheetProps {
  item: Patrimonio | null;
  total: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatrimonioDetailSheet({ item, total, open, onOpenChange }: PatrimonioDetailSheetProps) {
  const remover = useRemoverPatrimonio();
  const [confirmando, setConfirmando] = useState(false);
  if (!item) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
        <DrawerHeader className="relative text-left">
          <DrawerTitle>{item.descricao}</DrawerTitle>
          <DrawerDescription>
            {percentual(item.valor, total)}% do patrimônio da competência
          </DrawerDescription>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-11 w-11" aria-label="Fechar">
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="space-y-5 px-4 pb-4">
          <p className="font-numeric text-3xl font-semibold tabular-nums">{formatCurrency(item.valor)}</p>
          <div className="border-t pt-4">
            <Button
              variant="ghost"
              className="h-11 w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirmando(true)}
              disabled={remover.isPending}
            >
              {remover.isPending ? <Spinner size="sm" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Remover item
            </Button>
          </div>
        </div>
        <AlertDialog open={confirmando} onOpenChange={setConfirmando}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover item</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover <strong>&ldquo;{item.descricao}&rdquo;</strong>? Esta
                ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  remover.mutate(item.id, {
                    onSuccess: () => {
                      setConfirmando(false);
                      onOpenChange(false);
                    },
                  })
                }
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
