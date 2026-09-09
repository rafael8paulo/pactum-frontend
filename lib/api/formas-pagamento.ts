import { api } from './client';
import type {
  FormaPagamento,
  CadastrarFormaPagamentoRequest,
  EditarFormaPagamentoRequest,
  ListaFormasPagamentoResponse,
} from '@/types/forma-pagamento';

export const formaPagamentoApi = {
  listar: () =>
    api.get<ListaFormasPagamentoResponse>('/api/v1/formas-pagamento').then((r) => r.data),

  cadastrar: (data: CadastrarFormaPagamentoRequest) =>
    api.post<FormaPagamento>('/api/v1/formas-pagamento', data).then((r) => r.data),

  atualizar: (id: string, data: EditarFormaPagamentoRequest) =>
    api.put<FormaPagamento>(`/api/v1/formas-pagamento/${id}`, data).then((r) => r.data),

  remover: (id: string) => api.delete(`/api/v1/formas-pagamento/${id}`),
};
