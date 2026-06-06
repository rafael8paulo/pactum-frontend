export interface ResumoMensal {
  competencia: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface HistoricoAnualResponse {
  ano: number;
  meses: ResumoMensal[];
}
