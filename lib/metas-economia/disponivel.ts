import type { ProgressoMeta } from '../../types/meta-economia';

export type SituacaoDisponivel = 'positivo' | 'zero' | 'negativo';

export interface SaldoDisponivel {
  valor: number;
  situacao: SituacaoDisponivel;
}

/** Quanto do saldo do mês sobra depois de reservar a meta de economia. */
export function saldoDisponivelAposMeta(
  progresso: Pick<ProgressoMeta, 'valorEconomizado' | 'valorMeta'>
): SaldoDisponivel {
  // `+ 0` normaliza -0 para 0; o arredondamento evita ruído de ponto flutuante.
  const valor = Math.round((progresso.valorEconomizado - progresso.valorMeta) * 100) / 100 + 0;
  return { valor, situacao: valor > 0 ? 'positivo' : valor < 0 ? 'negativo' : 'zero' };
}
