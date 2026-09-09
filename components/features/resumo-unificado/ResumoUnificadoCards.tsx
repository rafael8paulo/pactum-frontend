'use client';

import { useResumoMensal } from '@/hooks/useResumo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, cn } from '@/lib/utils';

interface ResumoUnificadoCardsProps {
  competencia: string;
}

export function ResumoUnificadoCards({ competencia }: ResumoUnificadoCardsProps) {
  const { data, isLoading, isError } = useResumoMensal(competencia);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {['Total Receitas', 'Total Despesas', 'Saldo'].map((label) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {['Total Receitas', 'Total Despesas', 'Saldo'].map((label) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Indisponível</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const saldoColor =
    data.saldo > 0 ? 'text-green-600' : data.saldo < 0 ? 'text-red-600' : '';
  const despPct =
    data.totalReceitas > 0
      ? Math.min(100, Math.round((data.totalDespesas / data.totalReceitas) * 100))
      : data.totalDespesas > 0
        ? 100
        : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(data.totalReceitas)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(data.totalDespesas)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-baseline justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
          <span className="text-xs font-medium text-muted-foreground">
            {despPct}% comprometido
          </span>
        </CardHeader>
        <CardContent>
          <p className={cn('text-2xl font-bold', saldoColor)}>{formatCurrency(data.saldo)}</p>
          <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full', data.saldo < 0 ? 'bg-red-500' : 'bg-red-400')}
              style={{ width: `${despPct}%` }}
            />
            <div className="h-full flex-1 bg-green-500/60" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
