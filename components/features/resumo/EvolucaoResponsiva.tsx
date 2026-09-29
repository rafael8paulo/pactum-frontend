'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { EvolucaoCompacta } from './EvolucaoCompacta';
import { EvolucaoDesktop } from './EvolucaoDesktop';

interface EvolucaoResponsivaProps {
  competencia: string;
}

export function EvolucaoResponsiva({ competencia }: EvolucaoResponsivaProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const ano = Number(competencia.split('-')[0]);

  return (
    <div id="evolucao" className="scroll-mt-4">
      {isDesktop === undefined ? (
        <Skeleton className="h-[180px] w-full rounded-2xl" />
      ) : isDesktop ? (
        <EvolucaoDesktop ano={ano} />
      ) : (
        <EvolucaoCompacta competencia={competencia} />
      )}
    </div>
  );
}
