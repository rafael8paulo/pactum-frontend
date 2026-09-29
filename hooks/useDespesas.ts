import { useQuery, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';
import { despesaApi } from '@/lib/api/despesas';
import { getErrorMessage } from '@/lib/api/error';
import type {
  CadastrarDespesaRequest,
  Despesa,
  DespesaFilters,
  ListaDespesasResponse,
  StatusDespesa,
} from '@/types/despesa';

const DURACAO_TOAST_DESFAZER = 6000;

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
    onSuccess: (criada) => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      toast.success('Despesa cadastrada com sucesso.', {
        duration: DURACAO_TOAST_DESFAZER,
        action: {
          label: 'Desfazer',
          onClick: () => {
            despesaApi
              .remover(criada.id)
              .then(() => toast.success('Cadastro desfeito.'))
              .catch((error) => toast.error(getErrorMessage(error)))
              // reflete o que de fato está persistido, com sucesso ou falha
              .finally(() => {
                queryClient.invalidateQueries({ queryKey: ['despesas'] });
                queryClient.invalidateQueries({ queryKey: ['resumo'] });
              });
          },
        },
      });
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

interface AtualizarStatusVars {
  id: string;
  status: StatusDespesa;
  /** true quando a chamada é o "Desfazer" de outra — não oferece novo desfazer. */
  desfazendo?: boolean;
}

interface AtualizarStatusContext {
  snapshots: [QueryKey, ListaDespesasResponse | undefined][];
  statusAnterior?: StatusDespesa;
}

export function useAtualizarStatusDespesa() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Despesa, unknown, AtualizarStatusVars, AtualizarStatusContext>({
    mutationFn: ({ id, status }) => despesaApi.atualizarStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['despesas'] });
      const snapshots = queryClient.getQueriesData<ListaDespesasResponse>({
        queryKey: ['despesas'],
      });
      const statusAnterior = snapshots
        .flatMap(([, lista]) => lista?.despesas ?? [])
        .find((d) => d.id === id)?.status;

      queryClient.setQueriesData<ListaDespesasResponse>(
        { queryKey: ['despesas'] },
        (lista) =>
          lista && {
            ...lista,
            despesas: lista.despesas.map((d) => (d.id === id ? { ...d, status } : d)),
          }
      );
      return { snapshots, statusAnterior };
    },
    onError: (error, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error(getErrorMessage(error));
    },
    onSuccess: (_data, { id, desfazendo }, context) => {
      const anterior = context?.statusAnterior;
      if (desfazendo) {
        toast.success('Alteração desfeita.');
      } else if (anterior) {
        toast.success('Status atualizado.', {
          duration: DURACAO_TOAST_DESFAZER,
          action: {
            label: 'Desfazer',
            onClick: () => mutation.mutate({ id, status: anterior, desfazendo: true }),
          },
        });
      } else {
        toast.success('Status atualizado.');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
    },
  });

  return mutation;
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
