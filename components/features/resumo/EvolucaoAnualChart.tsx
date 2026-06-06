'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useHistoricoAnual } from '@/hooks/useResumo';
import { PageLoader } from '@/components/ui/page-loader';
import { formatCurrency } from '@/lib/utils';

const MES_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
  '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
  '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez',
};

interface ChartEntry {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md text-sm space-y-1">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

function formatYAxis(value: number): string {
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return String(value);
}

interface EvolucaoAnualChartProps {
  ano: number;
}

export function EvolucaoAnualChart({ ano }: EvolucaoAnualChartProps) {
  const { data, isLoading } = useHistoricoAnual(ano);

  if (isLoading) return <PageLoader />;

  if (!data?.meses.length) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Sem dados de evolução para {ano}.
      </p>
    );
  }

  const chartData: ChartEntry[] = data.meses.map((m) => ({
    mes: MES_LABELS[m.competencia.split('-')[1]] ?? m.competencia,
    receitas: m.totalReceitas,
    despesas: m.totalDespesas,
    saldo: m.saldo,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} width={48} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="receitas" name="Receitas" fill="#16a34a" radius={[4, 4, 0, 0]} />
        <Bar dataKey="despesas" name="Despesas" fill="#dc2626" radius={[4, 4, 0, 0]} />
        <Line
          type="monotone"
          dataKey="saldo"
          name="Saldo"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
