'use client';

import { usePatrimonio } from '@/hooks/usePatrimonio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { PatrimonioComposicao } from './PatrimonioComposicao';

interface PatrimonioTotalProps {
  competencia: string;
}

export function PatrimonioTotal({ competencia }: PatrimonioTotalProps) {
  const { data, isLoading } = usePatrimonio(competencia);
  const itens = data?.patrimonios ?? [];
  const total = itens.reduce((sum, item) => sum + item.valor, 0);

  return (
    <Card className="w-full md:max-w-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Patrimônio
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-9 w-40" />
        ) : (
          <p className="font-numeric text-3xl font-bold tabular-nums">{formatCurrency(total)}</p>
        )}
        {/* Composição só em mobile e só com 2+ itens */}
        {!isLoading && itens.length >= 2 && (
          <div className="mt-4 md:hidden">
            <PatrimonioComposicao itens={itens} total={total} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
