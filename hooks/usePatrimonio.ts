import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { patrimonioApi } from '@/lib/api/patrimonio';
import type { CadastrarPatrimonioRequest, ListaPatrimonioResponse } from '@/types/patrimonio';

export function usePatrimonio(competencia: string) {
  return useQuery<ListaPatrimonioResponse>({
    queryKey: ['patrimonio', competencia],
    queryFn: () => patrimonioApi.listar(competencia),
  });
}

export function useCadastrarPatrimonio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CadastrarPatrimonioRequest) => patrimonioApi.cadastrar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimonio'] });
      toast.success('Item de patrimônio cadastrado com sucesso.');
    },
    onError: () => {
      toast.error('Erro ao cadastrar item. Tente novamente.');
    },
  });
}

export function useRemoverPatrimonio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patrimonioApi.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimonio'] });
      toast.success('Item removido.');
    },
    onError: () => {
      toast.error('Erro ao remover item.');
    },
  });
}
