export type TipoFormaPagamento =
  | 'CARTAO_CREDITO'
  | 'CARTAO_DEBITO'
  | 'CONTA_CORRENTE'
  | 'PIX'
  | 'OUTRO';

export interface FormaPagamento {
  id: string;
  nome: string;
  tipo: TipoFormaPagamento;
  diaFechamentoFatura: number | null;
}

export interface CadastrarFormaPagamentoRequest {
  nome: string;
  tipo: TipoFormaPagamento;
  diaFechamentoFatura?: number | null;
}

export interface EditarFormaPagamentoRequest {
  nome: string;
  tipo: TipoFormaPagamento;
  diaFechamentoFatura?: number | null;
}

export interface ListaFormasPagamentoResponse {
  formasPagamento: FormaPagamento[];
}
