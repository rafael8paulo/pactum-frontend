import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { despesaApi } from '@/lib/api/despesas';
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
      toast.success('Despesa cadastrada com sucesso.');
    },
    onError: () => {
      toast.error('Erro ao cadastrar despesa. Tente novamente.');
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
      toast.success('Despesa atualizada com sucesso.');
    },
    onError: () => {
      toast.error('Erro ao atualizar despesa. Tente novamente.');
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
      toast.success('Status atualizado.');
    },
    onError: () => {
      toast.error('Erro ao atualizar status. Tente novamente.');
    },
  });
}

export function useRemoverDespesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => despesaApi.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      toast.success('Despesa removida.');
    },
    onError: () => {
      toast.error('Erro ao remover despesa.');
    },
  });
}
