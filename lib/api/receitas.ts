import { api } from './client';
import type {
  Receita,
  CadastrarReceitaRequest,
  ListaReceitasResponse,
} from '@/types/receita';

export const receitaApi = {
  listar: (competencia: string) =>
    api
      .get<ListaReceitasResponse>('/api/v1/receitas', {
        params: { competencia },
      })
      .then((r) => r.data),

  cadastrar: (data: CadastrarReceitaRequest) =>
    api.post<Receita>('/api/v1/receitas', data).then((r) => r.data),

  atualizar: (id: string, data: CadastrarReceitaRequest) =>
    api.put<Receita>(`/api/v1/receitas/${id}`, data).then((r) => r.data),

  remover: (id: string) => api.delete(`/api/v1/receitas/${id}`),
};
