export interface TotalPorFormaPagamento {
  formaPagamentoId: string | null;
  nomeFormaPagamento: string | null;
  totalMensal: number;
}

export interface ResumoAssinaturas {
  totalMensalRecorrente: number;
  porFormaPagamento: TotalPorFormaPagamento[];
}

export interface ProximaCobranca {
  contaRecorrenteId: string;
  descricao: string;
  valorPadrao: number;
  formaPagamentoId: string | null;
  proximaCobranca: string;
}

export interface ListaProximasCobrancasResponse {
  proximasCobrancas: ProximaCobranca[];
}

export interface HistoricoValor {
  valor: number;
  vigenteDesde: string;
  vigenteAte: string | null;
}

export interface ListaHistoricoValorResponse {
  historico: HistoricoValor[];
}
