import { useContasRecorrentes } from '@/hooks/useContasRecorrentes';
import { useFormasPagamento } from '@/hooks/useFormasPagamento';
import { useHistoricoAnual } from '@/hooks/useResumo';
import { useReceitas } from '@/hooks/useReceitas';

export interface OnboardingStep {
  id: 'forma-pagamento' | 'renda' | 'contas-fixas';
  label: string;
  done: boolean;
}

export interface OnboardingStatus {
  isLoading: boolean;
  steps: OnboardingStep[];
  completed: number;
  total: number;
  isComplete: boolean;
}

/**
 * Progresso do roteiro inicial derivado apenas dos dados do servidor —
 * nada é guardado no dispositivo, então é igual em qualquer aparelho.
 */
export function useOnboardingStatus(competencia: string): OnboardingStatus {
  const ano = Number(competencia.split('-')[0]);
  const formas = useFormasPagamento();
  const receitas = useReceitas(competencia);
  const historico = useHistoricoAnual(ano);
  const contas = useContasRecorrentes();

  const isLoading =
    formas.isLoading || receitas.isLoading || historico.isLoading || contas.isLoading;

  const temRenda =
    (receitas.data?.receitas.length ?? 0) > 0 ||
    (historico.data?.meses.some((m) => m.totalReceitas > 0) ?? false);

  const steps: OnboardingStep[] = [
    {
      id: 'forma-pagamento',
      label: 'Cadastrar forma de pagamento',
      done: (formas.data?.formasPagamento.length ?? 0) > 0,
    },
    { id: 'renda', label: 'Informar sua renda mensal', done: temRenda },
    {
      id: 'contas-fixas',
      label: 'Cadastrar contas fixas',
      done: (contas.data?.contasRecorrentes.length ?? 0) > 0,
    },
  ];
  const completed = steps.filter((s) => s.done).length;

  return { isLoading, steps, completed, total: steps.length, isComplete: completed === steps.length };
}
