import type { FrequenciaCobranca, StatusContaRecorrente } from '@/types/conta-recorrente';

export const FREQUENCIA_LABELS: Record<FrequenciaCobranca, string> = {
  SEMANAL: 'Semanal',
  MENSAL: 'Mensal',
  TRIMESTRAL: 'Trimestral',
  ANUAL: 'Anual',
};

export const STATUS_CONTA_LABELS: Record<StatusContaRecorrente, string> = {
  ATIVA: 'Ativa',
  PAUSADA: 'Pausada',
  ENCERRADA: 'Encerrada',
};

export const STATUS_CONTA_TEXT_CLASS: Record<StatusContaRecorrente, string> = {
  ATIVA: 'text-pos',
  PAUSADA: 'text-warn',
  ENCERRADA: 'text-muted-foreground',
};
