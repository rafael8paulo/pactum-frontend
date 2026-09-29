'use client';

import { Button } from '@/components/ui/button';
import { NovaDespesaDialog } from '@/components/features/despesas/NovaDespesaDialog';
import { NovaReceitaDialog } from '@/components/features/receitas/NovaReceitaDialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { TipoLancamento } from '@/lib/lancamentos/constants';
import { useQuickAdd } from './QuickAddProvider';

interface AdicionarLancamentoActionProps {
  tipo: TipoLancamento;
  competencia: string;
}

/** Ação primária dos estados vazios: sheet em mobile, dialog em desktop. */
export function AdicionarLancamentoAction({ tipo, competencia }: AdicionarLancamentoActionProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { openQuickAdd } = useQuickAdd();

  if (isDesktop === false) {
    return (
      <Button className="h-11" onClick={() => openQuickAdd(tipo)}>
        Adicionar {tipo === 'despesa' ? 'despesa' : 'receita'}
      </Button>
    );
  }
  return tipo === 'despesa' ? (
    <NovaDespesaDialog competenciaAtual={competencia} />
  ) : (
    <NovaReceitaDialog competenciaAtual={competencia} />
  );
}
