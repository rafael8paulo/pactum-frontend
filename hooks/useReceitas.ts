import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { receitaApi } from '@/lib/api/receitas';
import { getErrorMessage } from '@/lib/api/error';
import type { CadastrarReceitaRequest, ListaReceitasResponse } from '@/types/receita';

export function useReceitas(competencia: string) {
  return useQuery<ListaReceitasResponse>({
    queryKey: ['receitas', competencia],
    queryFn: () => receitaApi.listar(competencia),
  });
}

export function useCadastrarReceita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CadastrarReceitaRequest) => receitaApi.cadastrar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      toast.success('Receita cadastrada com sucesso.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useAtualizarReceita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CadastrarReceitaRequest }) =>
      receitaApi.atualizar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      toast.success('Receita atualizada com sucesso.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useRemoverReceita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => receitaApi.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
      queryClient.invalidateQueries({ queryKey: ['resumo'] });
      toast.success('Receita removida.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
