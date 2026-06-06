import { api } from './client';
import type { ResumoMensal, HistoricoAnualResponse } from '@/types/resumo';

export const resumoApi = {
  mensal: (competencia: string) =>
    api
      .get<ResumoMensal>('/api/v1/resumo', { params: { competencia } })
      .then((r) => r.data),

  anual: (ano: number) =>
    api
      .get<HistoricoAnualResponse>('/api/v1/resumo/anual', { params: { ano } })
      .then((r) => r.data),
};
