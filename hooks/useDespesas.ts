import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { despesaApi } from '@/lib/api/despesas';
import { getErrorMessage } from '@/lib/api/error';
import type {
  CadastrarDespesaRequest,
  DespesaFilters,
  ListaDespesasResponse,
  StatusDespesa,
} from '@/types/despesa';

export function useDespesas(competencia: string, filters?: DespesaFilters) {
  return useQuery<ListaDespesasResponse>({
    queryKey: ['despesas', competencia, filters],
    queryFn: () => despesaApi.listar(competencia, filters),
  });
}

export function useCadastrarDespesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CadastrarDespesaRequest) => despesaApi.cadastrar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      toast.success('Despesa cadastrada com sucesso.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useAtualizarDespesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CadastrarDespesaRequest }) =>
      despesaApi.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      toast.success('Despesa atualizada com sucesso.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useAtualizarStatusDespesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusDespesa }) =>
      despesaApi.atualizarStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      toast.success('Status atualizado.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useRemoverDespesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => despesaApi.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      toast.success('Despesa removida.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
