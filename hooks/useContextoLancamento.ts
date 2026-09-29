import { useCallback } from 'react';
import { useContasRecorrentes } from '@/hooks/useContasRecorrentes';
import { useFormasPagamento } from '@/hooks/useFormasPagamento';
import type { LancamentoItem } from '@/lib/lancamentos/item';

/**
 * Resolve o segmento de contexto de um lançamento (forma de pagamento) via
 * `contaRecorrenteId`. Retorna null quando não há como resolver — nunca um
 * placeholder.
 */
export function useContextoLancamento() {
  const { data: contas } = useContasRecorrentes();
  const { data: formas } = useFormasPagamento();

  return useCallback(
    (item: LancamentoItem): string | null => {
      if (!item.contaRecorrenteId) return null;
      const conta = contas?.contasRecorrentes.find((c) => c.id === item.contaRecorrenteId);
      if (!conta?.formaPagamentoId) return null;
      return formas?.formasPagamento.find((f) => f.id === conta.formaPagamentoId)?.nome ?? null;
    },
    [contas, formas]
  );
}
