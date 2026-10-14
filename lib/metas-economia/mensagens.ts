import type { ProgressoMeta } from '../../types/meta-economia';

export interface MensagemMeta {
  titulo: string;
  texto: string;
}

function brl(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

type CamposMensagem = Pick<ProgressoMeta, 'status' | 'valorDiarioNecessario' | 'diasRestantes'>;

/** Copy neutra: foca no ritmo necessário, nunca em "fracasso" (a projeção é linear e oscila no início do mês). */
export function mensagemPorStatus(p: CamposMensagem): MensagemMeta {
  switch (p.status) {
    case 'CONCLUIDA':
      return { titulo: 'Meta atingida!', texto: 'Parabéns! Você alcançou a sua meta de economia do mês.' };
    case 'ADIANTADA':
      return { titulo: 'Você está à frente', texto: 'Seu ritmo está acima do planejado. Continue assim!' };
    case 'NO_PLANEJADO':
      return { titulo: 'No ritmo certo', texto: 'Você está dentro do planejado para atingir a meta.' };
    case 'EM_RISCO': {
      if (p.diasRestantes > 0 && p.valorDiarioNecessario > 0) {
        return {
          titulo: 'Atenção ao ritmo',
          texto: `Para chegar lá, economize cerca de ${brl(p.valorDiarioNecessario)} por dia nos próximos ${p.diasRestantes} dias.`,
        };
      }
      return { titulo: 'Meta não atingida', texto: 'A meta deste mês não foi atingida. Ajuste o valor para o próximo mês.' };
    }
  }
}

export const MENSAGENS_MARCO: Record<number, string> = {
  25: 'Primeiro quarto da meta concluído! Bom começo.',
  50: 'Metade da meta alcançada! Você está no caminho.',
  75: 'Falta pouco: 75% da meta alcançada!',
  100: 'Meta de economia atingida! Parabéns!',
};

export function mensagemMarco(marco: number): string {
  return MENSAGENS_MARCO[marco] ?? `${marco}% da meta alcançados!`;
}
