import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contaRecorrenteApi } from '@/lib/api/contas-recorrentes';
import { getErrorMessage } from '@/lib/api/error';
import type {
  CadastrarContaRecorrenteRequest,
  EditarContaRecorrenteRequest,
  ContaRecorrenteFilters,
  ListaContasRecorrentesResponse,
  StatusContaRecorrente,
} from '@/types/conta-recorrente';

export function useContasRecorrentes(filters?: ContaRecorrenteFilters) {
  return useQuery<ListaContasRecorrentesResponse>({
    queryKey: ['contas-recorrentes', filters],
    queryFn: () => contaRecorrenteApi.listar(filters),
  });
}

export function useCadastrarContaRecorrente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CadastrarContaRecorrenteRequest) => contaRecorrenteApi.cadastrar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-recorrentes'] });
      toast.success('Conta recorrente cadastrada com sucesso.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useAtualizarContaRecorrente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditarContaRecorrenteRequest }) =>
      contaRecorrenteApi.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-recorrentes'] });
      toast.success('Conta recorrente atualizada com sucesso.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useAtualizarStatusContaRecorrente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: StatusContaRecorrente }) =>
      contaRecorrenteApi.atualizarStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-recorrentes'] });
      toast.success('Status atualizado.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useRemoverContaRecorrente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contaRecorrenteApi.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-recorrentes'] });
      toast.success('Conta recorrente removida.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useGerarLancamentosRecorrentes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (competencia: string) => contaRecorrenteApi.gerar(competencia),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas-recorrentes'] });
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useGerarLoteLancamentosRecorrentes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contaRecorrenteId: string) => contaRecorrenteApi.gerarTodos(contaRecorrenteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
