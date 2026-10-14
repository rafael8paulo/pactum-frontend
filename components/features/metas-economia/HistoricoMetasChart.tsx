'use client';

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import type { HistoricoMetaItem } from '@/types/meta-economia';

const MES_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
  '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
  '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez',
};

function formatYAxis(value: number): string {
  return Math.abs(value) >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value);
}

interface HistoricoMetasChartProps {
  meses: HistoricoMetaItem[];
}

/** Recharts fica isolado aqui para ser carregado sob demanda (ver HistoricoMetas). */
export function HistoricoMetasChart({ meses }: HistoricoMetasChartProps) {
  const dados = meses.map((m) => ({
    mes: MES_LABELS[m.competencia.split('-')[1]] ?? m.competencia,
    meta: m.valorMeta,
    economizado: m.valorEconomizado,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={dados} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} width={48} />
        <Tooltip formatter={(valor) => formatCurrency(Number(valor))} />
        <Legend />
        <Bar dataKey="meta" name="Meta" fill="#94a3b8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="economizado" name="Economizado" fill="#16a34a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
