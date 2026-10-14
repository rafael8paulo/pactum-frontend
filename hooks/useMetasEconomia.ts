import { isAxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { metasEconomiaApi } from '@/lib/api/metas-economia';
import { getErrorMessage } from '@/lib/api/error';
import type { HistoricoMetasResponse, ProgressoMeta } from '@/types/meta-economia';

/** `null` = competência sem meta (a API responde 404); não é um erro de tela. */
export async function buscarProgressoOuNull(competencia: string): Promise<ProgressoMeta | null> {
  try {
    return await metasEconomiaApi.progresso(competencia);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}

export function useProgressoMeta(competencia: string) {
  return useQuery<ProgressoMeta | null>({
    queryKey: ['metas-economia', 'progresso', competencia],
    queryFn: () => buscarProgressoOuNull(competencia),
  });
}

export function useHistoricoMetas(ano: number) {
  return useQuery<HistoricoMetasResponse>({
    queryKey: ['metas-economia', 'historico', ano],
    queryFn: () => metasEconomiaApi.historico(ano),
  });
}

export function useDefinirMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ competencia, valor }: { competencia: string; valor: number }) =>
      metasEconomiaApi.definir(competencia, { valor }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-economia'] });
      toast.success('Meta de economia salva.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useRemoverMeta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (competencia: string) => metasEconomiaApi.remover(competencia),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-economia'] });
      toast.success('Meta removida.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
