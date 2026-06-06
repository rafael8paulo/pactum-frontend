export type StatusDespesa = 'PAGA' | 'PENDENTE' | 'AGENDADA';

export type CategoriaDespesa =
  | 'FINANCIAMENTO'
  | 'CARTAO_CREDITO'
  | 'EDUCACAO'
  | 'SERVICOS'
  | 'LAZER'
  | 'IMPOSTO'
  | 'OUTROS';

export interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  status: StatusDespesa;
  competencia: string;
  categoria: CategoriaDespesa;
}

export interface CadastrarDespesaRequest {
  descricao: string;
  valor: number;
  status: StatusDespesa;
  competencia: string;
  categoria: CategoriaDespesa;
}

export interface ListaDespesasResponse {
  despesas: Despesa[];
  total: number;
}

export interface DespesaFilters {
  status?: StatusDespesa;
  categoria?: CategoriaDespesa;
}
