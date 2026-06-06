'use client';

import { useResumoMensal } from '@/hooks/useResumo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/page-loader';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ResumoCardsProps {
  competencia: string;
}

export function ResumoCards({ competencia }: ResumoCardsProps) {
  const { data, isLoading, isError } = useResumoMensal(competencia);

  if (isLoading) return <PageLoader />;

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
    data.saldo > 0
      ? 'text-green-600'
      : data.saldo < 0
        ? 'text-red-600'
        : '';

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
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn('text-2xl font-bold', saldoColor)}>{formatCurrency(data.saldo)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
