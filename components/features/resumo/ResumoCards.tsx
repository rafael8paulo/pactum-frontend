'use client';

import { useResumoMensal } from '@/hooks/useResumo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosSalvosLabel } from '@/components/features/layout/DadosSalvosLabel';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, cn, percentualComprometido } from '@/lib/utils';

interface ResumoCardsProps {
  competencia: string;
}

const LABELS = ['Total Receitas', 'Total Despesas', 'Saldo'];

/** Apresentação desktop: três cards. (Mobile usa `SaldoHero`.) */
export function ResumoCards({ competencia }: ResumoCardsProps) {
  const { data, isLoading, isError, dataUpdatedAt } = useResumoMensal(competencia);

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {LABELS.map((label) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-sm text-muted-foreground">Indisponível</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const pct = percentualComprometido(data.totalReceitas, data.totalDespesas);

  return (
    <div className="space-y-2">
    <DadosSalvosLabel updatedAt={dataUpdatedAt} isError={isError} />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-pos">{formatCurrency(data.totalReceitas)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-neg">{formatCurrency(data.totalDespesas)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-baseline justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
          <span className="text-xs font-medium text-muted-foreground">{pct}% comprometido</span>
        </CardHeader>
        <CardContent>
          <p
            className={cn(
              'text-2xl font-bold',
              data.saldo > 0 && 'text-pos',
              data.saldo < 0 && 'text-neg'
            )}
          >
            {formatCurrency(data.saldo)}
          </p>
          <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-neg" style={{ width: `${pct}%` }} />
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
