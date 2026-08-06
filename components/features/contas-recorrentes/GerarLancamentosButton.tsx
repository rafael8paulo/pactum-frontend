'use client';

import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useGerarLancamentosRecorrentes } from '@/hooks/useContasRecorrentes';
import { getCurrentCompetencia } from '@/lib/utils';

const MESES_EXTENSO = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function formatCompetenciaExtenso(competencia: string): string {
  const [year, month] = competencia.split('-');
  return `${MESES_EXTENSO[Number(month) - 1]}/${year}`;
}

export function GerarLancamentosButton() {
  const searchParams = useSearchParams();
  const competencia = searchParams.get('competencia') ?? getCurrentCompetencia();
  const gerar = useGerarLancamentosRecorrentes();

  const competenciaLabel = formatCompetenciaExtenso(competencia);

  function handleClick() {
    gerar.mutate(competencia, {
      onSuccess: (resultado) => {
        if (resultado.despesas.length > 0) {
          const contagem =
            resultado.despesas.length === 1
              ? '1 lançamento gerado'
              : `${resultado.despesas.length} lançamentos gerados`;
          toast.success(`${contagem} para ${competenciaLabel}.`);
        } else {
          toast.info(`Nenhum lançamento novo — já gerado para ${competenciaLabel}.`);
        }
      },
    });
  }

  return (
    <Button onClick={handleClick} disabled={gerar.isPending} variant="outline">
      {gerar.isPending ? <Spinner size="sm" /> : `Gerar lançamentos de ${competenciaLabel}`}
    </Button>
  );
}
