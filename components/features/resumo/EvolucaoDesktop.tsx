'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Recharts fica fora do carregamento inicial: só é buscado quando o desktop monta o gráfico.
export const EvolucaoDesktop = dynamic(
  () =>
    import('@/components/features/resumo/EvolucaoAnualChart').then(
      (m) => m.EvolucaoAnualChart
    ),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> }
);
