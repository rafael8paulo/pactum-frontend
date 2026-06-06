'use client';

import { usePatrimonio } from '@/hooks/usePatrimonio';
import { PageLoader } from '@/components/ui/page-loader';
import { PatrimonioCard } from './PatrimonioCard';

interface PatrimonioGridProps {
  competencia: string;
}

export function PatrimonioGrid({ competencia }: PatrimonioGridProps) {
  const { data, isLoading } = usePatrimonio(competencia);

  if (isLoading) return <PageLoader />;

  if (!data?.patrimonios?.length) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Nenhum item de patrimônio encontrado para {competencia}.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.patrimonios.map((item) => (
        <PatrimonioCard key={item.id} patrimonio={item} />
      ))}
    </div>
  );
}
