import { api } from './client';
import type { Patrimonio, CadastrarPatrimonioRequest, ListaPatrimonioResponse } from '@/types/patrimonio';

export const patrimonioApi = {
  listar: (competencia: string) =>
    api
      .get<ListaPatrimonioResponse>('/api/v1/patrimonio', { params: { competencia } })
      .then((r) => r.data),

  cadastrar: (data: CadastrarPatrimonioRequest) =>
    api.post<Patrimonio>('/api/v1/patrimonio', data).then((r) => r.data),

  remover: (id: string) => api.delete(`/api/v1/patrimonio/${id}`),
};
