'use client';

import { useResumoAssinaturas } from '@/hooks/useContasRecorrentes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

export function ResumoAssinaturasCards() {
  const { data, isLoading } = useResumoAssinaturas();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total mensal recorrente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <p className="text-2xl font-bold">
            {formatCurrency(data?.totalMensalRecorrente ?? 0)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
