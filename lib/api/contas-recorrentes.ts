import { api } from './client';
import type {
  ContaRecorrente,
  CadastrarContaRecorrenteRequest,
  EditarContaRecorrenteRequest,
  ListaContasRecorrentesResponse,
  ContaRecorrenteFilters,
} from '@/types/conta-recorrente';
import type { ListaDespesasResponse } from '@/types/despesa';

export const contaRecorrenteApi = {
  listar: (filters?: ContaRecorrenteFilters) =>
    api
      .get<ListaContasRecorrentesResponse>('/api/v1/contas-recorrentes', {
        params: filters,
      })
      .then((r) => r.data),

  cadastrar: (data: CadastrarContaRecorrenteRequest) =>
    api.post<ContaRecorrente>('/api/v1/contas-recorrentes', data).then((r) => r.data),

  atualizar: (id: string, data: EditarContaRecorrenteRequest) =>
    api.put<ContaRecorrente>(`/api/v1/contas-recorrentes/${id}`, data).then((r) => r.data),

  atualizarStatus: (id: string, status: ContaRecorrente['status']) =>
    api
      .patch<ContaRecorrente>(`/api/v1/contas-recorrentes/${id}/status`, { status })
      .then((r) => r.data),

  remover: (id: string) => api.delete(`/api/v1/contas-recorrentes/${id}`),

  gerar: (competencia: string) =>
    api
      .post<ListaDespesasResponse>('/api/v1/contas-recorrentes/gerar', null, {
        params: { competencia },
      })
      .then((r) => r.data),

  gerarTodos: (id: string) =>
    api
      .post<ListaDespesasResponse>(`/api/v1/contas-recorrentes/${id}/gerar-todos`)
      .then((r) => r.data),
};
