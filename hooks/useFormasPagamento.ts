import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formaPagamentoApi } from '@/lib/api/formas-pagamento';
import { getErrorMessage } from '@/lib/api/error';
import type {
  CadastrarFormaPagamentoRequest,
  EditarFormaPagamentoRequest,
  ListaFormasPagamentoResponse,
} from '@/types/forma-pagamento';

export function useFormasPagamento() {
  return useQuery<ListaFormasPagamentoResponse>({
    queryKey: ['formas-pagamento'],
    queryFn: () => formaPagamentoApi.listar(),
  });
}

export function useCadastrarFormaPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CadastrarFormaPagamentoRequest) => formaPagamentoApi.cadastrar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formas-pagamento'] });
      toast.success('Forma de pagamento cadastrada com sucesso.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useEditarFormaPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarFormaPagamentoRequest }) =>
      formaPagamentoApi.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formas-pagamento'] });
      toast.success('Forma de pagamento atualizada com sucesso.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useRemoverFormaPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => formaPagamentoApi.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formas-pagamento'] });
      queryClient.invalidateQueries({ queryKey: ['contas-recorrentes'] });
      toast.success('Forma de pagamento removida.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
