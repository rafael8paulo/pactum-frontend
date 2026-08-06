import type { CategoriaDespesa } from './despesa';

export type StatusContaRecorrente = 'ATIVA' | 'PAUSADA' | 'ENCERRADA';

export interface ContaRecorrente {
  id: string;
  descricao: string;
  valorPadrao: number;
  categoria: CategoriaDespesa;
  diaVencimento: number | null;
  competenciaInicio: string;
  competenciaFim: string | null;
  status: StatusContaRecorrente;
}

export interface CadastrarContaRecorrenteRequest {
  descricao: string;
  valorPadrao: number;
  categoria: CategoriaDespesa;
  diaVencimento?: number | null;
  competenciaInicio: string;
  competenciaFim?: string | null;
}

export interface EditarContaRecorrenteRequest {
  descricao: string;
  valorPadrao: number;
  categoria: CategoriaDespesa;
  diaVencimento?: number | null;
  competenciaInicio: string;
  competenciaFim?: string | null;
}

export interface ListaContasRecorrentesResponse {
  contasRecorrentes: ContaRecorrente[];
  total: number;
}

export interface ContaRecorrenteFilters {
  status?: StatusContaRecorrente;
}
