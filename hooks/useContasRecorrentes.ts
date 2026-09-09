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
import type {
  ResumoAssinaturas,
  ListaProximasCobrancasResponse,
  ListaHistoricoValorResponse,
} from '@/types/resumo-assinaturas';

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

interface AtualizarContaRecorrenteVariables {
  id: string;
  data: EditarContaRecorrenteRequest;
  valorMudou: boolean;
}

export function useAtualizarContaRecorrente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: AtualizarContaRecorrenteVariables) =>
      contaRecorrenteApi.atualizar(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contas-recorrentes'] });
      toast.success(
        variables.valorMudou
          ? 'Conta recorrente atualizada. O valor anterior foi preservado no histórico.'
          : 'Conta recorrente atualizada com sucesso.'
      );
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

export function useResumoAssinaturas() {
  return useQuery<ResumoAssinaturas>({
    queryKey: ['contas-recorrentes', 'resumo'],
    queryFn: () => contaRecorrenteApi.consultarResumo(),
  });
}

export function useProximasCobrancas(dias?: number) {
  return useQuery<ListaProximasCobrancasResponse>({
    queryKey: ['contas-recorrentes', 'proximas-cobrancas', dias],
    queryFn: () => contaRecorrenteApi.consultarProximasCobrancas(dias),
  });
}

export function useHistoricoValores(id: string, enabled = true) {
  return useQuery<ListaHistoricoValorResponse>({
    queryKey: ['contas-recorrentes', id, 'historico-valores'],
    queryFn: () => contaRecorrenteApi.consultarHistoricoValores(id),
    enabled,
  });
}
