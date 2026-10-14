import type { HistoricoMetaItem } from '../../types/meta-economia';

function mesAnterior(competencia: string): string {
  const [ano, mes] = competencia.split('-').map(Number);
  const d = new Date(ano, mes - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Variação do percentual em pontos percentuais em relação ao mês civil anterior.
 * `null` quando o mês anterior não tem meta (não há com o que comparar).
 */
export function variacaoVsMesAnterior(itens: HistoricoMetaItem[]): (number | null)[] {
  const porCompetencia = new Map(itens.map((i) => [i.competencia, i]));
  return itens.map((item) => {
    const anterior = porCompetencia.get(mesAnterior(item.competencia));
    return anterior ? Math.round((item.percentual - anterior.percentual) * 100) / 100 : null;
  });
}

/** Competências (yyyy-MM) comparam lexicograficamente. */
export function ehCompetenciaPassada(competencia: string, atual: string): boolean {
  return competencia < atual;
}
