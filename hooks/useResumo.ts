import { useQuery } from '@tanstack/react-query';
import { resumoApi } from '@/lib/api/resumo';
import type { ResumoMensal, HistoricoAnualResponse } from '@/types/resumo';

export function useResumoMensal(competencia: string) {
  return useQuery<ResumoMensal>({
    queryKey: ['resumo', 'mensal', competencia],
    queryFn: () => resumoApi.mensal(competencia),
  });
}

export function useHistoricoAnual(ano: number, options?: { enabled?: boolean }) {
  return useQuery<HistoricoAnualResponse>({
    queryKey: ['resumo', 'anual', ano],
    queryFn: () => resumoApi.anual(ano),
    enabled: options?.enabled ?? true,
  });
}
