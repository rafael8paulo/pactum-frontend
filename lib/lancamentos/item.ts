import type { Despesa, StatusDespesa } from '@/types/despesa';
import type { Receita } from '@/types/receita';

/** Forma comum usada pela apresentação mobile (lista, detalhe, agrupamento). */
export interface LancamentoItem {
  id: string;
  tipo: 'despesa' | 'receita';
  descricao: string;
  valor: number;
  categoria: string;
  competencia: string;
  status?: StatusDespesa;
  contaRecorrenteId?: string | null;
  data?: string | null;
}

export function fromDespesa(d: Despesa): LancamentoItem {
  return {
    id: d.id,
    tipo: 'despesa',
    descricao: d.descricao,
    valor: d.valor,
    categoria: d.categoria,
    competencia: d.competencia,
    status: d.status,
    contaRecorrenteId: d.contaRecorrenteId,
    data: d.data,
  };
}

export function fromReceita(r: Receita): LancamentoItem {
  return {
    id: r.id,
    tipo: 'receita',
    descricao: r.descricao,
    valor: r.valor,
    categoria: r.categoria,
    competencia: r.competencia,
    data: r.data,
  };
}
