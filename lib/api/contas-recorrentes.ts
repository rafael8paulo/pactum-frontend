import { api } from './client';
import type {
  ContaRecorrente,
  CadastrarContaRecorrenteRequest,
  EditarContaRecorrenteRequest,
  ListaContasRecorrentesResponse,
  ContaRecorrenteFilters,
} from '@/types/conta-recorrente';
import type { ListaDespesasResponse } from '@/types/despesa';
import type {
  ResumoAssinaturas,
  ListaProximasCobrancasResponse,
  ListaHistoricoValorResponse,
} from '@/types/resumo-assinaturas';

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

  consultarResumo: () =>
    api.get<ResumoAssinaturas>('/api/v1/contas-recorrentes/resumo').then((r) => r.data),

  consultarProximasCobrancas: (dias?: number) =>
    api
      .get<ListaProximasCobrancasResponse>('/api/v1/contas-recorrentes/proximas-cobrancas', {
        params: dias !== undefined ? { dias } : undefined,
      })
      .then((r) => r.data),

  consultarHistoricoValores: (id: string) =>
    api
      .get<ListaHistoricoValorResponse>(`/api/v1/contas-recorrentes/${id}/historico-valores`)
      .then((r) => r.data),
};
