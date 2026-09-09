'use client';

import { useProximasCobrancas } from '@/hooks/useContasRecorrentes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

function formatData(data: string): string {
  const [year, month, day] = data.split('-');
  return `${day}/${month}/${year}`;
}

function isHoje(data: string): boolean {
  const hoje = new Date();
  const iso = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  return data === iso;
}

export function ProximasCobrancasBanner() {
  const { data, isLoading } = useProximasCobrancas();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Próximas cobranças (7 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : !data?.proximasCobrancas.length ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma cobrança prevista para os próximos dias.
          </p>
        ) : (
          <ul className="space-y-1">
            {data.proximasCobrancas.map((item) => (
              <li
                key={item.contaRecorrenteId}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2">
                  {item.descricao}
                  {isHoje(item.proximaCobranca) && (
                    <Badge variant="outline" className="text-primary">
                      Hoje
                    </Badge>
                  )}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    {formatData(item.proximaCobranca)}
                  </span>
                  <span className="font-medium">{formatCurrency(item.valorPadrao)}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
