'use client';

import { useResumoAssinaturas } from '@/hooks/useContasRecorrentes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

export function AssinaturasPorFormaPagamentoList() {
  const { data, isLoading } = useResumoAssinaturas();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Por forma de pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data?.porFormaPagamento.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Por forma de pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {data.porFormaPagamento.map((item) => (
            <li
              key={item.formaPagamentoId ?? 'sem-forma-pagamento'}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">
                {item.nomeFormaPagamento ?? 'Sem forma de pagamento'}
              </span>
              <span className="font-medium">{formatCurrency(item.totalMensal)}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
