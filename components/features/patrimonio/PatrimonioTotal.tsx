'use client';

import { usePatrimonio } from '@/hooks/usePatrimonio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/ui/page-loader';
import { formatCurrency } from '@/lib/utils';

interface PatrimonioTotalProps {
  competencia: string;
}

export function PatrimonioTotal({ competencia }: PatrimonioTotalProps) {
  const { data, isLoading } = usePatrimonio(competencia);

  if (isLoading) return <PageLoader />;

  const total = (data?.patrimonios ?? []).reduce((sum, item) => sum + item.valor, 0);

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Patrimônio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{formatCurrency(total)}</p>
      </CardContent>
    </Card>
  );
}
