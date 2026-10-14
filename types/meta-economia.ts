export type StatusMeta = 'CONCLUIDA' | 'ADIANTADA' | 'NO_PLANEJADO' | 'EM_RISCO';

export interface MetaEconomia {
  competencia: string;
  valor: number;
}

export interface DefinirMetaRequest {
  valor: number;
}

export interface ProgressoMeta {
  competencia: string;
  valorMeta: number;
  valorEconomizado: number;
  valorRestante: number;
  percentual: number;
  diasRestantes: number;
  valorDiarioNecessario: number;
  projecaoFechamento: number;
  status: StatusMeta;
  marcosAtingidos: number[];
}

export interface HistoricoMetaItem {
  competencia: string;
  valorMeta: number;
  valorEconomizado: number;
  percentual: number;
  atingida: boolean;
}

export interface HistoricoMetasResponse {
  ano: number;
  meses: HistoricoMetaItem[];
}
