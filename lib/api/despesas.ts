import { api } from './client';
import type {
  Despesa,
  CadastrarDespesaRequest,
  ListaDespesasResponse,
  DespesaFilters,
} from '@/types/despesa';

export const despesaApi = {
  listar: (competencia: string, filters?: DespesaFilters) =>
    api
      .get<ListaDespesasResponse>('/api/v1/despesas', {
        params: { competencia, ...filters },
      })
      .then((r) => r.data),

  cadastrar: (data: CadastrarDespesaRequest) =>
    api.post<Despesa>('/api/v1/despesas', data).then((r) => r.data),

  atualizar: (id: string, data: CadastrarDespesaRequest) =>
    api.put<Despesa>(`/api/v1/despesas/${id}`, data).then((r) => r.data),

  atualizarStatus: (id: string, status: Despesa['status']) =>
    api
      .patch<Despesa>(`/api/v1/despesas/${id}/status`, { status })
      .then((r) => r.data),

  remover: (id: string) => api.delete(`/api/v1/despesas/${id}`),
};
