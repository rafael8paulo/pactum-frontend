import type { CategoriaDespesa } from './despesa';

export type StatusContaRecorrente = 'ATIVA' | 'PAUSADA' | 'ENCERRADA';

export type FrequenciaCobranca = 'SEMANAL' | 'MENSAL' | 'TRIMESTRAL' | 'ANUAL';

export interface ContaRecorrente {
  id: string;
  descricao: string;
  valorPadrao: number;
  categoria: CategoriaDespesa;
  diaVencimento: number | null;
  competenciaInicio: string;
  competenciaFim: string | null;
  status: StatusContaRecorrente;
  frequencia: FrequenciaCobranca;
  formaPagamentoId: string | null;
  dataBaseCobranca: string;
  proximaCobranca: string | null;
}

export interface CadastrarContaRecorrenteRequest {
  descricao: string;
  valorPadrao: number;
  categoria: CategoriaDespesa;
  diaVencimento?: number | null;
  competenciaInicio: string;
  competenciaFim?: string | null;
  frequencia: FrequenciaCobranca;
  dataBaseCobranca: string;
  formaPagamentoId?: string | null;
}

export interface EditarContaRecorrenteRequest {
  descricao: string;
  valorPadrao: number;
  categoria: CategoriaDespesa;
  diaVencimento?: number | null;
  competenciaInicio: string;
  competenciaFim?: string | null;
  frequencia: FrequenciaCobranca;
  dataBaseCobranca: string;
  formaPagamentoId?: string | null;
}

export interface ListaContasRecorrentesResponse {
  contasRecorrentes: ContaRecorrente[];
  total: number;
}

export interface ContaRecorrenteFilters {
  status?: StatusContaRecorrente;
}
