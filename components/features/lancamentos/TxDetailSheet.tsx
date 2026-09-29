'use client';

import { useEffect, useState } from 'react';
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
import { SegmentedControl } from '@/components/ui/segmented-control';
import { DespesaForm, type DespesaFormValues } from '@/components/features/despesas/DespesaForm';
import { ReceitaForm, type ReceitaFormValues } from '@/components/features/receitas/ReceitaForm';
import {
  useAtualizarDespesa,
  useAtualizarStatusDespesa,
  useRemoverDespesa,
} from '@/hooks/useDespesas';
import { useAtualizarReceita, useRemoverReceita } from '@/hooks/useReceitas';
import { formatCompetencia, formatCurrency } from '@/lib/utils';
import {
  STATUS_LABELS,
  STATUS_ORDER,
  getCategoriaMeta,
} from '@/lib/lancamentos/constants';
import type { LancamentoItem } from '@/lib/lancamentos/item';
import type { CategoriaDespesa, StatusDespesa } from '@/types/despesa';
import type { CategoriaReceita } from '@/types/receita';

interface TxDetailSheetProps {
  item: LancamentoItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contexto?: string | null;
}

export function TxDetailSheet({ item, open, onOpenChange, contexto }: TxDetailSheetProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const atualizarStatus = useAtualizarStatusDespesa();
  const atualizarDespesa = useAtualizarDespesa();
  const atualizarReceita = useAtualizarReceita();
  const removerDespesa = useRemoverDespesa();
  const removerReceita = useRemoverReceita();

  // Sempre reabre no modo leitura.
  useEffect(() => {
    if (!open) setEditing(false);
  }, [open]);

  if (!item) return null;

  const categoria = getCategoriaMeta(item.tipo, item.categoria);
  const removing = item.tipo === 'despesa' ? removerDespesa.isPending : removerReceita.isPending;

  function handleRemove() {
    if (!item) return;
    const mutation = item.tipo === 'despesa' ? removerDespesa : removerReceita;
    mutation.mutate(item.id, {
      onSuccess: () => {
        setConfirmDelete(false);
        onOpenChange(false);
      },
    });
  }

  function handleEditDespesa(values: DespesaFormValues) {
    if (!item) return;
    atualizarDespesa.mutate(
      { id: item.id, data: values },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  function handleEditReceita(values: ReceitaFormValues) {
    if (!item) return;
    atualizarReceita.mutate(
      { id: item.id, data: values },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
        <DrawerHeader className="relative text-left">
          <DrawerTitle>{editing ? 'Editar lançamento' : item.descricao}</DrawerTitle>
          <DrawerDescription className={editing ? 'sr-only' : undefined}>
            {item.tipo === 'despesa' ? 'Despesa' : 'Receita'} · {categoria.label}
          </DrawerDescription>
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

        <div className="overflow-y-auto px-4 pb-4">
          {editing ? (
            item.tipo === 'despesa' ? (
              <DespesaForm
                hideCompetencia
                defaultValues={{
                  descricao: item.descricao,
                  valor: item.valor,
                  categoria: item.categoria as CategoriaDespesa,
                  status: item.status,
                  competencia: item.competencia,
                }}
                onSubmit={handleEditDespesa}
                isPending={atualizarDespesa.isPending}
              />
            ) : (
              <ReceitaForm
                hideCompetencia
                defaultValues={{
                  descricao: item.descricao,
                  valor: item.valor,
                  categoria: item.categoria as CategoriaReceita,
                  competencia: item.competencia,
                }}
                onSubmit={handleEditReceita}
                isPending={atualizarReceita.isPending}
              />
            )
          ) : (
            <div className="space-y-5">
              <p className="font-numeric text-3xl font-semibold tabular-nums">
                {formatCurrency(item.valor)}
              </p>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Categoria</dt>
                <dd className="text-right">{categoria.label}</dd>
                <dt className="text-muted-foreground">Competência</dt>
                <dd className="text-right capitalize">{formatCompetencia(item.competencia)}</dd>
                <dt className="text-muted-foreground">Origem</dt>
                <dd className="text-right">
                  {item.contaRecorrenteId
                    ? `Conta recorrente${contexto ? ` · ${contexto}` : ''}`
                    : 'Lançamento manual'}
                </dd>
              </dl>

              {item.tipo === 'despesa' && item.status && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Status
                  </p>
                  <SegmentedControl<StatusDespesa>
                    aria-label="Status da despesa"
                    value={item.status}
                    onValueChange={(status) =>
                      atualizarStatus.mutate({ id: item.id, status })
                    }
                    options={STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
                  />
                </div>
              )}

              <Button className="h-12 w-full" onClick={() => setEditing(true)}>
                Editar
              </Button>

              <div className="border-t pt-4">
                <Button
                  variant="ghost"
                  className="h-11 w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setConfirmDelete(true)}
                  disabled={removing}
                >
                  {removing ? <Spinner size="sm" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Excluir lançamento
                </Button>
              </div>
            </div>
          )}
        </div>

        <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Remover {item.tipo === 'despesa' ? 'despesa' : 'receita'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover{' '}
                <strong>&ldquo;{item.descricao}&rdquo;</strong>? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemove}
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
