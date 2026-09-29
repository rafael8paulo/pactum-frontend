import type { LancamentoItem } from './item';

export interface LancamentoGroup {
  key: string;
  label: string;
  total: number;
  items: LancamentoItem[];
}

const STATUS_ORDER = ['PENDENTE', 'AGENDADA', 'PAGA'] as const;
const STATUS_LABEL: Record<string, string> = {
  PENDENTE: 'Pendentes',
  AGENDADA: 'Agendadas',
  PAGA: 'Pagas',
};

const sum = (items: LancamentoItem[]) =>
  items.reduce((acc, item) => acc + item.valor, 0);

function porStatus(items: LancamentoItem[]): LancamentoGroup[] {
  return STATUS_ORDER.map((status) => {
    const grupo = items.filter((i) => i.status === status);
    return {
      key: status,
      label: STATUS_LABEL[status],
      total: sum(grupo),
      items: grupo,
    };
  }).filter((g) => g.items.length > 0);
}

function grupoUnico(items: LancamentoItem[], label: string): LancamentoGroup[] {
  if (items.length === 0) return [];
  return [{ key: 'todos', label, total: sum(items), items }];
}

function rotuloDia(iso: string, hoje: Date): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dia = new Date(y, m - 1, d);
  const diff = Math.round(
    (new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime() -
      dia.getTime()) /
      86_400_000
  );
  const curto = dia.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  if (diff === 0) return `Hoje · ${curto}`;
  if (diff === 1) return `Ontem · ${curto}`;
  return curto;
}

function porDia(items: LancamentoItem[], hoje: Date): LancamentoGroup[] {
  const mapa = new Map<string, LancamentoItem[]>();
  for (const item of items) {
    const dia = (item.data as string).slice(0, 10);
    mapa.set(dia, [...(mapa.get(dia) ?? []), item]);
  }
  return [...mapa.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dia, grupo]) => ({
      key: dia,
      label: rotuloDia(dia, hoje),
      total: sum(grupo),
      items: grupo,
    }));
}

/**
 * Ponto único de decisão do agrupamento. Enquanto a API não expõe data nos
 * lançamentos, agrupa por status (despesas) ou em grupo único (receitas);
 * quando todos os itens têm `data`, agrupa por dia. `TxList`/`TxRow` não mudam.
 */
export function groupLancamentos(
  items: LancamentoItem[],
  tipo: 'despesa' | 'receita',
  hoje: Date = new Date()
): LancamentoGroup[] {
  if (items.length > 0 && items.every((i) => !!i.data)) return porDia(items, hoje);
  return tipo === 'despesa' ? porStatus(items) : grupoUnico(items, 'Receitas');
}
