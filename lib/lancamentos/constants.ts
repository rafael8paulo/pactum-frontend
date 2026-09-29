import {
  Briefcase,
  CircleEllipsis,
  CreditCard,
  GraduationCap,
  Home,
  Laptop,
  Receipt,
  Ticket,
  TrendingUp,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { CategoriaDespesa, StatusDespesa } from '@/types/despesa';
import type { CategoriaReceita } from '@/types/receita';

export type TipoLancamento = 'despesa' | 'receita';

export const STATUS_LABELS: Record<StatusDespesa, string> = {
  PAGA: 'Paga',
  PENDENTE: 'Pendente',
  AGENDADA: 'Agendada',
};

export const STATUS_LABELS_PLURAL: Record<StatusDespesa, string> = {
  PAGA: 'Pagas',
  PENDENTE: 'Pendentes',
  AGENDADA: 'Agendadas',
};

/** Ordem de exibição de grupos e segmentos. */
export const STATUS_ORDER: StatusDespesa[] = ['PENDENTE', 'AGENDADA', 'PAGA'];

/** Cores via tokens de tema — passam AA nos dois temas (ver globals.css). */
export const STATUS_TEXT_CLASS: Record<StatusDespesa, string> = {
  PAGA: 'text-pos',
  PENDENTE: 'text-warn',
  AGENDADA: 'text-brand',
};

export const STATUS_BADGE_CLASS: Record<StatusDespesa, string> = {
  PAGA: 'bg-pos-tint text-pos',
  PENDENTE: 'bg-warn-tint text-warn',
  AGENDADA: 'bg-brand-tint text-brand',
};

export interface CategoriaMeta<T extends string> {
  value: T;
  label: string;
  icon: LucideIcon;
}

export const CATEGORIAS_DESPESA: CategoriaMeta<CategoriaDespesa>[] = [
  { value: 'FINANCIAMENTO', label: 'Financiamento', icon: Home },
  { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito', icon: CreditCard },
  { value: 'EDUCACAO', label: 'Educação', icon: GraduationCap },
  { value: 'SERVICOS', label: 'Serviços', icon: Zap },
  { value: 'LAZER', label: 'Lazer', icon: Ticket },
  { value: 'IMPOSTO', label: 'Imposto', icon: Receipt },
  { value: 'OUTROS', label: 'Outros', icon: CircleEllipsis },
];

export const CATEGORIAS_RECEITA: CategoriaMeta<CategoriaReceita>[] = [
  { value: 'SALARIO', label: 'Salário', icon: Briefcase },
  { value: 'FREELANCE', label: 'Freelance', icon: Laptop },
  { value: 'INVESTIMENTO', label: 'Investimento', icon: TrendingUp },
  { value: 'OUTROS', label: 'Outros', icon: CircleEllipsis },
];

export function getCategoriaMeta(
  tipo: TipoLancamento,
  categoria: string
): CategoriaMeta<string> {
  const lista: CategoriaMeta<string>[] =
    tipo === 'despesa' ? CATEGORIAS_DESPESA : CATEGORIAS_RECEITA;
  return (
    lista.find((c) => c.value === categoria) ?? {
      value: categoria,
      label: categoria,
      icon: CircleEllipsis,
    }
  );
}
