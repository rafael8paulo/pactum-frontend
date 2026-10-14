import { api } from './client';
import type {
  DefinirMetaRequest,
  HistoricoMetasResponse,
  MetaEconomia,
  ProgressoMeta,
} from '@/types/meta-economia';

export const metasEconomiaApi = {
  progresso: (competencia: string) =>
    api.get<ProgressoMeta>(`/api/v1/metas-economia/${competencia}`).then((r) => r.data),

  definir: (competencia: string, data: DefinirMetaRequest) =>
    api.put<MetaEconomia>(`/api/v1/metas-economia/${competencia}`, data).then((r) => r.data),

  remover: (competencia: string) => api.delete(`/api/v1/metas-economia/${competencia}`),

  historico: (ano: number) =>
    api
      .get<HistoricoMetasResponse>('/api/v1/metas-economia/historico', { params: { ano } })
      .then((r) => r.data),
};
